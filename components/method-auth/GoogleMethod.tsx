import React, {useState} from 'react';
import {Alert} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import SocialButton from '@/components/method-auth/SocialButton';
import GoogleIcon from '@/assets/icons/google.png';
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";
import {LoginResponse} from "@/service/response";
import {createFormDataForManager, createFormDataForPromotion} from "@/service/create-entity/formDataService";
import {createManager, createPromotion} from "@/service/service";
import {useRouter} from "expo-router";
import {GoogleSignin, isSuccessResponse} from "@react-native-google-signin/google-signin";

type GoogleMethodProps = {
    data: SignUpDataManager | SignUpDataPromotion | undefined;
    handleSuccessAuth: (res: LoginResponse) => void;
    role: 'MANAGER' | 'PROMOTION';
};

WebBrowser.maybeCompleteAuthSession();

export const GoogleMethod = ({data, handleSuccessAuth, role}: GoogleMethodProps) => {
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const router = useRouter();

    const signInWithGoogle = async () => {
        setLoadingGoogle(true);
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
            const {user} = response.data;
            if (!user.email) {
                Alert.alert('Google Sign-In failed', 'No email returned');
                return;
            }
            try {
                if (role === 'PROMOTION') {
                    const formData = await createFormDataForPromotion(data as SignUpDataPromotion, user.email, 'google');
                    const res = await createPromotion(formData);
                    handleSuccessAuth(res);
                    router.push('/(app)/(tabs)');
                } else if (role === 'MANAGER') {
                    const formData = await createFormDataForManager(data as SignUpDataManager, user.email, 'google');
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
                setLoadingGoogle(false);
            }
        }
    };

    return (
        <SocialButton
            text="Sign up with Google"
            onPress={signInWithGoogle}
            isLoading={loadingGoogle}
            iconSource={GoogleIcon}
            backgroundColor="#FFFFFF"
            textColor="#000"
            disabled={loadingGoogle}
        />
    );
};
