import {Alert, Platform} from "react-native";
import React from "react";
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";
import {LoginResponse} from "@/service/response";
import SocialButton from "@/components/method-auth/SocialButton";
import AppleIcon from "@/assets/icons/apple.png";
import * as AppleAuthentication from "expo-apple-authentication";
import {jwtDecode} from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createFormDataForManager, createFormDataForPromotion} from "@/service/create-entity/formDataService";
import {createManager, createPromotion} from "@/service/service";
import {useRouter} from "expo-router";

type AppleMethodProps = {
    data?: SignUpDataPromotion | SignUpDataManager;
    handleSuccessAuth: (res: LoginResponse) => void;
    role: 'MANAGER' | 'PROMOTION';
}

export const AppleMethod = (
    {data, handleSuccessAuth, role}: AppleMethodProps,
) => {
    const [loadingApple, setLoadingApple] = React.useState(false);
    const router = useRouter();
    const handleAppleSignIn = async () => {
        setLoadingApple(true);
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                ],
            });

            if (!credential.identityToken) {
                Alert.alert('Apple Sign-In', 'Failed to sign in');
                setLoadingApple(false);
                return;
            }
            const email = credential.email || jwtDecode(credential.identityToken)?.email;
            const fcm = await AsyncStorage.getItem('deviceToken');
            if (!email) {
                Alert.alert('Apple Sign-In', 'Failed to sign in without email');
                setLoadingApple(false);
                return;
            }
            try {
                if (role === 'PROMOTION') {
                    const formData = await createFormDataForPromotion(data as SignUpDataPromotion, email, 'oauth');
                    const res = await createPromotion(formData);
                    handleSuccessAuth(res);
                    router.push('/(app)/(tabs)');
                } else if (role === 'MANAGER') {
                    const formData = await createFormDataForManager(data as SignUpDataManager, email, 'oauth');
                    const res = await createManager(formData);
                    handleSuccessAuth(res);
                    router.push('/manager/fighter/create');
                }
            } catch (err: any) {
                if (err?.response?.status === 409) {
                    Alert.alert('This email is already registered.');
                } else {
                    Alert.alert('Failed to create a profile.');
                }
            } finally {
                setLoadingApple(false);
            }
        } catch (err: any) {
            if (err.code !== 'ERR_CANCELED') {
                Alert.alert('Apple Sign-In', 'Failed to sign in');
                console.warn(err);
            }
            setLoadingApple(false);
        }
    };
    return <>
        {Platform.OS === 'ios' && (
            <SocialButton
                text="Sign up with Apple"
                onPress={handleAppleSignIn}
                iconSource={AppleIcon}
                backgroundColor="#FFFFFF"
                textColor="#000"
                isLoading={loadingApple}
                disabled={loadingApple}
            />
        )}</>;
};
