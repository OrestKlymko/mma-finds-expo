import {useEffect} from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Notifier} from 'react-native-notifier';
import {CustomToast} from "@/components/CustomToast";
import {useRouter} from "expo-router";

type PushData = {
    id?: string;
    timestamp?: string;
    type?: string;
    role?: string;
    offerId?: string;
    eventBanner?: string;
    fighterId?: string;
    promotionId?: string;
    promotionName?: string;
    promotionAvatar?: string;
};

export type NotificationItem = {
    title: string;
    body: string;
    data: PushData;
};

const makeItem = (n: Notifications.Notification): NotificationItem => ({
    title: n.request.content.title ?? 'No title',
    body: n.request.content.body ?? '',
    data: n.request.content.data as PushData,
});

export function usePushNotifications() {
    const router = useRouter();
    useEffect(() => {
        // ===== 1. реєструємо permission + токен (можеш відправити на бек)
        (async () => {
            if (!Device.isDevice) return;
            const {status} = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }
            const token = await Notifications.getExpoPushTokenAsync();
            console.log('Expo push token', token.data);
            console.log(token.data);
            AsyncStorage.setItem('deviceToken', token.data);
        })();

        // ===== 2. Foreground listener
        const subForeground =
            Notifications.addNotificationReceivedListener(async (notif) => {
                await handleNotification(notif);
            });

        // ===== 3. Клік по пушу, коли програма у бекграунді/закрита
        const subResponse =
            Notifications.addNotificationResponseReceivedListener(async (resp) => {
                await handleNotification(resp.notification);
            });

        // ===== 4. Cold start (app killed)
        (async () => {
            const last = await Notifications.getLastNotificationResponseAsync();
            if (last) await handleNotification(last.notification);
        })();

        return () => {
            subForeground.remove();
            subResponse.remove();
        };
    }, []);

    // ================= helper =================
    const handleNotification = async (notif: Notifications.Notification) => {
        const item = makeItem(notif);

        // ++ лічильник
        const rawCount = await AsyncStorage.getItem('newNotification');
        const newCount = (parseInt(rawCount ?? '0', 10) + 1).toString();
        await AsyncStorage.setItem('newNotification', newCount);

        // масив
        const raw = await AsyncStorage.getItem('notifications');
        const arr: NotificationItem[] = raw ? JSON.parse(raw) : [];
        arr.push(item);
        await AsyncStorage.setItem('notifications', JSON.stringify(arr));

        // тост
        Notifier.showNotification({
            title: item.title,
            description: item.body,
            Component: CustomToast,
            duration: 3000,
            showAnimationDuration: 500,
            hideOnPress: true,
            onPress: () => {
                router.push('/notification')
            },
        });
    };
}
