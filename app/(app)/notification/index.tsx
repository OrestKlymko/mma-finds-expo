import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BellIcon from '@/assets/bell.svg';
import DeleteIcon from '@/assets/delete.svg';
import {useAuth} from "@/context/AuthContext";
import {useFocusEffect} from "expo-router";
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";


export type NotificationItem = {
    title: string;
    body: string;
    data: {
        id: string;
        timestamp: string;
        type: string;
        [key: string]: string;
    };
};
// Допоміжна функція для групування сповіщень за датою
const groupNotificationsByDate = (notifications: NotificationItem[]) => {
    const today: NotificationItem[] = [];
    const last7Days: NotificationItem[] = [];
    const last30Days: NotificationItem[] = [];
    const now = new Date();
    notifications.forEach(notif => {
        const notifDate = new Date(notif.data.timestamp);
        const diffTime = now.getTime() - notifDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        if (diffDays < 1) {
            today.push(notif);
        } else if (diffDays >= 1 && diffDays < 7) {
            last7Days.push(notif);
        } else {
            last30Days.push(notif);
        }
    });
    return {today, last7Days, last30Days};
};

const NotificationsScreen = () => {
    const {role} = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [grouped, setGrouped] = useState({
        today: [] as NotificationItem[],
        last7Days: [] as NotificationItem[],
        last30Days: [] as NotificationItem[],
    });
    const loadNotifications = async () => {
        try {
            const stored = await AsyncStorage.getItem('notifications');
            if (stored) {
                const parsed: NotificationItem[] = JSON.parse(stored);

                setNotifications(parsed.filter(n => n.data.role === role));
            }
        } catch (error) {
            console.error('Failed to load notifications', error);
        }
    };

    const saveNotifications = async (newNotifications: NotificationItem[]) => {
        try {
            await AsyncStorage.setItem(
                'notifications',
                JSON.stringify(newNotifications),
            );
        } catch (error) {
            console.error('Failed to save notifications', error);
        }
    };

    // Завантажуємо сповіщення при монтуванні
    useEffect(() => {
        AsyncStorage.setItem('newNotification', '0');
        loadNotifications();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setGrouped(groupNotificationsByDate(notifications));
        }, [notifications]),
    );

    // Обробка натискання на сповіщення
    const handleNotificationPress = (notif: NotificationItem) => {
        const type = notif.data?.type;
        switch (type) {
            case 'EXCLUSIVE_OFFER':
                if (role === 'MANAGER') {
                    navigation.navigate('ManagerExclusiveOfferDetailsScreen', {
                        offerId: notif.data.offerId,
                        fighterId: notif.data.fighterId || undefined,
                    });
                } else {
                    navigation.navigate('PromotionExclusiveOfferDetail', {
                        offerId: notif.data.offerId,
                    });
                }
                break;
            case 'PUBLIC_OFFER':
                navigation.navigate(
                    role === 'MANAGER'
                        ? 'ManagerPublicOfferDetailsScreen'
                        : 'PromotionOfferDetailsScreen',
                    {
                        offerId: notif.data.offerId,
                    },
                );
                break;
            case 'MULTI_FIGHT_OFFER':
                if (role === 'MANAGER') {
                    navigation.navigate('ManagerMultiFightOfferDetailsScreen', {
                        offerId: notif.data.offerId,
                        fighterId: notif.data.fighterId || undefined,
                    });
                } else {
                    navigation.navigate('PromotionMultiFightOfferDetails', {
                        offerId: notif.data.offerId,
                    });
                }
                break;
            case 'VERIFICATION':
                navigation.navigate(
                    role === 'MANAGER'
                        ? 'VerificationManagerScreen'
                        : 'VerificationPromotionScreen',
                );
                break;
            default:
                break;
        }
    };

    // Функція видалення сповіщення
    const deleteNotification = async (notifId: string) => {
        const updated = notifications.filter(n => n.data.id !== notifId);
        setNotifications(updated);
        await saveNotifications(updated);
    };

    // Рендер елемента сповіщення (front row)
    const renderNotificationItem = ({item}: {item: NotificationItem}) => (
        <Pressable
            style={styles.notificationContainer}
            onPress={() => handleNotificationPress(item)}>
            <BellIcon width={24} height={24} />
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationDescription}>{item.body}</Text>
            </View>
        </Pressable>
    );

    // Рендер прихованого елемента для свайпу
    const renderHiddenItem = ({item}: {item: NotificationItem}) => (
        <View style={styles.hiddenContainer}>
            <TouchableOpacity
                style={styles.hiddenButton}
                onPress={() => deleteNotification(item.data.id)}>
                <DeleteIcon width={20} height={20} />
                <Text style={styles.hiddenButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    // Рендер груп сповіщень
    const renderGroup = (groupTitle: string, data: NotificationItem[]) => (
        <View style={styles.groupContainer}>
            <Text style={styles.groupTitle}>{groupTitle}</Text>
            <SwipeListView
                data={data}
                keyExtractor={item => item.data.id}
                renderItem={renderNotificationItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-100}
                disableRightSwipe
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.headerTitle}>Notifications</Text>
                {/* Якщо потрібно, можна додати модальне вікно для вибору фільтра */}
                <View style={styles.container}>
                    <FlatList
                        data={[]}
                        showsVerticalScrollIndicator={false}
                        renderItem={() => null}
                        showsHorizontalScrollIndicator={false}
                        ListHeaderComponent={
                            <>
                                {grouped.today.length > 0 &&
                                    renderGroup('Today', grouped.today)}
                                {grouped.last7Days.length > 0 &&
                                    renderGroup('Last 7 Days', grouped.last7Days)}
                                {grouped.last30Days.length > 0 &&
                                    renderGroup('Last 30 Days', grouped.last30Days)}
                            </>
                        }
                    />
                </View>
            </SafeAreaView>
        </View>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    headerTitle: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 16,
    },
    groupContainer: {
        marginBottom: 20,
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryGreen,
        marginBottom: 8,
        marginLeft: 8,
    },
    notificationContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        alignItems: 'center',
    },
    notificationContent: {
        marginLeft: 16,
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 4,
    },
    notificationDescription: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.primaryBlack,
        lineHeight: 17,
        paddingRight: 16,
    },
    hiddenContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1,
        paddingRight: 15,
        backgroundColor: colors.darkError,
    },
    hiddenButton: {
        width: 70,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hiddenButtonText: {
        color: '#FFF',
        fontSize: 12,
        marginTop: 4,
    },
});
