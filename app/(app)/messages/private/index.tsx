import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {
    addDoc,
    collection,
    doc,
    getDocs,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from '@/context/AuthContext';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {app} from '@/firebase/firebase';
import {MessageItem} from "@/models/model";
import {Message} from "@/components/message/Message";
import {AvatarSection} from "@/components/message/AvatarSection";
import {SendMessage} from "@/components/message/SendMessage";
import MessageOption from "@/components/message/MessageOption";
import {useFocusEffect, useLocalSearchParams} from "expo-router";

const firestore = getFirestore(app);

const OpenChatScreen = () => {
    const {entityId} = useAuth();
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();

    const [isModalVisible, setModalVisible] = useState(false);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [converId, setConverId] = useState<string | null>(null);
    const [isBlocked, setIsBlocked] = useState(false);

    const {receiverUserId,senderName, avatar} = useLocalSearchParams<{
        receiverUserId: string;
        senderName: string;
        avatar: string;
    }>();

    useEffect(() => {
        const findOrCreateChat = async () => {
            if (receiverUserId && entityId) {
                const chatId = await getOrCreateConversation(entityId, receiverUserId);
                setConverId(chatId);
            }
        };
        findOrCreateChat();
    }, [receiverUserId, entityId]);

    const getOrCreateConversation = async (userId: string, receiverId: string) => {
        const q = query(
            collection(firestore, 'conversations'),
            where('participants', 'array-contains', userId),
            where('theme', '==', 'private')
        );
        const snapshot = await getDocs(q);
        let existingId: string | null = null;

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (data.participants.includes(receiverId)) {
                existingId = docSnap.id;
            }
        });

        if (existingId) return existingId;

        const newDocRef = await addDoc(collection(firestore, 'conversations'), {
            participants: [userId, receiverId],
            theme: 'private',
            createdAt: new Date(),
            lastMessage: '',
            unreadCounts: {
                [userId]: 0,
                [receiverId]: 0,
            },
        });

        return newDocRef.id;
    };

    useFocusEffect(
        useCallback(() => {
            if (!converId || !entityId) return;

            const docRef = doc(firestore, 'conversations', converId);

            const unsubscribe = onSnapshot(docRef, async snap => {
                const data = snap.data();
                if (!data) return;
                setIsBlocked(data.isBlocked || false);

                await updateDoc(docRef, {
                    [`unreadCounts.${entityId}`]: 0,
                });
            });

            const messagesRef = collection(firestore, 'conversations', converId, 'messages');
            const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
            const unsubMessages = onSnapshot(messagesQuery, snapshot => {
                const messages = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setChatMessages(messages);
            });

            return () => {
                unsubscribe();
                unsubMessages();
            };
        }, [converId, entityId])
    );

    useEffect(() => {
        if (chatMessages.length > 0 && flatListRef.current) {
            flatListRef.current.scrollToEnd({animated: true});
        }
    }, [chatMessages]);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const renderMessage = ({item}: { item: MessageItem }) => <Message item={item}/>;

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.white}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                <View style={styles.header}>
                    <GoBackButton/>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={{paddingTop: 30}}>
                        <Icon name="dots-horizontal" size={24} color={colors.primaryBlack}/>
                    </TouchableOpacity>
                </View>

                <AvatarSection avatar={avatar} senderName={senderName}/>

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ref={flatListRef}
                    data={chatMessages}
                    keyExtractor={item => item.timestamp}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messageList}
                    keyboardShouldPersistTaps="handled"
                />

                <SendMessage
                    converId={converId}
                    isBlocked={isBlocked}
                    receiverUserId={receiverUserId}
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

export default OpenChatScreen;

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
