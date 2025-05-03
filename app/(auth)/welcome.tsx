import React, {useCallback, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {ResizeMode, Video} from "expo-av";
import * as Notifications from 'expo-notifications';
import colors from "@/styles/colors";
import {changeNotificationState} from "@/service/service";
import {ChangeNotificationStatusRequest} from "@/service/request";
import {useAuth} from "@/context/AuthContext";
import {useFocusEffect, useRouter} from "expo-router";


export default function Welcome() {
    const {setToken, setMethodAuth, setRole, role} = useAuth();
    const router = useRouter();
    useFocusEffect(
        useCallback(() => {
            setToken(null);
            setMethodAuth(null);
            setRole(null);
        }, [setMethodAuth, setRole, setToken]),
    );

    useEffect(() => {
        const register = async () => {
            const {status} = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') return;

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            if (token && role) {
                const body: ChangeNotificationStatusRequest = {
                    fcmToken: token,
                    enableNotification: true,
                    role: role,
                };
                changeNotificationState(body);
                await AsyncStorage.setItem('deviceToken', token);
            }
        };
        register();
    }, []);

    return (
        <View style={styles.container}>
            <Video
                source={require('@/assets/back.mp4')}
                style={styles.backgroundVideo}
                isMuted
                isLooping={true}
                resizeMode={ResizeMode.COVER}
                shouldPlay
            />
            <View style={styles.overlay}/>

            <View style={styles.contentContainer}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.title, {fontWeight: '800'}]}>MMA</Text>
                    <Text style={styles.title}>FINDS</Text>
                </View>
                <Text style={styles.subtitle}>MMA MATCHMAKING, REDEFINED.</Text>
            </View>
            <View style={styles.buttonsOverlay}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push({pathname: '/(auth)/sign-up/promotion', params: {secondProfile: 'false'}})}>
                    <Text style={styles.buttonText}>I&apos;m a Promoter</Text>
                    <Text style={styles.buttonSubText}>
                        I&apos;m looking for talented fighters for my event.
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push({pathname: '/(auth)/sign-up/manager', params: {secondProfile: 'false'}})}>
                    <Text style={styles.buttonText}>I Manage Fighters</Text>
                    <Text style={styles.buttonSubText}>
                        I&apos;d like the best fight deals for my fighters.
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => router.push({pathname: '/login', params: {}})}>
                    <Text style={[styles.footerText, {color: colors.primaryGreen}]}>
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
        ;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
    },
    backgroundVideo: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentContainer: {
        paddingHorizontal: 24,
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 150,
    },
    title: {
        fontSize: 30,
        fontWeight: '500',
        color: colors.white,
        textAlign: 'center',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: '#FEC10B',
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 40,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 70,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 1,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 17,
        fontWeight: '500',
        color: colors.white,
    },
    buttonsOverlay: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        paddingHorizontal: 24,
    },
    button: {
        flex: 1,
        backgroundColor: colors.white,
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Roboto',
    },
    buttonSubText: {
        fontSize: 11,
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: 'Roboto',
        color: '#656565',
    },
});
