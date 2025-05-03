import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import SocialButton from '@/components/method-auth/SocialButton';
import GoogleIcon from '@/assets/icons/google.png';
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";
import {LoginResponse} from "@/service/response";
import {createFormDataForManager, createFormDataForPromotion} from "@/service/create-entity/formDataService";
import {createManager, createPromotion} from "@/service/service";
import {useRouter} from "expo-router";

type GoogleMethodProps = {
  data: SignUpDataManager | SignUpDataPromotion;
  handleSuccessAuth: (res: LoginResponse) => void;
  role: 'MANAGER' | 'PROMOTION';
};

WebBrowser.maybeCompleteAuthSession();

export const GoogleMethod = ({ data, handleSuccessAuth, role }: GoogleMethodProps) => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const router= useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '712660973446-4did9susmthfbkft1kh24tt3731r44qu.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: '712660973446-4rfn9hj3e2n8orr9bc0jpupvt0bbkmqk.apps.googleusercontent.com',
  });


  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === 'success') {
        setLoadingGoogle(true);
        const idToken = response.authentication?.idToken;

        const userInfoRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${response.authentication?.accessToken}` },
        });

        const userInfo = await userInfoRes.json();
        const email = userInfo?.email;
        if (!email) {
          Alert.alert('Google Sign-In failed', 'No email returned');
          setLoadingGoogle(false);
          return;
        }

        try {
          if (role === 'PROMOTION') {
            const formData = await createFormDataForPromotion(data as SignUpDataPromotion, email, 'google');
            const res = await createPromotion(formData);
            handleSuccessAuth(res);
            router.push('/(tabs)');
          } else if (role === 'MANAGER') {
            const formData = await createFormDataForManager(data as SignUpDataManager, email, 'google');
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

    signInWithGoogle();
  }, [response]);

  return (
      <SocialButton
          text="Sign up with Google"
          onPress={() => promptAsync()}
          isLoading={loadingGoogle}
          iconSource={GoogleIcon}
          backgroundColor="#FFFFFF"
          textColor="#000"
          disabled={!request || loadingGoogle}
      />
  );
};
