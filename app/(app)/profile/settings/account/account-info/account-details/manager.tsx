import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View,} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {getAccountInfo, updateAccountInfo} from "@/service/service";
import GoBackButton from "@/components/GoBackButton";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import SocialMediaModal from "@/components/SocialMediaModal";
import {CountryAutocompleteInput} from "@/components/CityAutocompleteInput";
import colors from "@/styles/colors";
import {PhoneNumberComponent} from "@/components/PhoneNumberComponent";
import {Photo} from "@/models/model";
import ImageProfileSection from "@/components/ImageProfileSection";

const Manager = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    // Змінні стану
    const [profileImage, setProfileImage] = useState<any>({
        uri: '',
        type: 'image/jpeg',
        name: `profile_${Date.now()}.jpg`,
    });
    const [nameSurname, setNameSurname] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [iAmAFighter, setIAmAFighter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [basedIn, setBasedIn] = useState<any>(null);
    const [errorPhone, setErrorPhone] = useState<string | null>('');
    const [continent, setContinent] = useState('');
    const [country, setCountry] = useState('');


    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [emailsMatch, setEmailsMatch] = useState<boolean | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [oldImageLink, setOldImageLink] = useState<string | null>(null);
    const [methodRegistered, setMethodRegistered] = useState<string | null>('');

    const [callingCode, setCallingCode] = useState('421'); // Стартовий телефонний код
    // Список доданих соцмереж
    const [socialList, setSocialList] = useState<
        {network: string; link: string}[]
    >([]);

    const setNewProfileImage = (image: Photo | null) => {
        if (!image) {
            return;
        }
        setOldImageLink(null);
        setProfileImage(image);
    };

    // Функції валідації
    const validateEmails = (main: string, confirm: string) => {
        if (!confirm.trim()) {
            setEmailsMatch(null);
        } else {
            setEmailsMatch(main === confirm);
        }
    };
    const onSignUpPress = async () => {
        if (
            !profileImage ||
            !nameSurname ||
            (!country && !basedIn) ||
            !email ||
            !confirmEmail ||
            !phoneNumber ||
            errorPhone
        ) {
            Alert.alert('Please fill all required fields correctly');
            return;
        }

        setLoading(true);

        const formData = new FormData();

        formData.append('name', nameSurname);
        formData.append('companyName', companyName);
        formData.append('fighterRepresentingMyself', iAmAFighter.toString());
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
        formData.append('description', aboutMe);
        formData.append('email', email);
        formData.append('phone', callingCode + ' ' + phoneNumber);
        formData.append('country', country);
        formData.append('continent', continent);
        if (profileImage) {
            formData.append('image', {
                uri: profileImage.uri,
                type: profileImage.type || 'image/jpeg',
                name: profileImage.name || `profile_${Date.now()}.jpg`,
            }as unknown as Blob);
        }
        formData.append('oldPhoto', oldImageLink??'');
        updateAccountInfo(formData)
            .then(() => {
                navigation.goBack();
            })
            .catch(err => {
                if (err.response.status == 409) {
                    Alert.alert('This email is already registered');
                } else {
                    Alert.alert('Failed update profile');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useFocusEffect(
        React.useCallback(() => {
            getAccountInfo()
                .then(res => {
                    setMethodRegistered(res.methodRegistered);
                    setProfileImage({
                        uri: `${res.imageLink}` || '',
                        type: 'image/jpeg',
                        name: `profile_${Date.now()}.jpg`,
                    });
                    setOldImageLink(res.imageLink);
                    setNameSurname(res.name || '');
                    setCompanyName(res.companyName || '');
                    setAboutMe(res.description || '');
                    setBasedIn(res.countryName);
                    setCountry(res.country);
                    setContinent(res.continent);
                    setEmail(res.email || '');
                    setConfirmEmail(res.email || '');
                    if (res.phoneNumber) {
                        const [callingCode, phone] = res.phoneNumber.split(' ');
                        setCallingCode(callingCode || '421');
                        setPhoneNumber(phone || '');
                    }

                    setIAmAFighter(res.fighterRepresentingMyself || false);
                    setSocialList(
                        [
                            {network: 'Instagram', link: res.instagramUsername || ''},
                            {network: 'Facebook', link: res.facebookUsername || ''},
                            {network: 'Twitter', link: res.twitterUsername || ''},
                            {network: 'Snapchat', link: res.snapchatUsername || ''},
                        ].filter(item => item.link !== ''),
                    );
                })
                .catch(err => {
                    console.error('Failed to fetch account info:', err);
                    Alert.alert('Failed to load account info');
                });
        }, []),
    );

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                {/* Заголовки: Roboto (500) і Poppins (300) */}
                <Text style={styles.headerRoboto}>Change Account Details</Text>

                {/* Фото профілю */}
                <ImageProfileSection
                    hasSubmitted={true}
                    profileImage={profileImage}
                    setProfileImage={setNewProfileImage}
                />

                {/* Name and Surname */}
                <FloatingLabelInput
                    label="Name and Surname*"
                    value={nameSurname}
                    onChangeText={setNameSurname}
                    containerStyle={styles.inputContainer}
                />

                {/* Management Company Name */}
                <FloatingLabelInput
                    label="Management Company Name"
                    value={companyName}
                    onChangeText={setCompanyName}
                    containerStyle={styles.inputContainer}
                />

                <CountryAutocompleteInput
                    label="Country of Residence*"
                    value={basedIn}
                    onChangeCountry={setCountry}
                    onChangeContinent={setContinent}
                    error={basedIn === ''}
                />

                {/* Social Media */}
                <SocialMediaModal
                    setSocialList={setSocialList}
                    socialList={socialList}
                />

                {/* About Me */}
                <FloatingLabelInput
                    label="About Me"
                    value={aboutMe}
                    onChangeText={setAboutMe}
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

                {methodRegistered === 'standard' && (
                    <FloatingLabelInput
                        label="Email*"
                        value={email}
                        onChangeText={txt => {
                            setEmail(txt);
                            validateEmails(txt, confirmEmail);
                        }}
                        containerStyle={styles.inputContainer}
                    />
                )}
                {methodRegistered === 'standard' && (
                    <FloatingLabelInput
                        label="Confirm Your Email*"
                        value={confirmEmail}
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
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                />

                {/* Кнопка Sign Up */}
                <TouchableOpacity style={styles.signUpButton} onPress={onSignUpPress}>
                    {loading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <Text style={styles.signUpButtonText}>Save changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Manager;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 28,
    },

    headerRoboto: {
        fontSize: 25,
        fontFamily: 'Roboto',
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 30,
        color: colors.primaryBlack,
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

    // Помилки
    errorText: {
        marginBottom: 5,
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: '300',
        lineHeight: 14,
        color: colors.error,
    },

    // Кнопка
    signUpButton: {
        backgroundColor: colors.primaryBlack,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        marginVertical: 20,
        height: 56,
        justifyContent: 'center',
        alignContent:'center'
    },
    signUpButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
    },
});
