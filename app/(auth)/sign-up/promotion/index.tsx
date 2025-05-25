import React, {useState} from 'react';
import {
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
    KeyboardAvoidingView, ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StyleSheet} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Photo, SignUpDataPromotion} from '@/models/model';
import {useAuth} from "@/context/AuthContext";
import {LoginResponse} from '@/service/response';
import {changeNotificationState, createPromotion, createPromotionSecond} from '@/service/service';
import {
    createFormDataForPromotion,
    createFormDataForPromotionAsSecondProfile
} from '@/service/create-entity/formDataService';
import {useLocalSearchParams, useRouter} from "expo-router";
import colors from "@/styles/colors";
import GoBackButton from '@/components/GoBackButton';
import ImageProfileSection from "@/components/ImageProfileSection";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import {CountryAutocompleteInput} from "@/components/CityAutocompleteInput";
import SocialMediaModal from "@/components/SocialMediaModal";
import {PhoneNumberComponent} from "@/components/PhoneNumberComponent";
import {TermAndConditionComponent} from "@/components/TermAndConditionComponent";
import FooterSignIn from "@/context/FooterSignIn";


const SignUpPromotionScreen = () => {
    const insets = useSafeAreaInsets();
    const [profileImage, setProfileImage] = useState<Photo | null>(null);
    const [nameSurname, setNameSurname] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [errorPhone, setErrorPhone] = useState<string | null>('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [continent, setContinent] = useState('');
    const router = useRouter();
    const {setToken, setMethodAuth, setRole, setEntityId} = useAuth();
    const {secondProfile} = useLocalSearchParams<{ secondProfile?: string }>();
    const isSecondProfile = secondProfile === 'true';
    const [socialList, setSocialList] = useState<
        { network: string; link: string }[]
    >([]);
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
        setHasSubmitted(true);

        if (
            !profileImage ||
            !nameSurname ||
            !phoneNumber ||
            !country ||
            !continent) {
            Alert.alert('Please fill all required fields correctly');
            return;
        }
        if (!agreeTerms && !isSecondProfile) {
            Alert.alert(
                'Please read and agree to the Terms and Conditions and Privacy Policy',
            );
            return;
        }

        const dataToSend: SignUpDataPromotion = {
            name: nameSurname,
            instagram:
                socialList.find(item => item.network === 'Instagram')?.link || '',
            facebook:
                socialList.find(item => item.network === 'Facebook')?.link || '',
            twitter: socialList.find(item => item.network === 'Twitter')?.link || '',
            snapchat:
                socialList.find(item => item.network === 'Snapchat')?.link || '',
            description: aboutMe,
            phone: phoneNumber,
            country: country,
            continent: continent,
            image: profileImage || '',
        };

        if (isSecondProfile) {
            setLoading(true);
            const formData = await createFormDataForPromotion(dataToSend, "", "");
            formData.append('secondProfile', 'true');
            createPromotion(formData)
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
                }).finally(() => setLoading(false));
        } else {
            router.push({
                pathname: '/(auth)/sign-up/method',
                params: {
                    data: JSON.stringify(dataToSend),
                    role: 'PROMOTION'
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
                    Sign Up as <Text style={{fontWeight: 'bold'}}>Promotion</Text>
                </Text>

                <ImageProfileSection
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    hasSubmitted={hasSubmitted}
                />
                <FloatingLabelInput
                    label="Name*"
                    value={nameSurname}
                    onChangeText={setNameSurname}
                    containerStyle={styles.inputContainer}
                    isRequired={true}
                    hasSubmitted={hasSubmitted}
                />
                <CountryAutocompleteInput
                    label="Country of Residence*"
                    value={country}
                    onChangeCountry={setCountry}
                    onChangeContinent={setContinent}
                />
                <SocialMediaModal
                    setSocialList={setSocialList}
                    socialList={socialList}
                />

                <FloatingLabelInput
                    label="About us"
                    value={aboutMe}
                    onChangeText={setAboutMe}
                    containerStyle={styles.inputContainer}
                    multiline={true}
                />
                <PhoneNumberComponent
                    isRequired={true}
                    errorPhone={setErrorPhone}
                    phoneNumber={phoneNumber}
                    hasSubmitted={hasSubmitted}
                    setPhoneNumber={setPhoneNumber}
                />

                {!isSecondProfile && (
                    <TermAndConditionComponent
                        setAgree={setAgreeTerms}
                        agreeState={agreeTerms}
                    />
                )}
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
                {!isSecondProfile && <FooterSignIn/>}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignUpPromotionScreen;

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
        marginBottom: 20,
        color: colors.primaryBlack,
    },
    inputContainer: {
        marginBottom: 15,
    },
    signUpButton: {
        backgroundColor: colors.primaryBlack,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        height: 56,
    },
    signUpButtonText: {
        fontSize: 18,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
    },
});
