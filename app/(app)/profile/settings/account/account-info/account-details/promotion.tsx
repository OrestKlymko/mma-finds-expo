import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from "@/context/AuthContext";
import {Photo} from "@/models/model";
import {getInformationPromotion, updateAccountInfoPromotion} from "@/service/service";
import GoBackButton from "@/components/GoBackButton";
import ImageProfileSection from "@/components/ImageProfileSection";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import {CountryAutocompleteInput} from "@/components/CityAutocompleteInput";
import SocialMediaModal from "@/components/SocialMediaModal";
import colors from "@/styles/colors";
import {PhoneNumberComponent} from "@/components/PhoneNumberComponent";


const ChangeDetailAccountPromotionScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const {methodAuth} = useAuth();
    const [errorPhone, setErrorPhone] = useState<string | null>('');
    // Змінні стану
    const [profileImage, setProfileImage] = useState<Photo | null>(null);
    const [nameSurname, setNameSurname] = useState('');
    const [loading, setLoading] = useState(false);
    const [aboutMe, setAboutMe] = useState('');
    const [basedIn, setBasedIn] = useState('');
    const [country, setCountry] = useState<string | null>(null);
    const [continent, setContinent] = useState<string | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [oldPhoto, setOldPhoto] = useState<null | string>(null);
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [emailsMatch, setEmailsMatch] = useState<boolean | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');

    // Список доданих соцмереж
    const [socialList, setSocialList] = useState<
        {network: string; link: string}[]
    >([]);
    const setNewProfileImage = (image: Photo | null) => {
        if (!image) {
            return;
        }
        setOldPhoto(null);
        setProfileImage(image);
    };
    const validateEmails = (main: string, confirm: string) => {
        if (!confirm.trim()) {
            setEmailsMatch(null);
        } else {
            setEmailsMatch(main === confirm);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getInformationPromotion().then(res => {
                setBasedIn(res.countryName + ', ' + res.continent);
                setContinent(res.continent);
                setCountry(res.countryName);
                setNameSurname(res.name || '');
                setAboutMe(res.description || '');
                setEmail(res.email || '');
                setConfirmEmail(res.email || '');
                setPhoneNumber(res.phoneNumber || '');
                setProfileImage({
                    uri: res.imageLink || null,
                    type: 'image/jpeg',
                    name: `profile_${Date.now()}.jpg`,
                });
                setOldPhoto(res.imageLink);
                setSocialList(
                    [
                        {network: 'Instagram', link: res.instagramUsername || ''},
                        {network: 'Facebook', link: res.facebookUsername || ''},
                        {network: 'Twitter', link: res.twitterUsername || ''},
                        {network: 'Snapchat', link: res.snapchatUsername || ''},
                    ].filter(item => item.link),
                );
                setHasSubmitted(false); // Скидаємо помилки
            });
        }, []),
    );

    // Приклад обробки кнопки Sign Up
    const onSignUpPress = () => {
        setHasSubmitted(true);
        if (
            !profileImage ||
            !nameSurname ||
            !basedIn ||
            !email ||
            !confirmEmail ||
            !phoneNumber
        ) {
            Alert.alert('Please fill all required fields correctly');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('profileImage', profileImage as unknown as Blob);
        formData.append('country', country || '');
        formData.append('continent', continent || '');
        formData.append('name', nameSurname);

        formData.append(
            'instagram',
            socialList.find(item => item.network === 'Instagram')?.link || '',
        );
        formData.append(
            'facebook',
            socialList.find(item => item.network === 'Facebook')?.link || '',
        );
        formData.append(
            'twitter',
            socialList.find(item => item.network === 'Twitter')?.link || '',
        );
        formData.append(
            'snapchat',
            socialList.find(item => item.network === 'Snapchat')?.link || '',
        );

        formData.append('oldPhoto', oldPhoto || '');
        formData.append('description', aboutMe);
        formData.append('email', email);
        formData.append('phone', phoneNumber);
        if (profileImage) {
            formData.append('image', {
                uri: profileImage.uri,
                type: profileImage.type || 'image/jpeg',
                name: profileImage.name || `profile_${Date.now()}.jpg`,
            } as unknown as Blob);
        }

        updateAccountInfoPromotion(formData)
            .then(() => {
                Alert.alert('Account details updated successfully');
                navigation.goBack();
            })
            .catch(() => Alert.alert('Error', "Couldn't update account details"))
            .finally(() => setLoading(false));
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.background}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <GoBackButton />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <Text style={styles.headerRoboto}>Change Account Details</Text>
                {/* Фото профілю */}
                <ImageProfileSection
                    profileImage={profileImage}
                    setProfileImage={setNewProfileImage}
                    hasSubmitted={hasSubmitted}
                />
                {/* Name and Surname */}
                <FloatingLabelInput
                    label="Name*"
                    hasSubmitted={hasSubmitted}
                    isRequired={true}
                    value={nameSurname}
                    onChangeText={setNameSurname}
                    containerStyle={styles.inputContainer}
                />

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

                {/* About Me */}
                <FloatingLabelInput
                    label="About us"
                    value={aboutMe}
                    onChangeText={setAboutMe}
                    containerStyle={styles.inputContainer}
                />

                {/* Email */}
                <FloatingLabelInput
                    label="Email*"
                    value={email}
                    editable={methodAuth === 'standard'}
                    hasSubmitted={hasSubmitted}
                    isRequired={true}
                    onChangeText={txt => {
                        setEmail(txt);
                        validateEmails(txt, confirmEmail);
                    }}
                    containerStyle={
                        methodAuth === 'standard'
                            ? styles.inputContainer
                            : {
                                ...styles.inputContainer,
                                backgroundColor: colors.lightGray,
                                borderColor: colors.lightGray,
                            }
                    }
                />
                {methodAuth === 'standard' && (
                    <FloatingLabelInput
                        label="Confirm Your Email*"
                        value={confirmEmail}
                        hasSubmitted={hasSubmitted}
                        editable={methodAuth === 'standard'}
                        isRequired={true}
                        onChangeText={txt => {
                            setConfirmEmail(txt);
                            validateEmails(email, txt);
                        }}
                        containerStyle={styles.inputContainer}
                    />
                )}
                {emailsMatch === false && (
                    <Text style={styles.errorText}>Your email does not match.</Text>
                )}

                {/* Телефон (+код і номер) */}
                <PhoneNumberComponent
                    errorPhone={setErrorPhone}
                    hasSubmitted={hasSubmitted}
                    isRequired={true}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                />

                {/* Кнопка Sign Up */}
                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={onSignUpPress}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={colors.white} size="small" />
                    ) : (
                        <Text style={styles.signUpButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>

                {/* Footer */}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ChangeDetailAccountPromotionScreen;

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
    inputContainer: {
        marginBottom: 15,
    },
    errorText: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: '300',
        lineHeight: 14,
        marginBottom: 5,
        color: colors.error,
    },

    // Кнопка
    signUpButton: {
        backgroundColor: colors.primaryBlack,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
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
