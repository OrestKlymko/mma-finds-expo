import React, {useEffect, useState} from 'react';
import * as WebBrowser from 'expo-web-browser';
import SocialButton from '@/components/method-auth/SocialButton';
import GoogleIcon from '@/assets/icons/google.png';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";

type GoogleMethodProps = {
    onSuccess(email: string, fcm: string|null): void;
    text:string
};

WebBrowser.maybeCompleteAuthSession();

export const GoogleMethod = ({onSuccess,text}: GoogleMethodProps) => {
    const [loadingGoogle, setLoadingGoogle] = useState(false);

    const handleGoogleSignin = async () => {
        try {
            setLoadingGoogle(true);
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if(isSuccessResponse(response)) {
                const {user} = response.data;
                const {email} = user;
                console.log("Email:", email);
                const fcm = await AsyncStorage.getItem('deviceToken');
                onSuccess(email, fcm ?? '');
            }

            setLoadingGoogle(false);
        }
        catch (error) {
            if(isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        console.error("Google Signin is in progress");
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        console.error("Play services not available");
                        break;
                    default:
                        console.error(error);
                        break;
                }
            }

            setLoadingGoogle(false);
        }
    }

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
            onPress={() => handleGoogleSignin()}
            isLoading={loadingGoogle}
            iconSource={GoogleIcon}
            backgroundColor="#FFFFFF"
            textColor="#000"
            disabled={loadingGoogle}
        />
    );
};
