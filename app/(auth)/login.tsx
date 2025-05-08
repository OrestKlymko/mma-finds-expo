import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import GoogleIcon from '@/assets/icons/google.png';
import FacebookIcon from '@/assets/icons/facebook.png';
import AppleIcon from '@/assets/icons/apple.png';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import {useAuth} from "@/context/AuthContext";
import {LoginRequest} from "@/service/request";
import {login} from "@/service/service";
import colors from "@/styles/colors";
import SocialButton from "@/components/method-auth/SocialButton";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import {useRouter} from "expo-router";
import FooterSingUp from "@/components/FooterSingUp";
import {RoleSelector} from "@/components/RoleSelector";
import GoBackButton from "@/components/GoBackButton";
import {GoogleSignin, isSuccessResponse} from "@react-native-google-signin/google-signin";
WebBrowser.maybeCompleteAuthSession();
import {jwtDecode} from 'jwt-decode';

type AuthMethod = 'standard' | 'google' | 'apple' | null;
const LoginScreen = () => {
    const insets = useSafeAreaInsets();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState('');
    const {setToken, setMethodAuth, setRole, setEntityId} = useAuth();
    const [authLoading, setAuthLoading] = useState<AuthMethod>(null);
    const [selectedRole, setSelectedRole] = useState<'MANAGER' | 'PROMOTION'>('MANAGER');
    const router = useRouter();


    const handleSignIn = async () => {
        setAuthLoading('standard');
        const token = await AsyncStorage.getItem('deviceToken');
        handleLoginToBackend(email, password, 'standard', token);
    };

    const handleAppleSignIn = async () => {
        setAuthLoading('apple');
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                ],
            });

            if(!credential.identityToken) {
                Alert.alert('Apple Sign-In', 'Failed to sign in');
                setAuthLoading(null);
                return;
            }
            const email = credential.email || jwtDecode(credential.identityToken)?.email;
            const fcm = await AsyncStorage.getItem('deviceToken');

            handleLoginToBackend(email, null, 'apple', fcm);
        } catch (err: any) {
            if (err.code !== 'ERR_CANCELED') {
                Alert.alert('Apple Sign-In', 'Failed to sign in');
                console.warn(err);
            }
            setAuthLoading(null);
        }
    };

    const handleGoogleSignIn = async () => {
        setAuthLoading('google');
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            const token = await AsyncStorage.getItem('deviceToken');
            if (isSuccessResponse(response)) {
                const {user} = response.data;
                handleLoginToBackend(user?.email, null, 'google', token);
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to sign in');
            console.error(e);
            setAuthLoading(null);
        }
    };


    const handleLoginToBackend = (
        email: string,
        password: string | null,
        method: string,
        token: string | null,
    ) => {
        const loginRequest: LoginRequest = {
            email: email,
            password: password,
            method: method,
            fcmToken: token,
            userRole: selectedRole!,
        };
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
                    router.push('/');
                }, 1000);
            })
            .catch(err => {
                if (err.response.status === 407) {
                    Alert.alert(
                        'Error',
                        'User with this email not found, please sign up',
                    );
                } else {
                    Alert.alert('Error', 'Failed to sign in');
                }

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
                <RoleSelector onSelect={setSelectedRole} selected={selectedRole}/>

                <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => router.push('/(auth)/forgot-password')}>
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
                <SocialButton
                    text="Sign in with Google"
                    onPress={handleGoogleSignIn}
                    iconSource={GoogleIcon}
                    backgroundColor="#FFFFFF"
                    textColor="#000"
                    disabled={authLoading !== null && authLoading !== 'google'}
                    isLoading={authLoading === 'google'}
                />

                <SocialButton
                    text="Sign in with Facebook"
                    onPress={handleFacebookSignIn}
                    iconSource={FacebookIcon}
                    backgroundColor="#FFFFFF"
                    textColor="#000"
                />

                {Platform.OS === 'ios' && (
                    <SocialButton
                        text="Sign in with Apple"
                        onPress={handleAppleSignIn}
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
