import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TermAndConditionComponent} from '@/components/TermAndConditionComponent';
import ImageProfileSection from '@/components/ImageProfileSection';
import {CountryAutocompleteInput} from '@/components/CityAutocompleteInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from "@/context/AuthContext";
import {useLocalSearchParams, useRouter} from "expo-router";
import colors from "@/styles/colors";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import {PhoneNumberComponent} from "@/components/PhoneNumberComponent";
import FooterSignIn from "@/context/FooterSignIn";
import SocialMediaModal from "@/components/SocialMediaModal";
import {SignUpDataManager} from "@/models/model";
import {changeNotificationState, createManagerSecond} from "@/service/service";
import {LoginResponse} from "@/service/response";
import {createFormDataForManagerAsSecondProfile} from "@/service/create-entity/formDataService";
import GoBackButton from "@/components/GoBackButton";

export default function Index() {
    const {setToken, setMethodAuth, setRole, setEntityId} = useAuth();
    const insets = useSafeAreaInsets();
    const [profileImage, setProfileImage] = useState<any | null>(null);
    const [nameSurname, setNameSurname] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [iAmAFighter, setIAmAFighter] = useState(false);
    const [basedIn, setBasedIn] = useState('');
    const [country, setCountry] = useState('');
    const [continent, setContinent] = useState('');
    const [errorPhone, setErrorPhone] = useState<string | null>('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [hasSubmited, setHasSubmited] = useState(false);
    const [socialList, setSocialList] = useState<
        { network: string; link: string }[]
    >([]);
    const router = useRouter();
    const {secondProfile} = useLocalSearchParams<{ secondProfile?: string }>();
    const isSecondProfile = secondProfile === 'true';

    const [loading, setLoading] = useState(false);

    const handleSuccessAuth = async (res: LoginResponse) => {
        setToken(res.token);
        setMethodAuth(res.methodAuth);
        setRole(res.role);
        setEntityId(res.entityId);

        try {
            const tokenMobile = await AsyncStorage.getItem('deviceToken');
            if (tokenMobile) {
                const body = {
                    fcmToken: tokenMobile,
                    enableNotification: true,
                    role: res.role!!,
                };
                changeNotificationState(body);
            }
        } catch (err) {
        }
    };

    const onSignUpPress = async () => {
        setHasSubmited(true);
        if (
            !profileImage ||
            !nameSurname ||
            !phoneNumber ||
            !errorPhone
        ) {
            Alert.alert('Please fill all required fields and correct errors');
            return;
        }
        if (!agreeTerms && !isSecondProfile) {
            Alert.alert(
                'User must agree to the Terms and Conditions and Privacy Policy',
            );
            return;
        }

        const dataToSend: SignUpDataManager = {
            name: nameSurname,
            companyName: companyName,
            about: aboutMe,
            country: country,
            continent: continent,
            phoneNumber: phoneNumber,
            facebook:
                socialList.find(item => item.network === 'Facebook')?.link || '',
            instagram:
                socialList.find(item => item.network === 'Instagram')?.link || '',
            twitter: socialList.find(item => item.network === 'Twitter')?.link || '',
            snapchat:
                socialList.find(item => item.network === 'Snapchat')?.link || '',
            profileImage: profileImage,
            isFighter: iAmAFighter,
        };

        if (isSecondProfile) {
            setLoading(true);
            const formData = await createFormDataForManagerAsSecondProfile(
                dataToSend,
            );
            createManagerSecond(formData)
                .then(async res => {
                    await handleSuccessAuth(res);
                    setTimeout(() => router.push('/(app)/(tabs)'), 1000);
                })
                .catch(err => {
                    if (err?.response?.status === 409) {
                        Alert.alert(
                            'This email is already registered with role Promotion.',
                        );
                    } else {
                        Alert.alert('Failed to create a profile.');
                    }
                })
                .finally(() => setLoading(false));
        } else {
            router.push({
                pathname: '/(auth)/sign-up/method',
                params: {
                    data: JSON.stringify(dataToSend),
                    role: 'MANAGER'
                }
            });
        }
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
                <Text style={styles.headerRoboto}>
                    Sign Up as <Text style={{fontWeight: 'bold'}}>Manager</Text>
                </Text>

                <ImageProfileSection
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    hasSubmitted={hasSubmited}
                />
                {/* Name and Surname */}
                <FloatingLabelInput
                    label="Name and Surname*"
                    value={nameSurname}
                    hasSubmitted={hasSubmited}
                    isRequired={true}
                    onChangeText={setNameSurname}
                    containerStyle={styles.inputContainer}
                />

                <FloatingLabelInput
                    label="Management Company Name"
                    value={companyName}
                    onChangeText={setCompanyName}
                    containerStyle={styles.inputContainer}
                />

                <View style={styles.switchContainer}>
                    <Switch
                        value={iAmAFighter}
                        onValueChange={setIAmAFighter}
                        trackColor={{false: colors.gray, true: colors.primaryGreen}}
                        thumbColor={iAmAFighter ? colors.white : colors.gray}
                    />
                    <Text style={styles.switchLabel}>
                        I am a fighter representing myself
                    </Text>
                </View>

                <CountryAutocompleteInput
                    label="Country of Residence*"
                    value={basedIn}
                    onChangeCountry={setCountry}
                    onChangeContinent={setContinent}
                    error={basedIn === ''}
                />
                <SocialMediaModal
                    setSocialList={setSocialList}
                    socialList={socialList}
                />

                <FloatingLabelInput
                    label="About Me"
                    value={aboutMe}
                    onChangeText={setAboutMe}
                    containerStyle={styles.inputContainer}
                    multiline={true}
                />
                <PhoneNumberComponent
                    hasSubmitted={hasSubmited}
                    errorPhone={setErrorPhone}
                    isRequired={true}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                />

                <TermAndConditionComponent
                    agreeState={agreeTerms}
                    setAgree={setAgreeTerms}
                />

                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={onSignUpPress}
                    disabled={loading}>
                    {isSecondProfile ? (
                        loading ? (
                            <ActivityIndicator size="small" color={colors.white}/>
                        ) : (
                            <Text style={styles.signUpButtonText}>Create Profile</Text>
                        )
                    ) : (
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <FooterSignIn/>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 38,
    },
    headerRoboto: {
        fontSize: 25,
        fontFamily: 'Roboto',
        fontWeight: '500',
        marginBottom: 10,
        color: colors.primaryBlack,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    inputContainer: {
        marginBottom: 15,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchLabel: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        lineHeight: 19,
        color: colors.primaryBlack,
        marginLeft: 10,
    },
    socialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 6,
        padding: 8,
        marginBottom: 5,
    },

    signUpButton: {
        backgroundColor: colors.primaryBlack,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        marginVertical: 20,
        height: 56,
        justifyContent: 'center',
    },
    signUpButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
    },
});
