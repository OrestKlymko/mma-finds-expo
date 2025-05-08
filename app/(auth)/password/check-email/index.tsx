import React, {useEffect, useState} from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import colors from '@/styles/colors';
import {
    extractEmailFromInvitation,
    verifyAndChangePassword,
} from '@/service/service';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FooterSignUp from '@/components/FooterSingUp';
import PasswordInputSection from "@/components/method-auth/PasswordInputSection";
import {useLocalSearchParams, useRouter} from "expo-router";


const CheckEmailScreen: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [email, setEmail] = useState('');
    const {token} = useLocalSearchParams<{ token: string }>();
    useEffect(() => {
        if (!token) return;
        extractEmailFromInvitation(token)
            .then(info => {
                setEmail(info.email);
            })
            .catch(() => {
                Alert.alert(
                    'Error',
                    'Failed to extract email from invitation. Please try again.',
                );
            });
    }, [token]);

    const handleResetPassword = () => {
        if (!isPasswordValid) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        setLoading(true);
        const data = {
            email: email,
            newPassword: password,
        };
        verifyAndChangePassword(data)
            .then(() => {
                Alert.alert('Success', 'Your password has been reset!');
                router.push('/login')
            })
            .catch(() => {
                Alert.alert('Error', 'Failed to reset password');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
                styles.container,
                {paddingTop: insets.top, paddingBottom: insets.bottom},
            ]}>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>Enter your new password</Text>

            <PasswordInputSection
                onValidationChange={setIsPasswordValid}
                onPasswordChange={setPassword}
            />

            <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleResetPassword}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator color={colors.white} size="small"/>
                ) : (
                    <Text style={styles.confirmButtonText}>Reset Password</Text>
                )}
            </TouchableOpacity>
            <FooterSignUp/>
        </ScrollView>
    );
};

export default CheckEmailScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        padding: 38,
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        fontFamily: 'Roboto',
        fontWeight: '500',
        marginBottom: 10,
        color: colors.primaryBlack,
    },
    subtitle: {
        fontSize: 16.5,
        fontFamily: 'Roboto',
        fontWeight: '400',
        marginBottom: 30,
        color: colors.primaryBlack,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.primaryBlack,
        borderRadius: 9,
        fontSize: 16,
        padding: 10,
        textAlign: 'center',
        marginBottom: 20,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    floatingPasswordContainer: {
        flex: 1,
    },
    eyeIconButton: {
        position: 'absolute',
        right: 10,
    },
    errorText: {
        fontSize: 12,
        color: colors.error,
        marginBottom: 10,
    },
    confirmButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
    },
    confirmButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
    },
});
