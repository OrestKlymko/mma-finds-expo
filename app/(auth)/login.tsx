import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import FacebookIcon from '@/assets/icons/facebook.png';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginRequest, UserRoleRequest} from "@/service/request";
import {getRolesOnUser, login} from "@/service/service";
import colors from "@/styles/colors";
import * as WebBrowser from 'expo-web-browser';
import SocialButton from "@/components/method-auth/SocialButton";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import {useRouter} from "expo-router";
import FooterSingUp from "@/components/FooterSingUp";
import GoBackButton from "@/components/GoBackButton";
import {useAuth} from "@/context/AuthContext";
import {GoogleMethod} from "@/components/method-auth/GoogleMethod";
import {AppleMethod} from "@/components/method-auth/AppleMethod";
import RoleSelectModal, {UserRole} from "@/components/RoleSelectModal";


type AuthMethod = 'standard' | 'google' | 'apple' | null;
const LoginScreen = () => {

    const insets = useSafeAreaInsets();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState('');
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const {setToken, setMethodAuth, setRole, setEntityId} = useAuth();
    const [standardLoading, setAuthLoading] = useState(false);
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
    const router = useRouter();
    const [chosenMethod, setChosenMethod] = useState<AuthMethod>('standard');
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [chosenEmail, setChosenEmail] = useState<string | null>(null);
    const [chosenPassword, setChosenPassword] = useState<string | null>(null);
    const [loadingApple, setLoadingApple] = useState(false);
    const handleSignIn = async () => {
        setAuthLoading(true)
        const token = await AsyncStorage.getItem('deviceToken');
        handleLoginToBackend(email, password, 'standard', token);
    };

    const onSuccessOauth = async (email: string) => {
        const fcm = await AsyncStorage.getItem('deviceToken') ?? null;
        handleLoginToBackend(email, null, 'oauth', fcm);
    }


    const handleLoginToBackend = (
        email: string,
        password: string | null,
        method: string,
        token: string | null,
    ) => {

        const requestOnRole: UserRoleRequest = {
            email: email.toLowerCase(),
        }
        getRolesOnUser(requestOnRole).then(async userRoles => {
            if (userRoles && userRoles.length == 1) {
                const loginRequest: LoginRequest = {
                    email: email.toLowerCase(),
                    password: password,
                    method: method,
                    fcmToken: token,
                    userRole: userRoles[0].role,
                };
                await handleLoginOnBackend(loginRequest);
                return
            }
            Keyboard.dismiss();
            setFcmToken(token);
            setChosenMethod(method as AuthMethod);
            setChosenEmail(email);
            setChosenPassword(email);
            showRoleModal(userRoles.map(r => r.role as UserRole));
        })


    };


    async function showRoleModal(roles: UserRole[]) {
        await Promise.race([
            WebBrowser.dismissBrowser().catch(() => {
            }),
            new Promise(res => setTimeout(res, 200)),
        ]);

        Keyboard.dismiss();

        setAvailableRoles(roles);
        setAuthLoading(false);
        setLoadingGoogle(false);
        setLoadingApple(false);
        setRoleModalVisible(true);
    }

    const handleLoginOnBackend = async (loginRequest: LoginRequest) => {
        login(loginRequest)
            .then(async res => {
                setToken(res.token);
                setMethodAuth(res.methodAuth);
                setRole(res.role);
                setEntityId(res.entityId);
                if (res.token) {
                    await AsyncStorage.setItem('authToken', res.token);
                }
                router.push('/');
                setLoadingGoogle(false);
            })
            .catch(err => {
                if (err.status === 404) {
                    Alert.alert(
                        'Error',
                        'User with this email not found, please sign up',
                    );
                    setLoadingGoogle(false);
                    return;
                }
                if (err.status === 407) {
                    Alert.alert(
                        'Error',
                        'User with this email not found, please sign up',
                    );
                } else {
                    Alert.alert('Error', 'Failed to sign in');
                }
                setLoadingGoogle(false);

            })
    }


    const handleFacebookSignIn = async () => {
        Alert.alert('Coming Soon!', 'This feature is coming soon.');
        return;
    };

    return (
        <View style={{backgroundColor: colors.background, flex: 1}}>
            <GoBackButton specificScreen={'/welcome'}/>
            <RoleSelectModal
                visible={roleModalVisible}
                roles={availableRoles}
                onClose={() => setRoleModalVisible(false)}
                onSelect={async (role) => {
                    setRoleModalVisible(false);
                    if (!chosenMethod) {
                        Alert.alert('Error', 'Please go back and try to login again');
                        return;
                    }
                    const loginRequest: LoginRequest = {
                        email: chosenEmail?.toLowerCase(),
                        password: chosenPassword,
                        method: chosenMethod,
                        fcmToken: fcmToken,
                        userRole: role,
                    };
                    await handleLoginOnBackend(loginRequest);
                }}
            />
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
                <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => router.push({pathname: '/(auth)/password'})}>
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleSignIn}
                    disabled={standardLoading}>
                    {standardLoading ? (
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


                <GoogleMethod onSuccess={onSuccessOauth} text={"Sign in with Google"} loading={loadingGoogle}
                              setLoading={setLoadingGoogle}/>

                <SocialButton
                    text="Sign in with Facebook"
                    onPress={handleFacebookSignIn}
                    iconSource={FacebookIcon}
                    backgroundColor="#FFFFFF"
                    textColor="#000"
                />

                {Platform.OS === 'ios' && (
                    <AppleMethod handleSuccessAuth={onSuccessOauth} loadingApple={loadingApple}
                                 setLoadingApple={setLoadingApple} text={"Sign in with Apple"}/>
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
