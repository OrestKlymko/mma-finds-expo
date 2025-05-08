import {useCallback, useState} from "react";
import {jwtDecode} from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from 'expo-apple-authentication';

export default function useAppleAuth(
    onSuccess: (email: string, fcm: string) => void,
    onError: (error: string) => void
) {
    const [loadingApple, setLoadingApple] = useState(false);

    const signInApple = useCallback(async () => {
        setLoadingApple(true);
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                ],
            });

            if (!credential.identityToken) {
                throw new Error('No identity token returned');
            }

            const decoded = jwtDecode<{ email?: string }>(credential.identityToken);
            const email = credential.email || decoded?.email;

            if (!email) {
                throw new Error('Email not found in Apple credential');
            }

            const fcm = (await AsyncStorage.getItem('deviceToken')) ?? '';
            onSuccess(email, fcm);
        } catch (err: any) {
            if (err.code === 'ERR_CANCELED') return;
            console.warn('Apple Sign-In Error:', err);
            onError(err.message || 'Apple Sign-In failed');
        } finally {
            setLoadingApple(false);
        }
    }, [onSuccess, onError]);

    return { signInApple: signInApple, loadingApple: loadingApple } as const;
}
