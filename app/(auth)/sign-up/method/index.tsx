import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from "@/context/AuthContext";
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";
import {LoginResponse} from "@/service/response";
import {changeNotificationState} from "@/service/service";
import colors from "@/styles/colors";
import {TraditionalMethod} from '@/components/method-auth/TraditionalMethod';
import {Divider} from "@/components/method-auth/Divider";
import {GoogleMethod} from "@/components/method-auth/GoogleMethod";
import {FacebookMethod} from "@/components/method-auth/FacebookMethod";
import {AppleMethod} from "@/components/method-auth/AppleMethod";
import GoBackButton from "@/components/GoBackButton";
import {useLocalSearchParams, useRouter} from "expo-router";


export default function Index() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const data = params.data ? JSON.parse(params.data as string) as SignUpDataManager | SignUpDataPromotion : undefined;
    const role = params.role as 'MANAGER' | 'PROMOTION';

    const {setToken, setMethodAuth, setRole, setEntityId} = useAuth();


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
                <GoogleMethod data={data} handleSuccessAuth={handleSuccessAuth} role={role}/>
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
