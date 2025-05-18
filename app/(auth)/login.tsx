import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import FacebookIcon from '@/assets/icons/facebook.png';
import AppleIcon from '@/assets/icons/apple.png';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import {LoginRequest} from "@/service/request";
import {login} from "@/service/service";
import colors from "@/styles/colors";
import SocialButton from "@/components/method-auth/SocialButton";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import {useRouter} from "expo-router";
import FooterSingUp from "@/components/FooterSingUp";
import GoBackButton from "@/components/GoBackButton";
import {useAuth} from "@/context/AuthContext";
import useAppleAuth from "@/hooks/useAppleAuth";
import RolePicker from "@/components/RolePicker";
import {GoogleMethod} from "@/components/method-auth/GoogleMethod";

export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync()
        return () => {
            void WebBrowser.coolDownAsync()
        }
    }, [])
}
WebBrowser.maybeCompleteAuthSession();

type AuthMethod = 'standard' | 'google' | 'apple' | null;
const LoginScreen = () => {


    useWarmUpBrowser()
    const insets = useSafeAreaInsets();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState('');
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const {setToken, setMethodAuth, setRole, setEntityId} = useAuth();
    const [authLoading, setAuthLoading] = useState<AuthMethod>(null);
    const [selectedRole, setSelectedRole] = useState<'MANAGER' | 'PROMOTION' | 'PROMOTION_EMPLOYEE'>('MANAGER');
    const router = useRouter();
    const handleSignIn = async () => {
        setAuthLoading('standard');
        const token = await AsyncStorage.getItem('deviceToken');
        handleLoginToBackend(email, password, 'standard', token);
    };

    const {signInApple, loadingApple} = useAppleAuth(
        (email, fcm) => handleLoginToBackend(email, null, 'oauth', fcm),
        (error) => Alert.alert('Apple Sign-In Error', error)
    );

    const onSuccessOauth = (email: string, fcm: string | null) => {
        handleLoginToBackend(email, null, 'oauth', fcm);
    }

    const handleLoginToBackend = (
        email: string,
        password: string | null,
        method: string,
        token: string | null,
    ) => {
        if (!selectedRole) {
            Alert.alert('Error', 'Please select a role');
            setAuthLoading(null);
            return;
        }
        const loginRequest: LoginRequest = {
            email: email.toLowerCase(),
            password: password,
            method: method,
            fcmToken: token,
            userRole: selectedRole,
        };
        console.log(loginRequest);
        login(loginRequest)
            .then(async res => {
                setToken(res.token);
                setMethodAuth(res.methodAuth);
                setRole(res.role);
                setEntityId(res.entityId);
                if (res.token) {
                    await AsyncStorage.setItem('authToken', res.token);
                }
                setTimeout(() => {
                    setLoadingGoogle(false);
                    router.push('/');
                }, 1000);
            })
            .catch(err => {
                const status = err.status;
                console.log(err);
                if (err.status === 407) {
                    Alert.alert(
                        'Error',
                        'User with this email not found, please sign up',
                    );
                } else {
                    Alert.alert('Error', 'Failed to sign in');
                }
                setLoadingGoogle(false);

            }).finally(() => {
            setAuthLoading(null)
        });
    };


    const handleFacebookSignIn = async () => {
        Alert.alert('Coming Soon!', 'This feature is coming soon.');
        return;
    };

    return (
        <View style={{backgroundColor: colors.background, flex: 1}}>
            <GoBackButton specificScreen={'/welcome'}/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <Text style={styles.title}>Welcome Back!</Text>

                <Text style={styles.subtitle}>
                    Enter your registration email and password.
                </Text>

                <View style={styles.inputContainer}>
                    <FloatingLabelInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.passwordRow}>
                        <FloatingLabelInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!passwordVisible}
                            containerStyle={styles.floatingPasswordContainer}
                        />

                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!passwordVisible)}
                            style={styles.eyeIconButton}>
                            <Icon
                                name={passwordVisible ? 'eye-off' : 'eye'}
                                size={20}
                                color={colors.primaryBlack}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {/*<RoleSelector onSelect={setSelectedRole} selected={selectedRole}/>*/}
                <RolePicker value={selectedRole} onChange={setSelectedRole}/>
                <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => router.push({pathname: '/(auth)/password'})}>
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleSignIn}
                    disabled={authLoading !== null && authLoading !== 'standard'}>
                    {authLoading === 'standard' ? (
                        <ActivityIndicator size="small" color={colors.white}/>
                    ) : (
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider}/>
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.divider}/>
                </View>

                {/* Кнопка входу через Google */}


                <GoogleMethod onSuccess={onSuccessOauth} text={"Sign in with Google"} loading={loadingGoogle} setLoading={setLoadingGoogle}/>

                <SocialButton
                    text="Sign in with Facebook"
                    onPress={handleFacebookSignIn}
                    iconSource={FacebookIcon}
                    backgroundColor="#FFFFFF"
                    textColor="#000"
                />

                {Platform.OS === 'ios' && (
                    <SocialButton
                        isLoading={loadingApple}
                        disabled={loadingApple}
                        text="Sign in with Apple"
                        onPress={signInApple}
                        iconSource={AppleIcon}
                        backgroundColor="#FFFFFF"
                        textColor="#000"
                    />
                )}
                <FooterSingUp/>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 38,
    },
    title: {
        marginTop: 50,
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

    input: {
        borderWidth: 1,
        borderColor: colors.primaryBlack,
        borderRadius: 9,
        paddingVertical: 17,
        paddingHorizontal: 4,
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primaryBlack,
        borderRadius: 9,
        paddingVertical: 17,
        paddingHorizontal: 4,
    },
    passwordToggle: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{translateY: -10}],
        zIndex: 1,
    },

    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    forgotPasswordText: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: '300',
        color: colors.primaryBlack,
    },

    signInButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        marginVertical: 20,
        height: 56,
        justifyContent: 'center',
    },
    signInButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        lineHeight: 19,
        color: colors.white,
    },

    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.gray,
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: '300',
        lineHeight: 12,
        color: colors.primaryBlack,
    },

    socialButton: {
        borderWidth: 1,
        borderColor: colors.primaryBlack,
        borderRadius: 9,
        paddingVertical: 10,
        alignItems: 'center',
        marginVertical: 5,
    },
    socialButtonText: {
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    floatingPasswordContainer: {
        flex: 1,
    },
    eyeIconButton: {
        position: 'absolute',
        right: 20,
    },
    roleSelectorContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    roleSelectorLabel: {
        fontSize: 14,
        color: colors.primaryBlack,
        fontWeight: '500',
        marginBottom: 8,
    },
    roleButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    roleButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: colors.primaryGreen,
        borderRadius: 8,
        backgroundColor: colors.white,
        alignItems: 'center',
    },
    roleButtonSelected: {
        backgroundColor: colors.primaryGreen,
    },
    roleButtonText: {
        color: colors.primaryGreen,
        fontWeight: '500',
    },
    roleButtonTextSelected: {
        color: colors.white,
    },

});

export default LoginScreen;
