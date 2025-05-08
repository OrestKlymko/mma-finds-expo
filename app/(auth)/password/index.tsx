import React, {useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';


import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from "expo-router";
import {requestOnForgotPassword} from "@/service/service";
import GoBackButton from "@/components/GoBackButton";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import colors from "@/styles/colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import FooterSignUp from "@/components/FooterSingUp";


const PasswordRecoveryScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [emailsMatch, setEmailsMatch] = useState<boolean | null>(null);

    const validateEmails = (currentEmail: string, currentConfirm: string) => {
        if (currentConfirm.trim().length === 0) {
            setEmailsMatch(null);
        } else {
            setEmailsMatch(currentEmail === currentConfirm);
        }
    };

    const onRecoverPassword = () => {
        if (emailsMatch && email.length > 0) {
            setLoading(true);
            requestOnForgotPassword(email)
                .then(() => {
                    router.push({pathname:'/(auth)/password/success-email-forgot',params:{email}});
                })
                .catch(() => {
                    Alert.alert('Check your email or try signing up');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            Alert.alert('Emails do not match or fields are empty');
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}><GoBackButton/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>


                <Text style={styles.title}>Password Recovery</Text>
                <Text style={styles.subtitle}>
                    Enter your email to recover your password.
                </Text>

                <View style={styles.inputContainer}>
                    <FloatingLabelInput
                        label="Email"
                        value={email}
                        onChangeText={text => {
                            setEmail(text);
                            validateEmails(text, confirmEmail);
                        }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.confirmEmailRow}>
                        <FloatingLabelInput
                            label="Confirm Email"
                            value={confirmEmail}
                            onChangeText={text => {
                                setConfirmEmail(text);
                                validateEmails(email, text);
                            }}
                        />
                        {emailsMatch !== null && (
                            <View
                                style={[
                                    styles.validationIcon,
                                    {
                                        backgroundColor: emailsMatch
                                            ? colors.primaryGreen
                                            : colors.error,
                                    },
                                ]}>
                                <Ionicons
                                    name={emailsMatch ? 'checkmark' : 'close'}
                                    size={16}
                                    color={"white"}
                                />

                            </View>
                        )}
                    </View>
                    {emailsMatch === false && (
                        <Text style={styles.errorText}>Your email does not match.</Text>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.recoverButton}
                    disabled={loading}
                    onPress={onRecoverPassword}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white}/>
                    ) : (
                        <Text style={styles.recoverButtonText}>Recover Password</Text>
                    )}
                </TouchableOpacity>
                <FooterSignUp/>
            </ScrollView>
        </View>
    );
};

export default PasswordRecoveryScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        padding: 38,
    },
    title: {
        fontSize: 25,
        fontFamily: 'Roboto',
        fontWeight: '500',
        lineHeight: 29,
        color: colors.primaryBlack,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16.5,
        fontFamily: 'Roboto',
        fontWeight: '400',
        lineHeight: 19,
        color: colors.primaryBlack,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    confirmEmailRow: {
        position: 'relative',
    },
    validationIcon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{translateY: -10}],
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: '300',
        lineHeight: 14,
        color: colors.error,
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'left',
    },
    recoverButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
        height: 56,
        justifyContent: 'center',
        alignContent: 'center',
    },
    recoverButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    footerText: {
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
    },
    footerLink: {
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.primaryGreen,
    },
});
