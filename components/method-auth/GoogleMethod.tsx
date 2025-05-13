import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import SocialButton from '@/components/method-auth/SocialButton';
import GoogleIcon from '@/assets/icons/google.png';
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";
import {LoginResponse} from "@/service/response";
import {createFormDataForManager, createFormDataForPromotion} from "@/service/create-entity/formDataService";
import {createManager, createPromotion} from "@/service/service";
import {useRouter} from "expo-router";
import * as Google from 'expo-auth-session/providers/google';
import { auth } from '@/firebase/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

type GoogleMethodProps = {
    data: SignUpDataManager | SignUpDataPromotion | undefined;
    handleSuccessAuth: (res: LoginResponse) => void;
    role: 'MANAGER' | 'PROMOTION';
};

WebBrowser.maybeCompleteAuthSession();

export const GoogleMethod = ({data, handleSuccessAuth, role}: GoogleMethodProps) => {
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const router = useRouter();
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        iosClientId:     "712660973446-q1o7h9v7nk36d2bdict84nfn8o6ackcg.apps.googleusercontent.com",
        androidClientId: "712660973446-em7jf27c07obt4re1iihcq9oinjgrlqb.apps.googleusercontent.com",
        webClientId:     "712660973446-em7jf27c07obt4re1iihcq9oinjgrlqb.apps.googleusercontent.com",
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const {id_token} = response.params;

            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).then(({user}) => {
                console.log(user);
            });
        }
    }, [response]);
    const signInWithGoogle = async () => {
        setLoadingGoogle(true);
        // await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // const { data } = await GoogleSignin.signIn();
        // console.log(data?.user.email);
        // const credential = auth.GoogleAuthProvider.credential(idToken);
        // const userCred = await auth().signInWithCredential(credential);
        // const email = userCred.user.email;
        // await GoogleSignin.hasPlayServices();
        // const response = await GoogleSignin.signIn();
        // if (isSuccessResponse(response)) {
        //     const {user} = response.data;
        //     if (!user.email) {
        //         Alert.alert('Google Sign-In failed', 'No email returned');
        //         return;
        //     }
        //     try {
        //         if (role === 'PROMOTION') {
        //             const formData = await createFormDataForPromotion(data as SignUpDataPromotion, user.email, 'oauth');
        //             const res = await createPromotion(formData);
        //             handleSuccessAuth(res);
        //             router.push('/(app)/(tabs)');
        //         } else if (role === 'MANAGER') {
        //             const formData = await createFormDataForManager(data as SignUpDataManager, user.email, 'oauth');
        //             const res = await createManager(formData);
        //             handleSuccessAuth(res);
        //             router.push('/manager/fighter/create');
        //         }
        //     } catch (err: any) {
        //         if (err?.response?.status === 409) {
        //             Alert.alert('This email is already registered.');
        //         } else {
        //             Alert.alert('Failed to create a profile.');
        //         }
        //     } finally {
        //         setLoadingGoogle(false);
        //     }
        // }
    };

    return (
        <SocialButton
            text="Sign up with Google"
            onPress={()=>promptAsync()}
            isLoading={loadingGoogle}
            iconSource={GoogleIcon}
            backgroundColor="#FFFFFF"
            textColor="#000"
            disabled={loadingGoogle}
        />
    );
};
