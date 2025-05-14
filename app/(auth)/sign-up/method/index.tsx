import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from "@/context/AuthContext";
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";
import {LoginResponse} from "@/service/response";
import {changeNotificationState, createManager, createPromotion} from "@/service/service";
import colors from "@/styles/colors";
import {TraditionalMethod} from '@/components/method-auth/TraditionalMethod';
import {Divider} from "@/components/method-auth/Divider";
import {GoogleMethod} from "@/components/method-auth/GoogleMethod";
import {FacebookMethod} from "@/components/method-auth/FacebookMethod";
import {AppleMethod} from "@/components/method-auth/AppleMethod";
import GoBackButton from "@/components/GoBackButton";
import {useLocalSearchParams, useRouter} from "expo-router";
import {createFormDataForManager, createFormDataForPromotion} from "@/service/create-entity/formDataService";


export default function Index() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const data = params.data ? JSON.parse(params.data as string) as SignUpDataManager | SignUpDataPromotion : undefined;
    const role = params.role as 'MANAGER' | 'PROMOTION';

    const {setToken, setMethodAuth, setRole, setEntityId} = useAuth();


    const createProfile = async (email: string, fcm: string | null) => {
        try {
            if (role === 'PROMOTION') {
                const formData = await createFormDataForPromotion(data as SignUpDataPromotion, email, 'oauth');
                const res = await createPromotion(formData);
                await handleSuccessAuth(res);
                router.push('/(app)/(tabs)');
            } else if (role === 'MANAGER') {
                const formData = await createFormDataForManager(data as SignUpDataManager, email, 'oauth');
                const res = await createManager(formData);
                await handleSuccessAuth(res);
                router.push('/manager/fighter/create');
            }
        } catch (err: any) {
            if (err?.response?.status === 409) {
                Alert.alert('This email is already registered.');
            } else {
                Alert.alert('Failed to create a profile.');
            }
        }
    }

    const handleSuccessAuth = async (res: LoginResponse) => {
        setEntityId(res.entityId);
        setToken(res.token);
        setMethodAuth(res.methodAuth);
        setRole(res.role);

        try {
            const tokenMobile = await AsyncStorage.getItem('deviceToken');
            if (tokenMobile) {
                const body = {
                    fcmToken: tokenMobile,
                    enableNotification: true,
                    role: role,
                };
                changeNotificationState(body);
            }
        } catch (err) {
            console.error('Error saving device token:', err);
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton/>
            <View style={styles.container}>
                <TraditionalMethod data={data} role={role}/>
                <Divider/>
                <GoogleMethod onSuccess={createProfile} text={"Sign up with Google"}/>
                <FacebookMethod data={data} handleSuccessAuth={handleSuccessAuth}/>
                <AppleMethod data={data} handleSuccessAuth={handleSuccessAuth} role={role}/>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 38,
        justifyContent: 'center',
    },
});
