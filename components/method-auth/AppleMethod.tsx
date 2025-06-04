import {Alert, Platform} from "react-native";
import React from "react";
import SocialButton from "@/components/method-auth/SocialButton";
import AppleIcon from "@/assets/icons/apple.png";
import * as AppleAuthentication from "expo-apple-authentication";
import {jwtDecode} from "jwt-decode";

type AppleMethodProps = {
    handleSuccessAuth: (email: string) => void;
    loadingApple: boolean;
    setLoadingApple: (loading: boolean) => void;
    text: string;
}

export const AppleMethod = (
    {text, loadingApple, setLoadingApple, handleSuccessAuth}: AppleMethodProps,
) => {
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
            if (!email) {
                Alert.alert('Apple Sign-In', 'Failed to sign in without email');
                setLoadingApple(false);
                return;
            }
            handleSuccessAuth(email);
            setLoadingApple(false);
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
                text={text}
                onPress={handleAppleSignIn}
                iconSource={AppleIcon}
                backgroundColor="#FFFFFF"
                textColor="#000"
                isLoading={loadingApple}
                disabled={loadingApple}
            />
        )}</>;
};
