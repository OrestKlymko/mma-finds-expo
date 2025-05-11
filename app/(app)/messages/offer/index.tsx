import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
    writeBatch,
} from 'firebase/firestore';

import {firestore} from '@/firebase/firebase';
import {useAuth} from '@/context/AuthContext';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';

import {OfferType} from '@/service/request';
import {MessageItem} from "@/models/model";
import {AvatarSection} from "@/components/message/AvatarSection";
import {SendMessage} from "@/components/message/SendMessage";
import MessageOption from "@/components/message/MessageOption";
import {Message} from "@/components/message/Message";
import {OfferRelatedSection} from "@/components/message/OfferRelatedSection";
import {useFocusEffect, useLocalSearchParams} from "expo-router";

const OpenChatPublicOfferScreen = () => {
    const {entityId} = useAuth();
    // const {receiverUserId, senderName, avatar, offer, typeOffer} = route.params as {
    //     receiverUserId: string;
    //     senderName: string;
    //     avatar: string;
    //     offer: any;
    //     typeOffer: OfferType;
    // };
    const params = useLocalSearchParams();
    const receiverUserId = params.receiverUserId as string;
    const senderName = params.senderName as string;
    const avatar = params.avatar as string;
    const offer = JSON.parse(params.offer as any) as any;
    const typeOffer = params.typeOffer as OfferType;

    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    const [isModalVisible, setModalVisible] = useState(false);
    const [chatMessages, setChatMessages] = useState<MessageItem[]>([]);
    const [converId, setConverId] = useState<string | null>(null);
    const [isBlocked, setIsBlocked] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        const findOrCreateChat = async () => {
            if (!entityId || !receiverUserId || !offer) return;

            const id = await getOrCreateConversation(entityId, receiverUserId, offer.id ?? offer.offerId);
            setConverId(id);
        };

        findOrCreateChat();
    }, [receiverUserId, entityId]);

    const getOrCreateConversation = async (
        userId: string,
        receiverId: string,
        offerId: string,
    ): Promise<string | null> => {

        try {
            const q = query(
                collection(firestore, 'conversations'),
                where('participants', 'array-contains', userId),
                where('theme', '==', 'offer'),
                where('offerId', '==', offerId),
            );

            const snapshot = await getDocs(q);
            for (const docSnap of snapshot.docs) {
                const data = docSnap.data();
                if (data.participants.includes(receiverId)) return docSnap.id;
            }

            const newChat = await addDoc(collection(firestore, 'conversations'), {
                participants: [userId, receiverId],
                offerId,
                theme: 'offer',
                createdAt: serverTimestamp(),
                isBlocked: false,
                lastMessage: '',
                unreadCounts: {
                    [userId]: 0,
                    [receiverId]: 0,
                },
            });

            return newChat.id;
        } catch (e) {
            console.error('getOrCreateConversation error:', e);
            return null;
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (!converId || !entityId) return;

            const docRef = doc(firestore, 'conversations', converId);

            const fetchAndListen = async () => {
                const snap = await getDoc(docRef);
                const data = snap.data();
                setIsBlocked(data?.isBlocked || false);

                const batch = writeBatch(firestore);
                batch.update(docRef, {
                    [`unreadCounts.${entityId}`]: 0,
                });
                await batch.commit();

                const msgRef = collection(firestore, 'conversations', converId, 'messages');
                const q = query(msgRef, orderBy('timestamp', 'asc'));

                const unsubscribe = onSnapshot(q, snapshot => {
                    const messages: MessageItem[] = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as MessageItem[];

                    setChatMessages(messages);
                });

                return () => unsubscribe();
            };

            fetchAndListen();
        }, [converId, entityId])
    );

    useEffect(() => {
        if (chatMessages.length && flatListRef.current) {
            flatListRef.current.scrollToEnd({animated: true});
        }
    }, [chatMessages]);

    const renderMessage = ({item}: {item: MessageItem}) => <Message item={item} />;

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.white}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                <View style={styles.header}>
                    <GoBackButton />
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{paddingTop: 30}}>
                        <Icon name="dots-horizontal" size={24} color={colors.primaryBlack} />
                    </TouchableOpacity>
                </View>

                <AvatarSection avatar={avatar} senderName={senderName} />

                {typeOffer !== 'Multi-fight contract' && (
                    <OfferRelatedSection offer={offer} typeOffer={typeOffer} />
                )}

                <FlatList
                    ref={flatListRef}
                    data={chatMessages}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messageList}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />

                <SendMessage
                    converId={converId}
                    isBlocked={isBlocked}
                    receiverUserId={receiverUserId}
                    typeOffer={typeOffer}
                    offer={offer}
                />

                {converId && (
                    <MessageOption
                        conversationId={[converId]}
                        isModalVisible={isModalVisible}
                        setModalVisible={setModalVisible}
                        senderName={senderName}
                        receiverId={[receiverUserId]}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

export default OpenChatPublicOfferScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    messageList: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
});
