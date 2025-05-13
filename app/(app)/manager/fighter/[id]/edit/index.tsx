import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
    FighterFullProfile,
    FoundationStyleResponse,
    NationalityResponse,
    SportTypeResponse,
    WeightClassResponse
} from '@/service/response';
import {Photo} from "@/models/model";
import {getFoundationStyles, getNationalities, getSportTypes, getUpdateFighter, getWeightClasses, updateFighter } from '@/service/service';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import { ImageSelectorComponent } from '@/components/ImageSelectorComponent';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import { Gender } from '@/components/Gender';
import { DateOfBirth } from '@/components/fighter/DateOfBIrth';
import {WeightClassComponent} from "@/components/WeightClassComponent";
import {HeightInput} from "@/components/fighter/HeightInput";
import { ReachInput } from '@/components/fighter/ReachInput';
import { NationalityDropdown } from '@/components/NationalityDropdown';
import { CountryAutocompleteInput } from '@/components/CityAutocompleteInput';
import { ProfessionalRecordInputs } from '@/components/ProfessionalRecordInputs';
import {AmateurRecordInputs} from "@/components/AmateurRecordInputs";
import {FoundationStyleDropdown} from "@/components/fighter/FoundationStyleDropdown";
import { SportTypeMultiSelectDropdown } from '@/components/fighter/SportTypeMultiSelectDropdown';
import { TapologyLinkInput } from '@/components/fighter/TapologyLinkInput';
import SocialMediaModal from "@/components/SocialMediaModal";
import {useLocalSearchParams} from "expo-router";
import MissingFieldsModal from "@/components/offers/MissingFieldsModal";



const EditFightersProfileScreen = () => {
    const {id} = useLocalSearchParams<{id: string}>();
    const [fighter, setFighter] = useState<FighterFullProfile | null>(null);
    const [minWeight, setMinWeight] = useState('');
    const [maxWeight, setMaxWeight] = useState('');
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [selectedSportTypes, setSelectedSportTypes] = useState<
        SportTypeResponse[]
    >([]);
    const [profileImage, setProfileImage] = useState<Photo | null>(null);
    const [oldPhoto, setOldPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [noTapologyLink, setNoTapologyLink] = useState(false);

    const [nameSurname, setNameSurname] = useState('');
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');

    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [age, setAge] = useState('');
    const [weightClass, setWeightClass] = useState<WeightClassResponse | null>(
        null,
    );
    const [heightValue, setHeightValue] = useState('');
    const [heightUnit, setHeightUnit] = useState<'cm' | 'inch'>('cm');
    const [heightFeet, setHeightFeet] = useState('');
    const [heightInches, setHeightInches] = useState('');
    const [missingFields, setMissingFields] = useState<string[]>([]);

    const [reachValue, setReachValue] = useState('');
    const [reachUnit, setReachUnit] = useState<'cm' | 'inch'>('cm');
    const [reachFeet, setReachFeet] = useState('');
    const [reachInches, setReachInches] = useState('');

    const [gymName, setGymName] = useState('');

    const [nationality, setNationality] = useState<NationalityResponse | null>(
        null,
    );
    const [basedIn, setBasedIn] = useState('');
    const [country, setCountry] = useState('');
    const [continent, setContinent] = useState('');
    const [proWins, setProWins] = useState('');
    const [proLoss, setProLoss] = useState('');
    const [proDraw, setProDraw] = useState('');

    const [amWins, setAmWins] = useState('');
    const [amLoss, setAmLoss] = useState('');
    const [amDraw, setAmDraw] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [foundationStyle, setFoundationStyle] =
        useState<FoundationStyleResponse | null>(null);

    const [sherdogLink, setSherdogLink] = useState('');
    const [tapologyLink, setTapologyLink] = useState('');
    const [tapologyError, setTapologyError] = useState('');

    const [aboutFighter, setAboutFighter] = useState('');
    const [socialList, setSocialList] = useState<
        {network: string; link: string}[]
    >([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // --- 1) Load reference data & manager info
    useEffect(() => {
        if(!fighter) return;
        getNationalities().then(data => {
            const found = data.find(n => n.id === fighter.nationalId);
            if (found) {
                setNationality(found);
            }
        });
        getWeightClasses().then(data => {
            const foundWC = data.find(wc => wc.id === fighter.weightClassId);

            if (foundWC) {
                setWeightClass(foundWC);
            }
        });
        getFoundationStyles().then(data => {
            const foundFS = data.find(fs => fs.id === fighter.foundationStyleId);
            if (foundFS) {
                setFoundationStyle(foundFS);
            }
        });

        getSportTypes().then(data => {
            const selected = data.filter(sport =>
                Array.isArray(fighter.sportTypeId)
                    ? fighter.sportTypeId.includes(sport.id)
                    : sport.id === fighter.sportTypeId,
            );
            setSelectedSportTypes(selected);
        });
    }, [fighter]);

    // --- 2) Load the fighter to update
    useEffect(() => {
        if (id) {
            getUpdateFighter(id)
                .then(data => {
                    setFighter(data);
                })
                .catch(() => {
                    Alert.alert('Error', 'Failed to load fighter data.');
                });
        }
    }, [id]);

    // --- 3) Once the fighter is loaded, populate states
    useEffect(() => {
        if (!fighter) return;

        // Basic info
        setNameSurname(fighter.name ?? '');
        setNickname(fighter.nickname ?? '');
        setGender(fighter.gender ?? '');
        // Convert date string to Date
        if (fighter.dateOfBirth) {
            const dob = new Date(fighter.dateOfBirth);
            setDateOfBirth(dob);
            const nowYear = new Date().getFullYear();
            setAge(String(nowYear - dob.getFullYear()));
        }

        if (fighter.heightFeet && fighter.heightFeet > 0) {
            setHeightUnit('inch');
            const feetPart = Math.floor(fighter.heightFeet); // e.g., 5
            const inchesPart = Math.round((fighter.heightFeet - feetPart) * 12); // approximate
            setHeightFeet(String(feetPart));
            setHeightInches(String(inchesPart));
        } else {
            setHeightUnit('cm');
            setHeightValue(fighter.height ? String(fighter.height) : '');
        }

        if (fighter.reachFeet && fighter.reachFeet > 0) {
            setReachUnit('inch');
            const feetPart = Math.floor(fighter.reachFeet);
            const inchesPart = Math.round((fighter.reachFeet - feetPart) * 12);
            setReachFeet(String(feetPart));
            setReachInches(String(inchesPart));
        } else {
            setReachUnit('cm');
            setReachValue(fighter.reach ? String(fighter.reach) : '');
        }

        setGymName(fighter.gymName ?? '');
        setBasedIn(fighter.country ?? '');
        setContinent(fighter.continent ?? '');
        setCountry(fighter.countryName ?? '');
        // Records
        setProWins(String(fighter.professionalMmaRecordWin ?? 0));
        setProLoss(String(fighter.professionalMmaRecordLose ?? 0));
        setProDraw(String(fighter.professionalMmaRecordDraw ?? 0));
        setAmWins(String(fighter.amateurMmaRecordWin ?? 0));
        setAmLoss(String(fighter.amateurMmaRecordLose ?? 0));
        setAmDraw(String(fighter.amateurMmaRecordDraw ?? 0));

        // Foundation style (match after foundationStyles loaded)

        // Links
        setTapologyLink(fighter.tapologyLink ?? '');
        setNoTapologyLink(!fighter.tapologyLink); // If no link in DB => no link
        setSherdogLink(fighter.sherdogLink ?? '');
        setAboutFighter(fighter.description ?? '');

        // Social media
        const newSocialList: {network: string; link: string}[] = [];
        if (fighter.instagramUsername) {
            newSocialList.push({
                network: 'Instagram',
                link: fighter.instagramUsername,
            });
        }
        if (fighter.facebookUsername) {
            newSocialList.push({network: 'Facebook', link: fighter.facebookUsername});
        }
        if (fighter.twitterUsername) {
            newSocialList.push({network: 'Twitter', link: fighter.twitterUsername});
        }
        if (fighter.snapchatUsername) {
            newSocialList.push({network: 'Snapchat', link: fighter.snapchatUsername});
        }
        setSocialList(newSocialList);

        // Profile image
        if (fighter.imageLink) {
            // If your ImageSelectorComponent can handle URIs from the web,
            // you can set it directly to the fighter.imageLink.
            setProfileImage({
                uri: fighter.imageLink || null,
                type: 'image/jpeg',
                name: `profile_${Date.now()}.jpg`,
            });
            setOldPhoto(fighter.imageLink);
        }
    }, [fighter]);

    const getMissingRequiredFields=()=>  {
        const missing: string[] = [];
        if (!profileImage)        missing.push('Profile Image');
        if (!nameSurname)         missing.push('Name and Surname');
        if (!gender)              missing.push('Gender');
        if (!dateOfBirth)         missing.push('Date of Birth');
        if (!weightClass)         missing.push('Weight Class');
        if (!nationality)         missing.push('Nationality');
        if (!foundationStyle)     missing.push('Foundation Style');
        if (!selectedSportTypes.length) missing.push('Sport Types');
        if (!minWeight || !maxWeight)  missing.push('Min/Max Weight');
        if (!proWins || !proLoss || !proDraw)
            missing.push('Professional Record');
        if (!noTapologyLink && !tapologyLink)
            missing.push('Tapology Link');
        return missing;
    }
    // --- Submission: Update Fighter
    const onUpdatePress = () => {
        setHasSubmitted(true);
        const missing = getMissingRequiredFields();
        if (missing.length > 0) {
            setMissingFields(missing);
            setModalVisible(true);
            return;
        }

        // Prepare FormData for update
        setLoading(true);
        const formData = new FormData();

        // Date formatting
        const formattedDate = dateOfBirth?.toISOString().split('T')[0];

        formData.append('name', nameSurname);
        formData.append('nickname', nickname);
        formData.append('image', {
            uri: profileImage?.uri,
            type: profileImage?.type,
            name: profileImage?.name,
        });

        formData.append('oldPhoto', oldPhoto as string);
        formData.append('gender', gender);
        formData.append('dateOfBirth', formattedDate || '');
        formData.append('age', age);

        // Height
        if (heightUnit === 'cm') {
            formData.append('height', heightValue.trim() === '' ? '0' : heightValue);
            // You might want to send heightFeet=0
            formData.append('heightFeet', '0');
        } else {
            // Combine feet+inches if needed
            const feetNum = parseFloat(heightFeet) || 0;
            const inchesNum = parseFloat(heightInches) || 0;
            const totalFeet = feetNum + inchesNum / 12;
            // Some backends store a float in heightFeet
            formData.append('heightFeet', String(totalFeet));
            formData.append('height', '0');
        }

        // Reach
        if (reachUnit === 'cm') {
            formData.append('reach', reachValue.trim() === '' ? '0' : reachValue);
            formData.append('reachFeet', '0');
        } else {
            const feetNum = parseFloat(reachFeet) || 0;
            const inchesNum = parseFloat(reachInches) || 0;
            const totalFeet = feetNum + inchesNum / 12;
            formData.append('reachFeet', String(totalFeet));
            formData.append('reach', '0');
        }

        formData.append('gymName', gymName);
        formData.append('professionalMmaRecordWin', proWins);
        formData.append('professionalMmaRecordLoss', proLoss);
        formData.append('professionalMmaRecordDraw', proDraw);
        formData.append('amateurMmaRecordWin', amWins === '' ? '0' : amWins);
        formData.append('amateurMmaRecordLoss', amLoss === '' ? '0' : amLoss);
        formData.append('amateurMmaRecordDraw', amDraw === '' ? '0' : amDraw);

        formData.append('tapologyLink', noTapologyLink ? '' : tapologyLink);
        formData.append('sherdogLink', sherdogLink);
        formData.append('description', aboutFighter);
        formData.append('sportTypeId', selectedSportTypes?.map(t => t.id) ?? []);

        // Social networks
        // If your backend expects them as separate fields:
        const instagramLink =
            socialList.find(item => item.network === 'Instagram')?.link ?? '';
        const facebookLink =
            socialList.find(item => item.network === 'Facebook')?.link ?? '';
        const twitterLink =
            socialList.find(item => item.network === 'Twitter')?.link ?? '';
        const snapchatLink =
            socialList.find(item => item.network === 'Snapchat')?.link ?? '';

        formData.append('instagramUsername', instagramLink);
        formData.append('facebookUsername', facebookLink);
        formData.append('twitterUsername', twitterLink);
        formData.append('snapchatUsername', snapchatLink);
        formData.append('foundationStyleId', foundationStyle?.id ?? '');
        formData.append('nationalityId', nationality?.id ?? ''); // or 'nationalityId' if your backend uses that

        formData.append('weightClassId', weightClass?.id ?? '');
        formData.append('country', country);
        formData.append('continent', continent);
        formData.append('minWeight', minWeight);
        formData.append('maxWeight', maxWeight);

        if (!fighter) return;
        updateFighter(fighter?.id, formData)
            .then(() => {
                Alert.alert('Success', 'Fighter profile updated successfully');
                navigation.goBack(); // or wherever you want to navigate
            })
            .catch(() => {
                Alert.alert('Error', 'Failed to update fighter profile');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.background}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <Text style={styles.headerRoboto}>Edit Fighter’s Profile</Text>

                {/* Photo */}
                <View style={styles.imageContainer}>
                    <View>
                        <Text style={styles.titleProfile}>Photo*</Text>
                        <Text style={styles.subtitleProfile}>
                            Please insert fighter&#39;s photo.
                        </Text>
                    </View>
                    <ImageSelectorComponent
                        setPhoto={photo => {
                            setProfileImage(photo);
                            setOldPhoto(null);
                        }}
                        image={profileImage}
                        hasSubmitted={hasSubmitted}
                    />
                </View>

                <FloatingLabelInput
                    label="Name and Surname*"
                    value={nameSurname}
                    hasSubmitted={hasSubmitted}
                    isRequired={true}
                    onChangeText={setNameSurname}
                    containerStyle={styles.inputContainer}
                />
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
                <WeightClassComponent
                    onSelect={setWeightClass}
                    selectedWeightClass={weightClass}
                />

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

                {/* Professional MMA Record* */}
                <ProfessionalRecordInputs
                    proWins={proWins}
                    setProWins={setProWins}
                    proLoss={proLoss}
                    setProLoss={setProLoss}
                    proDraw={proDraw}
                    setProDraw={setProDraw}
                    hasSubmitted={hasSubmitted}
                />

                <AmateurRecordInputs
                    amWins={amWins}
                    setAmWins={setAmWins}
                    amLoss={amLoss}
                    setAmLoss={setAmLoss}
                    amDraw={amDraw}
                    setAmDraw={setAmDraw}
                />

                {/* Foundation Style* */}

                <FoundationStyleDropdown
                    foundationStyle={foundationStyle}
                    setFoundationStyle={setFoundationStyle}
                    hasSubmitted={hasSubmitted}
                />

                {/* Sport Style* */}
                <SportTypeMultiSelectDropdown
                    selectedSportTypes={selectedSportTypes}
                    setSelectedSportTypes={setSelectedSportTypes}
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
                />

                <Text style={styles.sectionTitle}>
                    Preferred Weight Range for Offers
                </Text>
                <View style={styles.recordRow}>
                    <FloatingLabelInput
                        label="Min Weight (kg)"
                        value={minWeight}
                        onChangeText={setMinWeight}
                        keyboardType="numeric"
                        containerStyle={[
                            styles.recordInput,
                            hasSubmitted && minWeight === '' && {borderColor: colors.error},
                        ]}
                    />
                    <FloatingLabelInput
                        label="Max Weight (kg)"
                        value={maxWeight}
                        onChangeText={setMaxWeight}
                        keyboardType="numeric"
                        containerStyle={[
                            styles.recordInput,
                            hasSubmitted && maxWeight === '' && {borderColor: colors.error},
                        ]}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={styles.createFighterButton}
                    onPress={onUpdatePress}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <Text style={styles.createFighterButtonText}>
                            Update Fighter’s Profile
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

export default EditFightersProfileScreen;

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
    flexDirectionRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    dobContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 56,
        backgroundColor: colors.white,
        flex: 1,
        marginRight: 10,
    },
    dobText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    ageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        height: 56,
        backgroundColor: colors.lightGray,
    },
    ageText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    rowContainer: {
        flexDirection: 'row',
    },
    unitContainerAligned: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    unitButton: {
        borderWidth: 1,
        borderColor: colors.gray,
        backgroundColor: colors.white,
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginRight: 5,
        height: 56,
        justifyContent: 'center',
    },
    unitButtonActive: {
        backgroundColor: colors.secondaryBlack,
        borderColor: colors.secondaryBlack,
    },
    unitButtonText: {
        color: colors.primaryBlack,
        fontSize: 14,
    },
    unitButtonTextActive: {
        color: colors.white,
        fontWeight: '600',
    },
    weightClassRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItemContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayBackground,
        flexDirection: 'column',
    },
    dropdownWeight: {
        fontSize: 14,
        color: colors.gray,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: colors.primaryBlack,
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
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchLabel: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        marginLeft: 10,
    },
    disabledInput: {
        backgroundColor: colors.lightGray,
        borderColor: colors.gray,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 8,
    },
    createFighterButton: {
        height: 54,
        backgroundColor: colors.primaryBlack,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createFighterButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
    selectedItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
