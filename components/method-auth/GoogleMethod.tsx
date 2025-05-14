import React, {useEffect, useState} from 'react';
import * as WebBrowser from 'expo-web-browser';
import SocialButton from '@/components/method-auth/SocialButton';
import GoogleIcon from '@/assets/icons/google.png';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from "@react-native-async-storage/async-storage";


type GoogleMethodProps = {
    onSuccess(email: string, fcm: string|null): void;
    text:string
};

WebBrowser.maybeCompleteAuthSession();

export const GoogleMethod = ({onSuccess,text}: GoogleMethodProps) => {
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        iosClientId: "712660973446-q1o7h9v7nk36d2bdict84nfn8o6ackcg.apps.googleusercontent.com",
        androidClientId: "712660973446-em7jf27c07obt4re1iihcq9oinjgrlqb.apps.googleusercontent.com",
        webClientId: "712660973446-em7jf27c07obt4re1iihcq9oinjgrlqb.apps.googleusercontent.com",
    });

    useEffect(() => {
        if (response?.type === 'success') {
            getEmail(response.params.access_token).then(async (email) => {
                console.log('Google email =>', email);
                const fcm = await AsyncStorage.getItem('deviceToken');
                onSuccess(email, fcm ?? '');
            });
        }
    }, [response]);

    async function getEmail(accessToken: string) {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {Authorization: `Bearer ${accessToken}`},
        });
        const data = await res.json();
        return data.email;
    }

    return (
        <SocialButton
            text={text}
            onPress={() => promptAsync()}
            isLoading={loadingGoogle}
            iconSource={GoogleIcon}
            backgroundColor="#FFFFFF"
            textColor="#000"
            disabled={loadingGoogle}
        />
    );
};
