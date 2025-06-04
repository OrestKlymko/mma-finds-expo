import React, {useEffect, useState} from 'react';
import * as WebBrowser from 'expo-web-browser';
import SocialButton from '@/components/method-auth/SocialButton';
import GoogleIcon from '@/assets/icons/google.png';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes} from "@react-native-google-signin/google-signin";

type GoogleMethodProps = {
    onSuccess(email: string, fcm: string | null): void;
    text: string
    loading: boolean
    setLoading: (loading: boolean) => void
};

WebBrowser.maybeCompleteAuthSession();

export const GoogleMethod = ({onSuccess, text,loading,setLoading}: GoogleMethodProps) => {

    const handleGoogleSignin = async () => {
        try {
            setLoading(true);
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                const {user} = response.data;
                const {email} = user;
                const fcm = await AsyncStorage.getItem('deviceToken');
                onSuccess(email, fcm ?? '');
            }else {
                console.error("Google Signin failed:", response); //TODO
                setLoading(false);
            }
        } catch (error) {
            console.error("Google Signin Error:", error?.response); //TODO
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        console.error("Google Signin is in progress");
                        setLoading(false);
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        console.error("Play services not available");
                        setLoading(false);
                        break;
                    default:
                        console.error(error);
                        setLoading(false);
                        break;
                }
            }
            setLoading(false);
        }
    }

    return (
        <SocialButton
            text={text}
            onPress={() => handleGoogleSignin()}
            isLoading={loading}
            iconSource={GoogleIcon}
            backgroundColor="#FFFFFF"
            textColor="#000"
            disabled={loading}
        />
    );
};
