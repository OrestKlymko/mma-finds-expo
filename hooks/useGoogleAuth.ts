import {useCallback, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import {jwtDecode} from "jwt-decode";
import {useAuth as useClerkAuth, useSSO} from "@clerk/clerk-expo";

type Props = (email: string, fcm: string) => void;

export default function useGoogleAuth(
    onSuccess: Props,
    onError: (error: string) => void
) {
    const {getToken, signOut} = useClerkAuth();
    const {startSSOFlow} = useSSO();
    const [loading, setLoading] = useState(false);

    const waitForJwt = async () => {
        for (let i = 0; i < 10; i++) {
            const jwt = await getToken();
            if (jwt) return jwt;
            await new Promise(res => setTimeout(res, 300));
        }
        return null;
    };

    const signIn = useCallback(async () => {
        setLoading(true);
        try {
            const {createdSessionId, setActive} = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl: AuthSession.makeRedirectUri(),
            });

            if (!createdSessionId) throw new Error('No session ID returned');
            if (!setActive) throw new Error('No setActive function returned');
            await setActive({session: createdSessionId});

            const jwt = await waitForJwt();
            if (!jwt) throw new Error('Failed to retrieve token');

            const {email} = jwtDecode<{ email: string }>(jwt);
            if (!email) throw new Error('Email not found in token');

            const fcm = await AsyncStorage.getItem('deviceToken');
            onSuccess(email, fcm ?? '');
        } catch (err: any) {
            console.error('Google auth error:', err);
            onError(err.message || 'Google Sign-In failed');
            await signOut();
        } finally {
            setLoading(false);
        }
    }, [startSSOFlow, setLoading]);

    return {signIn, loading};
}

