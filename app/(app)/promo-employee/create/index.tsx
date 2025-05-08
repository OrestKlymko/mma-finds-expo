// import React, {useEffect, useState} from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     ScrollView,
//     Switch,
//     Alert,
//     StyleSheet,
//     ActivityIndicator,
//     Platform,
//     KeyboardAvoidingView,
// } from 'react-native';
// import {MaterialIcons as Icon} from '@expo/vector-icons';
// import FloatingLabelInput from '@/components/FloatingLabelInput';
// import colors from '@/styles/colors';
// import SocialMediaModal from '@/components/SocialMediaModal';
// import {
//     createSubAccount,
//     extractPromotionInfoFromInvitation,
// } from '@/service/service';
// import FooterSingUp from '@/components/FooterSingUp';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {ImageSelectorComponent} from '@/components/ImageSelectorComponent';
// import {PhoneNumberComponent} from '@/components/PhoneNumberComponent';
// import {useLocalSearchParams, useRouter} from "expo-router";
// import PasswordInputSection from "@/components/method-auth/PasswordInputSection";
//
//
// const CreateMemberJoinTeamPromotion = () => {
//     const insets = useSafeAreaInsets();
//     const {token} = useLocalSearchParams<{ token: string }>();
//     const [errorPhone, setErrorPhone] = useState<string | null>('');
//     const router = useRouter();
//     const [profileImage, setProfileImage] = useState<string | null>(null);
//     const [nameSurname, setNameSurname] = useState('');
//     const [socialMediaModalVisible, setSocialMediaModalVisible] = useState(false);
//     const [socialList, setSocialList] = useState<
//         { network: string; link: string }[]
//     >([]);
//
//     const [aboutFighter, setAboutFighter] = useState('');
//     const [agreeTerms, setAgreeTerms] = useState(false);
//     const [managerName, setManagerName] = useState('');
//     const [isValid, setIsValid] = useState(false);
//     // Email
//     const [email, setEmail] = useState('');
//     const [confirmEmail, setConfirmEmail] = useState('');
//     const [emailsMatch, setEmailsMatch] = useState<boolean | null>(null);
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [role, setRole] = useState('');
//     // Пароль
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     useEffect(() => {
//         if (!token) return;
//         extractPromotionInfoFromInvitation(token).then(info => {
//             setManagerName(info.organization);
//             setRole(info.role);
//         });
//     }, [token]);
//     const handleRemoveSocial = (index: number) => {
//         const newList = [...socialList];
//         newList.splice(index, 1);
//         setSocialList(newList);
//     };
//
//     const validateEmails = (main: string, confirm: string) => {
//         if (!confirm.trim()) {
//             setEmailsMatch(null);
//         } else {
//             setEmailsMatch(main === confirm);
//         }
//     };
//
//     // Submit
//     const onSignUpPress = () => {
//         if (
//             !profileImage ||
//             !nameSurname ||
//             !email ||
//             !confirmEmail ||
//             !phoneNumber ||
//             !password ||
//             !errorPhone
//         ) {
//             Alert.alert('Please fill in all required fields correctly');
//             return;
//         }
//
//         if (!agreeTerms) {
//             Alert.alert('Please agree to the Terms and Conditions and Privacy Policy');
//             return;
//         }
//         setLoading(true);
//         const formData = new FormData();
//
//         formData.append('name', nameSurname);
//         if (profileImage) {
//             formData.append('image', {
//                 uri: profileImage.uri,
//                 type: profileImage.type || 'image/jpeg',
//                 name: profileImage.name || `profile_${Date.now()}.jpg`,
//             });
//         }
//         formData.append('organization', managerName);
//         formData.append('role', role);
//         formData.append('email', email);
//         formData.append('description', aboutFighter);
//         formData.append('phone', phoneNumber);
//         formData.append('password', password);
//         formData.append(
//             'instagram',
//             socialList.find(item => item.network === 'Instagram')?.link || '',
//         );
//         formData.append(
//             'facebook',
//             socialList.find(item => item.network === 'Facebook')?.link || '',
//         );
//         formData.append(
//             'twitter',
//             socialList.find(item => item.network === 'Twitter')?.link || '',
//         );
//         formData.append(
//             'snapchat',
//             socialList.find(item => item.network === 'Snapchat')?.link || '',
//         );
//
//         if (!token) {
//             Alert.alert('Please log in to create a fighter profile');
//             return;
//         }
//         createSubAccount(formData)
//             .then(() => {
//                 Alert.alert('Profile created successfully');
//             })
//             .catch(err => {
//                 if (err.response.status == 409) {
//                     Alert.alert('This email is already registered');
//                 } else {
//                     Alert.alert('Failed to create a profile');
//                 }
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };
//
//     return (
//         <KeyboardAvoidingView
//             style={{flex: 1}}
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//             <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 showsHorizontalScrollIndicator={false}
//                 keyboardShouldPersistTaps="handled"
//                 contentContainerStyle={[
//                     styles.container,
//                     {paddingTop: insets.top, paddingBottom: insets.bottom},
//                 ]}>
//                 <Text style={styles.headerRoboto}>Join Team</Text>
//                 {/* Photo */}
//                 <View style={styles.imageContainer}>
//                     <View>
//                         <Text style={styles.titleProfile}>Profile Picture*</Text>
//                         <Text style={styles.subtitleProfile}>
//                             Please insert your photo or logo.
//                         </Text>
//                     </View>
//                     <ImageSelectorComponent
//                         image={profileImage}
//                         setPhoto={setProfileImage}
//                     />
//                 </View>
//                 {/* Manager name (gray background) */}
//                 <Text style={styles.titleProfile}>Promotion*</Text>
//                 <View style={styles.grayField}>
//                     <Text style={styles.grayFieldTextManager}>{managerName}</Text>
//                 </View>
//                 <Text style={styles.titleProfile}>Job Function*</Text>
//                 <View style={styles.grayField}>
//                     <Text style={styles.grayFieldTextManager}>{role}</Text>
//                 </View>
//                 {/* Name, Nickname */}
//                 <FloatingLabelInput
//                     label="Name and Surname*"
//                     value={nameSurname}
//                     onChangeText={setNameSurname}
//                     containerStyle={styles.inputContainer}
//                 />
//                 <TouchableOpacity
//                     style={styles.socialMediaField}
//                     onPress={() => setSocialMediaModalVisible(true)}>
//                     <Text style={styles.socialMediaPlaceholder}>Add Social Media</Text>
//                 </TouchableOpacity>
//                 {socialList.map((item, idx) => (
//                     <View key={idx} style={styles.socialItemCard}>
//                         <View style={styles.socialItemInfo}>
//                             <Icon
//                                 name={item.network.toLowerCase()}
//                                 size={24}
//                                 color={colors.primaryGreen}
//                             />
//                             <Text style={styles.socialItemLink}>{item.link}</Text>
//                         </View>
//                         <TouchableOpacity onPress={() => handleRemoveSocial(idx)}>
//                             <Icon name="close-circle" size={24} color={colors.error}/>
//                         </TouchableOpacity>
//                     </View>
//                 ))}
//                 <FloatingLabelInput
//                     label="About me"
//                     value={aboutFighter}
//                     onChangeText={setAboutFighter}
//                     containerStyle={styles.inputContainer}
//                 />
//                 <FloatingLabelInput
//                     label="Email*"
//                     value={email}
//                     onChangeText={txt => {
//                         setEmail(txt);
//                         validateEmails(txt, confirmEmail);
//                     }}
//                     containerStyle={styles.inputContainer}
//                 />
//                 <FloatingLabelInput
//                     label="Confirm Your Email*"
//                     value={confirmEmail}
//                     onChangeText={txt => {
//                         setConfirmEmail(txt);
//                         validateEmails(email, txt);
//                     }}
//                     containerStyle={styles.inputContainer}
//                 />
//                 {emailsMatch === false && (
//                     <Text style={styles.errorText}>Your email does not match.</Text>
//                 )}
//                 <PhoneNumberComponent
//                     phoneNumber={phoneNumber}
//                     setPhoneNumber={setPhoneNumber}
//                     errorPhone={setErrorPhone}
//                 />
//                 <PasswordInputSection
//                     onValidationChange={isValid => setIsValid(isValid)}
//                     onPasswordChange={setPassword}
//                 />
//                 <SocialMediaModal
//                     setSocialList={setSocialList}
//                     socialList={socialList}
//                 />
//                 {/* About the Fighter */}
//                 {/* I agree */}
//                 <View style={styles.switchContainer}>
//                     <Switch
//                         value={agreeTerms}
//                         onValueChange={setAgreeTerms}
//                         trackColor={{false: colors.gray, true: colors.primaryGreen}}
//                         thumbColor={agreeTerms ? colors.white : colors.gray}
//                     />
//                     <Text style={styles.switchLabel}>
//                         I agree to the Terms and Conditions and Privacy Policy*
//                     </Text>
//                 </View>
//                 {/* Create Fighter’s Profile */}
//                 <TouchableOpacity
//                     style={styles.createFighterButton}
//                     onPress={onSignUpPress}
//                     disabled={loading}>
//                     {loading ? (
//                         <ActivityIndicator color={colors.white} size="small"/>
//                     ) : (
//                         <Text style={styles.createFighterButtonText}>
//                             Create My Account
//                         </Text>
//                     )}
//                 </TouchableOpacity>
//                 {/* Footer - при потребі */}
//                 <FooterSingUp/>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// };
//
// export default CreateMemberJoinTeamPromotion;
//
// const styles = StyleSheet.create({
//     container: {
//         flexGrow: 1,
//         backgroundColor: colors.background,
//         padding: 38,
//     },
//     backButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 30,
//     },
//     backText: {
//         fontSize: 16,
//         color: colors.primaryBlack,
//         marginLeft: 8,
//     },
//     headerRoboto: {
//         fontSize: 25,
//         fontWeight: '500',
//         marginBottom: 20,
//         color: colors.primaryBlack,
//     },
//     imageContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//     },
//     titleProfile: {
//         fontSize: 16,
//         fontWeight: '400',
//         lineHeight: 19,
//         marginBottom: 12,
//         color: 'rgb(19, 19, 19)',
//     },
//     subtitleProfile: {
//         fontSize: 11,
//         fontWeight: '400',
//         lineHeight: 13,
//         color: 'rgb(61, 61, 61)',
//         marginBottom: 10,
//     },
//     imagePlaceholder: {
//         width: 84,
//         height: 84,
//         backgroundColor: colors.white,
//         borderWidth: 1,
//         borderColor: colors.gray,
//         borderRadius: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     profileImage: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 50,
//     },
//
//     grayField: {
//         width: '100%',
//         backgroundColor: colors.lightGray,
//         padding: 12,
//         borderRadius: 8,
//         marginBottom: 15,
//     },
//     grayFieldText: {
//         fontSize: 16,
//         textAlign: 'center',
//         color: colors.primaryBlack,
//     },
//
//     grayFieldTextManager: {
//         fontSize: 16,
//         color: colors.primaryBlack,
//         paddingVertical: 8,
//     },
//     inputContainer: {
//         marginBottom: 20,
//     },
//
//     dropdownButton: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: colors.gray,
//         borderRadius: 8,
//         padding: 12,
//         marginBottom: 15,
//         backgroundColor: colors.white,
//     },
//     dropdownButtonText: {
//         fontSize: 16,
//         color: colors.primaryBlack,
//     },
//     dropdownList: {
//         borderWidth: 1,
//         borderColor: colors.gray,
//         borderRadius: 8,
//         backgroundColor: colors.white,
//         marginBottom: 15,
//     },
//     dropdownItem: {
//         padding: 12,
//         fontSize: 16,
//         borderBottomWidth: 1,
//         color: colors.primaryBlack,
//         borderBottomColor: colors.grayBackground,
//     },
//     rowContainer: {
//         flexDirection: 'row',
//     },
//     flexDirectionRow: {
//         flexDirection: 'row',
//         marginBottom: 15,
//     },
//     unitContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     dropdownContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 15,
//         borderBottomWidth: 0, // Залежно від FloatingLabelInput
//     },
//
//     basedInField: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderWidth: 1,
//         width: '100%',
//         borderColor: colors.gray,
//         borderRadius: 8,
//         padding: 12,
//         backgroundColor: colors.white,
//     },
//     basedInText: {
//         fontSize: 16,
//         color: colors.primaryBlack,
//     },
//
//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: '500',
//         marginBottom: 10,
//     },
//     recordInput: {
//         flex: 1,
//         marginRight: 8,
//         borderRadius: 8,
//     },
//
//     socialMediaField: {
//         borderWidth: 1,
//         backgroundColor: 'rgb(61, 61, 61)',
//         borderColor: colors.gray,
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         paddingVertical: 15,
//         marginBottom: 15,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     socialMediaPlaceholder: {
//         fontSize: 18,
//         fontWeight: '500',
//         color: colors.white,
//     },
//     socialItemCard: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         backgroundColor: colors.white,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: colors.gray,
//         padding: 10,
//         marginBottom: 10,
//     },
//     errorText: {
//         marginTop: 5,
//         marginBottom: 5,
//         fontSize: 12,
//         fontFamily: 'Roboto',
//         fontWeight: '300',
//         lineHeight: 14,
//         color: colors.error,
//     },
//     socialItemInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//     },
//     socialItemLink: {
//         fontSize: 14,
//         color: colors.primaryBlack,
//         marginLeft: 8,
//         flexShrink: 1,
//     },
//
//     switchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     switchLabel: {
//         flex: 1,
//         fontSize: 16,
//         color: colors.primaryBlack,
//         marginLeft: 10,
//     },
//
//     phoneRow: {
//         flexDirection: 'row',
//         marginBottom: 15,
//     },
//     countryPickerButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 10,
//         paddingVertical: 12,
//         borderWidth: 1,
//         borderColor: colors.gray,
//         borderRadius: 8,
//         marginRight: 10,
//         height: 56,
//     },
//     countryCode: {
//         fontSize: 16,
//         fontWeight: '400',
//         marginRight: 5,
//         color: colors.primaryBlack,
//     },
//
//     createFighterButton: {
//         height: 54,
//         backgroundColor: colors.primaryBlack,
//         borderRadius: 9,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginVertical: 20,
//     },
//     createFighterButtonText: {
//         fontSize: 16,
//         fontWeight: '500',
//         color: colors.white,
//     },
//
//     // Date of Birth
//     dobContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         borderWidth: 1,
//         borderColor: colors.gray,
//         borderRadius: 8,
//         paddingHorizontal: 12,
//         height: 56,
//         backgroundColor: colors.white,
//     },
//     dobText: {
//         fontSize: 16,
//         color: colors.primaryBlack,
//     },
//
//     // Age (нередаговане поле)
//     ageContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 1,
//         borderColor: colors.gray,
//         borderRadius: 8,
//         height: 56,
//         backgroundColor: colors.lightGray,
//     },
//     ageText: {
//         fontSize: 16,
//         color: colors.primaryBlack,
//     },
//
//     // Record Inputs (Win, Loss, Draw)
//     recordInputTransparent: {
//         flex: 1,
//         borderBottomWidth: 1,
//         borderColor: colors.gray,
//         backgroundColor: 'transparent',
//         height: 56,
//         marginHorizontal: 5,
//         alignItems: 'center',
//     },
//     recordRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 15,
//     },
//     unitContainerAligned: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//     },
//     unitButton: {
//         borderWidth: 1,
//         borderColor: colors.gray,
//         backgroundColor: colors.white,
//         borderRadius: 6,
//         paddingVertical: 12,
//         paddingHorizontal: 15,
//         marginRight: 5,
//         height: 56,
//         justifyContent: 'center',
//     },
//     unitButtonActive: {
//         backgroundColor: colors.secondaryBlack,
//         borderColor: colors.secondaryBlack,
//     },
//     unitButtonText: {
//         color: colors.primaryBlack,
//         fontSize: 14,
//     },
//     unitButtonTextActive: {
//         color: colors.white,
//         fontWeight: '600',
//     },
// });
