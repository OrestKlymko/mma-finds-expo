import React, {useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    Platform,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Photo} from '@/models/model';
import {useRouter} from 'expo-router';
import {
    CheckCriteriaExistResponse,
    FoundationStyleResponse,
    NationalityResponse,
    SportTypeResponse,
    WeightClassResponse
} from '@/service/response';
import {checkExistFighterByEmail, checkExistFighterByName, createFighter} from '@/service/service';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {ImageSelectorComponent} from "@/components/ImageSelectorComponent";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import {Gender} from '@/components/Gender';
import {WeightClassComponent} from '@/components/WeightClassComponent';
import {DateOfBirth} from "@/components/fighter/DateOfBIrth";
import {HeightInput} from '@/components/fighter/HeightInput';
import {ReachInput} from '@/components/fighter/ReachInput';
import {NationalityDropdown} from '@/components/NationalityDropdown';
import {CountryAutocompleteInput} from "@/components/CityAutocompleteInput";
import {FoundationStyleDropdown} from "@/components/fighter/FoundationStyleDropdown";
import {SportTypeMultiSelectDropdown} from "@/components/fighter/SportTypeMultiSelectDropdown";
import SocialMediaModal from "@/components/SocialMediaModal";
import {TapologyLinkInput} from '@/components/fighter/TapologyLinkInput';
import MissingFieldsModal from "@/components/offers/MissingFieldsModal";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {MultiSportRecordInputs, RecordsBySport} from "@/components/fighter/MultiSportRecordInputs";
import {cmToFeetInches, feetInchesToCm} from "@/utils/unitConversions";


const CreateFightersProfileScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [minWeight, setMinWeight] = useState('');
    const [maxWeight, setMaxWeight] = useState('');
    const [sportRecords, setSportRecords] = useState<RecordsBySport>({});

    // Фото бійця
    const [profileImage, setProfileImage] = useState<Photo | null>(null);
    const [loading, setLoading] = useState(false);
    const [noTapologyLink, setNoTapologyLink] = useState(false);
    const [tapologyLink, setTapologyLink] = useState('');
    // Поля
    const [nameSurname, setNameSurname] = useState('');
    const [nickname, setNickname] = useState('');
    const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
    const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
    // Дата народження + age
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [age, setAge] = useState('');
    const [weightClass, setWeightClass] = useState<WeightClassResponse | null>(
        null,
    );
    const [gender, setGender] = useState<string | null>(null);
    const [heightValue, setHeightValue] = useState('');
    const [heightUnit, setHeightUnit] = useState<'cm' | 'inch'>('cm');
    const [reachValue, setReachValue] = useState('');
    const [reachUnit, setReachUnit] = useState<'cm' | 'inch'>('cm');
    const [gymName, setGymName] = useState('');
    const [nationality, setNationality] = useState<NationalityResponse | null>(
        null,
    );
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [basedIn, setBasedIn] = useState('');

    const [heightFeet, setHeightFeet] = useState(''); // Для зріст (feet)
    const [heightInches, setHeightInches] = useState(''); // Для зріст (inches)
    const [reachFeet, setReachFeet] = useState(''); // Для reach (feet)
    const [reachInches, setReachInches] = useState(''); // Для reach (inches)
    const [selectedSportTypes, setSelectedSportTypes] = useState<
        SportTypeResponse[]
    >([]);
    // Foundation Style
    const [foundationStyle, setFoundationStyle] =
        useState<FoundationStyleResponse>();
    const [sherdogLink, setSherdogLink] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Social Media
    const [socialList, setSocialList] = useState<
        { network: string; link: string }[]
    >([]);

    // About Fighter
    const [aboutFighter, setAboutFighter] = useState('');

    const [continent, setContinent] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [emailFighter, setEmailFighter] = useState('');
    const [agreeDisclaimer, setAgreeDisclaimer] = useState(false);


    const getMissingRequiredFields = () => {
        const missing: string[] = [];
        if (!profileImage) missing.push('Profile Image');
        if (!emailFighter) missing.push('Fighter Email');
        if (!nameSurname) missing.push('Name and Surname');
        if (!gender) missing.push('Gender');
        if (!dateOfBirth) missing.push('Date of Birth');
        if (!weightClass) missing.push('Weight Class');
        if (!nationality) missing.push('Nationality');
        if (!foundationStyle) missing.push('Foundation Style');
        if (!selectedSportTypes.length) missing.push('Sport Types');
        selectedSportTypes.forEach(st => {
            const r = sportRecords[st.id];
            if (!r || !r.proWins || !r.proLoss || !r.proDraw) missing.push(`${st.name} – professional record`);
            if (!r || !r.amWins || !r.amLoss || !r.amDraw) missing.push(`${st.name} – amateur record`);
        });

        if (!minWeight || !maxWeight) missing.push('Min/Max Weight');
        if (noTapologyLink && !tapologyLink)
            missing.push('Tapology Link');
        return missing;
    }
    // Submit
    const onSignUpPress = () => {
        if (!agreeDisclaimer) {
            Alert.alert('Please read and agree to the disclaimer.');
            return;
        }
        if (!emailAvailable || !nameAvailable) {
            Alert.alert('We already have a fighter with this name or email.');
            return;
        }
        setHasSubmitted(true);
        const missing = getMissingRequiredFields();
        if (missing.length > 0) {
            setMissingFields(missing);
            setModalVisible(true);
            return;
        }

        setLoading(true);
        const formData = new FormData();
        const formattedDate = dateOfBirth?.toISOString().split('T')[0];
        formData.append('name', nameSurname);
        formData.append('nickname', nickname);
        if (profileImage) {
            formData.append('image', {
                uri: profileImage.uri,
                type: profileImage.type || 'image/jpeg',
                name: profileImage.name || `profile_${Date.now()}.jpg`,
            });
        }
        let heightCm: number;
        let heightF: number;
        let heightIn: number;

        if (heightUnit === 'cm') {
            heightCm = parseFloat(heightValue) || 0;
            ({feet: heightF, inches: heightIn} = cmToFeetInches(heightCm));
        } else {
            heightF = parseFloat(heightFeet) || 0;
            heightIn = parseFloat(heightInches) || 0;
            heightCm = feetInchesToCm(heightF, heightIn);
        }

        formData.append('heightCm', heightCm.toFixed(2));
        formData.append('heightFeet', heightF.toString());
        formData.append('heightInches', heightIn.toString());

        // ————— REACH —————
        let reachCm: number;
        let reachF: number;
        let reachIn: number;

        if (reachUnit === 'cm') {
            reachCm = parseFloat(reachValue) || 0;
            ({feet: reachF, inches: reachIn} = cmToFeetInches(reachCm));
        } else {
            reachF = parseFloat(reachFeet) || 0;
            reachIn = parseFloat(reachInches) || 0;
            reachCm = feetInchesToCm(reachF, reachIn);
        }

        formData.append('reachCm', reachCm.toFixed(2));
        formData.append('reachFeet', reachF.toString());
        formData.append('reachInches', reachIn.toString());

        // // ————— WEIGHT RANGE —————)
        // const minKg = parseFloat() || 0;
        // const maxKg = parseFloat(maxWeight) || 0;
        // const minLbs = kgToLbs(minKg);
        // const maxLbs = kgToLbs(maxKg);

        formData.append('minWeight', minWeight);
        formData.append('maxWeight', maxWeight);
        formData.append('gender', gender);
        formData.append('dateOfBirth', formattedDate || '');
        formData.append('age', age);
        formData.append('gymName', gymName);
        formData.append('tapologyLink', noTapologyLink ? '' : tapologyLink);
        formData.append('sherdogLink', sherdogLink);
        formData.append('description', aboutFighter);
        formData.append('sportTypeId', selectedSportTypes.map(s => s.id).join(','));
        formData.append(
            'instagramUsername',
            socialList.find(item => item.network === 'Instagram')?.link || '',
        );
        formData.append(
            'facebookUsername',
            socialList.find(item => item.network === 'Facebook')?.link || '',
        );
        formData.append(
            'twitterUsername',
            socialList.find(item => item.network === 'Twitter')?.link || '',
        );
        formData.append(
            'snapchatUsername',
            socialList.find(item => item.network === 'Snapchat')?.link || '',
        );

        formData.append('foundationStyleId', foundationStyle?.id);
        formData.append('nationalityId', nationality?.id);
        formData.append('weightClassId', weightClass?.id);
        formData.append('country', country);
        formData.append('continent', continent);
        formData.append('minWeight', minWeight);
        formData.append('maxWeight', maxWeight);
        formData.append('fighterEmail', emailFighter.toLowerCase());
        Object.entries(sportRecords).forEach(([sportId, rec]) => {
            const jsonString = JSON.stringify({
                sportTypeId: sportId,
                proWins: rec.proWins ?? 0,
                proLoss: rec.proLoss ?? 0,
                proDraw: rec.proDraw ?? 0,
                amWins: rec.amWins ?? 0,
                amLoss: rec.amLoss ?? 0,
                amDraw: rec.amDraw ?? 0,
            });
            formData.append('sportsScore', jsonString);
        });
        createFighter(formData)
            .then(() => {
                router.push('/(app)/(tabs)/feed');
            })
            .catch((e) => {
                Alert.alert('Failed to create fighter profile');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleExistNameSurname = () => {
        if (!nameSurname) {
            setNameAvailable(null);
            return;
        }
        checkExistFighterByName({criteria: nameSurname})
            .then((data: CheckCriteriaExistResponse) => {
                setNameAvailable(!data.existEntity);
            })
            .catch(() => setNameAvailable(null));
    };

    // Check email availability
    const handleExistEmail = () => {
        if (!emailFighter) {
            setEmailAvailable(null);
            return;
        }
        checkExistFighterByEmail({criteria: emailFighter.toLowerCase()})
            .then((data: CheckCriteriaExistResponse) => {
                setEmailAvailable(!data.existEntity);
            })
            .catch(() => setEmailAvailable(null));
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.background}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <GoBackButton/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <Text style={styles.headerRoboto}>Create Fighter’s Profile</Text>
                <View style={styles.imageContainer}>
                    <View>
                        <Text style={styles.titleProfile}>Photo*</Text>
                        <Text style={styles.subtitleProfile}>
                            Please insert fighter&#39;s photo.
                        </Text>
                    </View>
                    <ImageSelectorComponent
                        setPhoto={setProfileImage}
                        image={profileImage}
                        hasSubmitted={hasSubmitted}
                    />
                </View>

                <FloatingLabelInput
                    label="Fighter's Email*"
                    value={emailFighter}
                    onChangeText={setEmailFighter}
                    containerStyle={[emailAvailable == null && styles.inputContainer]}
                    onBlur={handleExistEmail}
                />
                {emailAvailable != null && (
                    <View style={styles.statusRow}>
                        <MaterialCommunityIcons
                            name={emailAvailable ? "check-circle-outline" : "close-circle-outline"}
                            size={16}
                            color={emailAvailable ? colors.primaryGreen : '#FF3B30'}
                        />
                        <Text style={[styles.statusText, {color: emailAvailable ? colors.primaryGreen : '#FF3B30'}]}>
                            {emailAvailable ? 'Email is available' : 'Email is already registered'}
                        </Text>
                    </View>
                )}
                {/* Name, Nickname */}
                <FloatingLabelInput
                    label="Name and Surname*"
                    value={nameSurname}
                    hasSubmitted={hasSubmitted}
                    isRequired={true}
                    onChangeText={setNameSurname}
                    onBlur={handleExistEmail}
                    containerStyle={[nameAvailable == null && styles.inputContainer]}
                />
                {nameAvailable != null && (
                    <View style={styles.statusRow}>
                        <MaterialCommunityIcons
                            name={nameAvailable ? "check-circle-outline" : "close-circle-outline"}
                            size={16}
                            color={nameAvailable ? colors.primaryGreen : '#FF3B30'}
                        />
                        <Text style={[styles.statusText, {color: nameAvailable ? colors.primaryGreen : '#FF3B30'}]}>
                            {nameAvailable ? 'Name is available' : 'Name is already registered'}
                        </Text>
                    </View>
                )}
                <FloatingLabelInput
                    label="Nickname"
                    value={nickname}
                    onChangeText={setNickname}
                    containerStyle={styles.inputContainer}
                />

                {/* Gender */}
                <Gender
                    gender={gender}
                    setGender={setGender}
                    hasSubmitted={hasSubmitted}
                />

                <DateOfBirth
                    dateOfBirth={dateOfBirth}
                    setDateOfBirth={setDateOfBirth}
                    hasSubmitted={hasSubmitted}
                    setAge={setAge}
                    age={age}
                />

                {/* Weight Class */}
                <WeightClassComponent onSelect={setWeightClass}/>

                {/* Вибір одиниць зросту */}
                <HeightInput
                    heightValue={heightValue}
                    setHeightValue={setHeightValue}
                    heightFeet={heightFeet}
                    setHeightFeet={setHeightFeet}
                    heightInches={heightInches}
                    setHeightInches={setHeightInches}
                    heightUnit={heightUnit}
                    setHeightUnit={setHeightUnit}
                />

                {/* Reach Section */}
                <ReachInput
                    reachValue={reachValue}
                    setReachValue={setReachValue}
                    reachFeet={reachFeet}
                    setReachFeet={setReachFeet}
                    reachInches={reachInches}
                    setReachInches={setReachInches}
                    reachUnit={reachUnit}
                    setReachUnit={setReachUnit}
                />

                {/* Gym Name */}
                <FloatingLabelInput
                    label="Gym Name"
                    value={gymName}
                    onChangeText={setGymName}
                    containerStyle={styles.inputContainer}
                />

                {/* Nationality* */}
                <NationalityDropdown
                    nationality={nationality}
                    setNationality={setNationality}
                    hasSubmitted={hasSubmitted}
                />

                {/* Based In* */}
                <CountryAutocompleteInput
                    label="Country of Residence*"
                    value={basedIn}
                    onChangeCountry={setCountry}
                    onChangeContinent={setContinent}
                    error={basedIn === ''}
                />

                {/* Sport Style* */}
                <SportTypeMultiSelectDropdown
                    selectedSportTypes={selectedSportTypes}
                    setSelectedSportTypes={setSelectedSportTypes}
                    hasSubmitted={hasSubmitted}
                />
                {/* Professional MMA Record* */}
                <MultiSportRecordInputs
                    selectedSportTypes={selectedSportTypes}
                    records={sportRecords}
                    setRecords={setSportRecords}
                    hasSubmitted={hasSubmitted}
                />


                {/* Foundation Style* */}


                <FoundationStyleDropdown
                    foundationStyle={foundationStyle}
                    setFoundationStyle={setFoundationStyle}
                    hasSubmitted={hasSubmitted}
                />


                <TapologyLinkInput
                    tapologyLink={tapologyLink}
                    setTapologyLink={setTapologyLink}
                    hasSubmitted={hasSubmitted}
                />

                {/* Sherdog Link */}
                <FloatingLabelInput
                    label="Sherdog Link"
                    value={sherdogLink}
                    onChangeText={setSherdogLink}
                    containerStyle={styles.inputContainer}
                />

                <SocialMediaModal
                    setSocialList={setSocialList}
                    socialList={socialList}
                />

                {/* About the Fighter */}
                <FloatingLabelInput
                    label="About the Fighter"
                    value={aboutFighter}
                    onChangeText={setAboutFighter}
                    containerStyle={styles.inputContainer}
                    multiline={true}
                />
                <Text style={styles.sectionTitle}>
                    Preferred Weight Range for Offers*
                </Text>
                <View style={styles.recordRow}>
                    <FloatingLabelInput
                        label="Min Weight (kg)"
                        value={minWeight}
                        onChangeText={setMinWeight}
                        keyboardType="numeric"
                        isRequired={true}
                        hasSubmitted={hasSubmitted}
                        containerStyle={[
                            styles.recordInput
                        ]}
                    />
                    <FloatingLabelInput
                        label="Max Weight (kg)"
                        value={maxWeight}
                        onChangeText={setMaxWeight}
                        keyboardType="numeric"
                        isRequired={true}
                        hasSubmitted={hasSubmitted}
                        containerStyle={[
                            styles.recordInput
                        ]}
                    />
                </View>

                {/* I agree */}
                <View style={styles.switchContainer}>
                    <Switch
                        value={agreeDisclaimer}
                        onValueChange={setAgreeDisclaimer}
                        trackColor={{false: colors.gray, true: colors.primaryGreen}}
                        thumbColor={agreeDisclaimer ? colors.white : colors.gray}
                    />
                    <Text style={styles.switchLabel}>
                        I confirm that I am authorized to represent the fighter{' '}
                        {nameSurname || ''} on the MMA Finds platform and have obtained
                        written or verbal consent from the fighter. I acknowledge the
                        criminal liability for any forgery or false information provided.*
                    </Text>
                </View>

                {/* Create Fighter’s Profile */}
                <TouchableOpacity
                    style={styles.createFighterButton}
                    onPress={onSignUpPress}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white}/>
                    ) : (
                        <Text style={styles.createFighterButtonText}>
                            Create Fighter’s Profile
                        </Text>
                    )}
                </TouchableOpacity>

                <MissingFieldsModal
                    visible={modalVisible}
                    missingFields={missingFields}
                    onClose={() => setModalVisible(false)}
                />

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CreateFightersProfileScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 38,
    },
    headerRoboto: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 20,
        color: colors.primaryBlack,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    titleProfile: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 19,
        marginBottom: 12,
        color: 'rgb(19, 19, 19)',
    },
    subtitleProfile: {
        fontSize: 11,
        fontWeight: '400',
        lineHeight: 13,
        color: 'rgb(61, 61, 61)',
        marginBottom: 10,
    },
    imagePlaceholder: {
        width: 84,
        height: 84,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },

    grayField: {
        width: '100%',
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    grayFieldText: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.primaryBlack,
    },

    grayFieldTextManager: {
        fontSize: 16,
        color: colors.primaryBlack,
        paddingVertical: 8,
    },
    inputContainer: {
        marginBottom: 20,
    },

    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        height: 56,
        backgroundColor: colors.white,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        backgroundColor: colors.white,
        marginBottom: 15,
    },
    dropdownItem: {
        padding: 12,
        fontSize: 16,
        color: colors.primaryBlack,
    },
    rowContainer: {
        flexDirection: 'row',
    },
    flexDirectionRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    unitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 0, // Залежно від FloatingLabelInput
    },

    basedInField: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        width: '100%',
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        height: 56,
        backgroundColor: colors.white,
    },
    basedInText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchLabel: {
        flex: 1,
        fontSize: 11,
        color: colors.primaryBlack,
        marginLeft: 10,
    },

    createFighterButton: {
        height: 54,
        backgroundColor: colors.primaryBlack,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    createFighterButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 5,
    },
    recordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    recordInput: {
        flex: 1,
        marginRight: 8,
        borderRadius: 8,
    },
    statusRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingLeft: 4, marginTop: 5},
    statusText: {fontSize: 12, marginLeft: 6},
});
