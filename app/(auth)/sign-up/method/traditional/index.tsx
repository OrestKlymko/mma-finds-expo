import React, {useEffect, useState} from 'react';
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
import {useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from "expo-router";
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";
import {useAuth} from "@/context/AuthContext";
import {createManager, createPromotion} from "@/service/service";
import {createFormDataForManager, createFormDataForPromotion} from "@/service/create-entity/formDataService";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import colors from "@/styles/colors";
import FooterSignIn from "@/context/FooterSignIn";
import PasswordInputSection from "@/components/method-auth/PasswordInputSection";
import GoBackButton from "@/components/GoBackButton";

export default function Index() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const route = useRoute();

    const {data, role} = route.params as {
        data: SignUpDataManager | SignUpDataPromotion;
        role: 'MANAGER' | 'PROMOTION';
    };

    const [loading, setLoading] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailsMatch, setEmailsMatch] = useState<boolean | null>(null);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const {setToken, setMethodAuth, setRole} = useAuth();

    useEffect(() => {
        if (confirmEmail.trim().length === 0) {
            setEmailsMatch(null);
            return;
        }
        setEmailsMatch(email === confirmEmail);
    }, [email, confirmEmail]);

    const onSignUpPress = async () => {
        setHasSubmitted(true);

        if (
            !email.trim() ||
            !confirmEmail.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            Alert.alert('Please fill all required fields.');
            return;
        }
        if (emailsMatch === false) {
            Alert.alert('Your emails do not match.');
            return;
        }
        if (!isPasswordValid || password !== confirmPassword) {
            Alert.alert('Your passwords do not match or are invalid.');
            return;
        }
        if (!agreeTerms) {
            Alert.alert(
                'Please read and agree to the Terms and Conditions and Privacy Policy.',
            );
            return;
        }

        setLoading(true);
        if (role === 'PROMOTION') {
            const formData = await createFormDataForPromotion(
                data as SignUpDataPromotion,
                email,
                'standard',
            );
            createPromotion(formData)
                .then(res => {
                    setToken(res.token);
                    setMethodAuth(res.methodAuth);
                    setRole(res.role);
                    setTimeout(() => {
                        router.push('/(app)/(tabs)');
                    }, 1000);
                })
                .catch(err => {
                    if (err?.response?.status === 409) {
                        Alert.alert('This email is already registered.');
                    } else {
                        Alert.alert('Failed to create a profile.');
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        if (role === 'MANAGER') {
            const formData = await createFormDataForManager(
                data as SignUpDataManager,
                email,
                'standard',
            );
            createManager(formData)
                .then(res => {
                    setToken(res.token);
                    setMethodAuth(res.methodAuth);
                    setRole(res.role);
                    setTimeout(() => {
                        router.push('/manager/fighter/create');
                    }, 1000);
                })
                .catch(err => {
                    if (err?.response?.status === 409) {
                        Alert.alert('This email is already registered.');
                    } else {
                        Alert.alert('Failed to create a profile. Please try again later.');
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <GoBackButton />

                <View style={{marginTop: 50}}>
                    {/* Поле Email */}
                    <FloatingLabelInput
                        label="Email*"
                        isRequired
                        hasSubmitted={hasSubmitted}
                        value={email}
                        onChangeText={setEmail}
                        containerStyle={styles.inputContainer}
                    />

                    <FloatingLabelInput
                        label="Confirm Your Email*"
                        isRequired
                        hasSubmitted={hasSubmitted}
                        value={confirmEmail}
                        onChangeText={setConfirmEmail}
                        containerStyle={styles.inputContainer}
                    />
                    {emailsMatch === false && (
                        <Text style={styles.errorText}>Your email does not match.</Text>
                    )}

                    <PasswordInputSection
                        hasSubmitted={hasSubmitted}
                        onValidationChange={valid => setIsPasswordValid(valid)}
                        onPasswordChange={(mainPassword, repeatPassword) => {
                            setPassword(mainPassword);
                            setConfirmPassword(repeatPassword);
                        }}
                    />
                    {password !== confirmPassword && hasSubmitted && (
                        <Text style={styles.errorText}>Passwords do not match.</Text>
                    )}

                    <View style={styles.switchContainer}>
                        <Switch
                            value={agreeTerms}
                            onValueChange={setAgreeTerms}
                            trackColor={{false: colors.gray, true: colors.primaryGreen}}
                            thumbColor={agreeTerms ? colors.white : colors.gray}
                        />
                        <Text style={styles.switchLabel}>
                            I agree to the Terms and Conditions and Privacy Policy*
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={onSignUpPress}
                        disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={colors.white} size="small"/>
                        ) : (
                            <Text style={styles.signUpButtonText}>Create My Account</Text>
                        )}
                    </TouchableOpacity>
                </View>

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
        marginBottom: 20,
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
    errorText: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: '300',
        lineHeight: 14,
        marginBottom: 5,
        color: colors.error,
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
