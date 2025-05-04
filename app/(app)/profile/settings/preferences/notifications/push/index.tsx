import React, {useEffect, useState} from 'react';
import {Alert, Linking, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from "@/context/AuthContext";
import {changeNotificationState} from "@/service/service";
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";

const NotificationSettingScreen = () => {
    const insets = useSafeAreaInsets();
    const { role } = useAuth();

    const [emailNotification, setEmailNotification] = useState(false);
    const [pushNotification, setPushNotification] = useState(false);

    useEffect(() => {
        checkPushNotificationStatus();
    }, []);

    const checkPushNotificationStatus = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        setPushNotification(status === 'granted' || status === 'provisional');
    };

    const requestNotificationPermission = async () => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        if (existingStatus === 'denied') {
            Alert.alert(
                'Allow Notifications',
                'To receive push notifications, please go to Settings and allow notifications for this app.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
            return null;
        }

        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') return null;

        const tokenData = await Notifications.getExpoPushTokenAsync();
        return tokenData.data;
    };

    const handlePushNotificationToggle = async (isEnabled: boolean) => {
        if (isEnabled) {
            const expoPushToken = await requestNotificationPermission();
            if (expoPushToken) {
                await AsyncStorage.setItem('deviceToken', expoPushToken);
                await changeNotificationState({
                    fcmToken: expoPushToken,
                    enableNotification: true,
                    role,
                });
                setPushNotification(true);
            }
        } else {
            const storedToken = await AsyncStorage.getItem('deviceToken');
            await AsyncStorage.removeItem('deviceToken');
            await changeNotificationState({
                fcmToken: storedToken,
                enableNotification: false,
                role,
            });
            setPushNotification(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <GoBackButton />
            <ScrollView
                contentContainerStyle={[styles.container, { paddingBottom: insets.bottom }]}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                <Text style={styles.title}>Notifications</Text>

                <View style={styles.section}>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>Email Notifications</Text>
                        <Switch
                            value={emailNotification}
                            onValueChange={setEmailNotification}
                            trackColor={{ false: colors.lightGray, true: colors.primaryGreen }}
                            thumbColor={emailNotification ? colors.white : colors.gray}
                        />
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.itemText}>Push Notifications</Text>
                        <Switch
                            value={pushNotification}
                            onValueChange={handlePushNotificationToggle}
                            trackColor={{ false: colors.lightGray, true: colors.primaryGreen }}
                            thumbColor={pushNotification ? colors.white : colors.gray}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default NotificationSettingScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        fontFamily: 'Roboto',
        lineHeight: 30,
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 32,
    },
    section: {
        marginBottom: 32,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Roboto',
        lineHeight: 24,
        color: colors.primaryBlack,
    },
});
