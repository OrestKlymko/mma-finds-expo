import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import React, {useCallback} from 'react';
import colors from '@/styles/colors';
import {useAuth} from '@/context/AuthContext';
import {collection, getFirestore, onSnapshot, orderBy, query, where} from 'firebase/firestore';
import {app} from '@/firebase/firebase'; // важливо: firebase має бути ініціалізований окремо
import {getMessageInfo} from '@/service/service';
import {Image} from "expo-image";
import {Conversation} from "@/models/model";
import {useFocusEffect, useRouter} from "expo-router";

export const MessageSection = () => {
    const [conversations, setConversations] = React.useState<Conversation[]>([]);
    const {entityId, role} = useAuth();
    const router = useRouter();
    const db = getFirestore(app);

    useFocusEffect(
        useCallback(() => {
            if (!entityId) return;

            const q = query(
                collection(db, 'conversations'),
                where('participants', 'array-contains', entityId),
                where('theme', '==', 'private'),
                orderBy('lastTimestamp', 'desc')
            );

            const unsubscribe = onSnapshot(q, async (querySnapshot) => {
                try {
                    console.log(entityId);
                    const convList: Conversation[] = [];
                    const promises = querySnapshot.docs.map(async (docSnap) => {
                        const data = docSnap.data();
                        const otherUserId = data.participants.find(
                            (id: string) => id !== entityId
                        );
                        const res = await getMessageInfo(otherUserId, role === 'MANAGER' ? 'PROMOTION' : 'MANAGER');

                        const unreadCount =
                            data.unreadCounts && data.unreadCounts[entityId] !== undefined
                                ? data.unreadCounts[entityId]
                                : 0;

                        convList.push({
                            id: docSnap.id,
                            conversationId: data.conversationId,
                            participants: data.participants,
                            lastMessage: data.lastMessage,
                            lastTimestamp: data.lastTimestamp,
                            unreadCount,
                            avatar: res.profileImage,
                            sender: res.name,
                            archived: data.archived,
                            isBlocked: data.isBlocked,
                        });
                    });

                    await Promise.all(promises);
                    setConversations(convList);
                } catch (error) {
                    console.error('Error fetching conversations:', error);
                    Alert.alert('Error', 'Unable to fetch conversations');
                }
            });

            return () => unsubscribe();
        }, [entityId])
    );

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Messages</Text>
                <TouchableOpacity onPress={() => {
                    router.push('/(app)/(tabs)/messages')
                }}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={conversations}
                keyExtractor={item => `message-${item.id}`}
                horizontal
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={styles.messageBubble}
                        onPress={() => {
                            router.push({
                                pathname: '/messages/private', params: {
                                    receiverUserId: item?.participants.filter(p => p !== entityId)[0],
                                    senderName: item?.sender,
                                    avatar: item?.avatar,
                                }
                            })
                        }}>
                        <Image
                            source={{
                                uri: item?.avatar,
                            }}
                            style={styles.messageLogo}
                        />
                        <Text style={styles.messageLabel}>
                            {item?.sender?.length > 6
                                ? item?.sender?.slice(0, 6) + '...'
                                : item?.sender}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    seeAll: {
        fontSize: 17,
        fontWeight: '500',
        color: colors.primaryGreen,
        paddingRight: 20,
    },
    messageBubble: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    messageLogo: {
        width: 60,
        height: 60,
        borderRadius: 60,
        backgroundColor: '#ccc',
    },
    messageLabel: {
        fontSize: 12,
        color: colors.primaryBlack,
        marginTop: 4,
    },
});
