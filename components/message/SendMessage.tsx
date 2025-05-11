import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Animated, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {collection, doc, runTransaction, serverTimestamp,} from 'firebase/firestore';
import {firestore, storage} from '@/firebase/firebase';
import colors from '@/styles/colors';
import {useAuth} from '@/context/AuthContext';
import {sendNotification, sendNotificationOffer} from '@/service/service';
import {OfferType, SendNotificationRequest} from '@/service/request';
import {MessageItem} from "@/models/model";

type SendMessageProps = {
    converId: string | null;
    isBlocked: boolean;
    receiverUserId: string;
    typeOffer?: OfferType;
    offer?: any;
};

export const SendMessage = ({
                                converId,
                                isBlocked,
                                receiverUserId,
                                typeOffer,
                                offer,
                            }: SendMessageProps) => {
    const [loadingAttachment, setLoadingAttachment] = useState(false);
    const { entityId, role } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [inputText, setInputText] = useState('');

    const handleAttachFile = async () => {
        setLoadingAttachment(true);
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
            if (result.canceled || !result.assets?.length) return;

            const file = result.assets[0];
            const response = await fetch(file.uri);
            const blob = await response.blob();

            const fileRef = ref(storage, `chat_attachments/${file.name}`);
            await uploadBytes(fileRef, blob);
            const url = await getDownloadURL(fileRef);

            await sendAttachmentMessage(url, 'file', file.name);
        } catch (err) {
            console.error('File upload error:', err);
            Alert.alert('Error', 'Failed to upload file');
        } finally {
            setLoadingAttachment(false);
        }
    };

    const sendAttachmentMessage = async (
        downloadUrl: string,
        type: 'file' | 'image',
        fileName?: string
    ) => {
        if (!converId || !entityId) return;

        const conversationRef = doc(firestore, 'conversations', converId);
        const messageData: MessageItem = {
            senderId: entityId,
            type,
            message: '',
            attachmentUrl: downloadUrl,
            fileName: fileName || '',
            timestamp: serverTimestamp(),
        };

        try {
            await runTransaction(firestore, async tx => {
                const convSnap = await tx.get(conversationRef);
                if (!convSnap.exists()) throw new Error('Conversation not found');
                const data = convSnap.data()!;
                const otherUserId = data.participants.find((id: string) => id !== entityId)!;
                const currentUnread = data.unreadCounts || {};

                const messagesRef = collection(conversationRef, 'messages');
                const newMessageRef = doc(messagesRef);
                tx.set(newMessageRef, messageData);

                tx.update(conversationRef, {
                    lastMessage: type === 'file' ? '📎 Attachment' : '🖼 Image',
                    lastTimestamp: serverTimestamp(),
                    unreadCounts: {
                        ...currentUnread,
                        [otherUserId]: (currentUnread[otherUserId] || 0) + 1,
                        [entityId]: 0,
                    },
                });
            });
        } catch (err) {
            console.error('sendAttachmentMessage error:', err);
            Alert.alert('Error', 'Failed to send attachment');
        }
    };


    const sendMessage = async () => {
        if (!inputText.trim() || !converId || !entityId) return;

        const conversationRef = doc(firestore, 'conversations', converId);
        const messageData = {
            senderId: entityId,
            message: inputText,
            type: 'text',
            timestamp: serverTimestamp(),
        };

        try {
            await runTransaction(firestore, async tx => {
                // --- ЧИТАННЯ спочатку ---
                const convSnap = await tx.get(conversationRef);
                if (!convSnap.exists()) throw new Error('Conversation not found');
                const data = convSnap.data()!;
                const otherUserId = data.participants.find((id: string) => id !== entityId)!;
                const currentUnread = data.unreadCounts || {};

                // --- ЗАПИСИ далі ---
                const messagesRef = collection(conversationRef, 'messages');
                const newMessageRef = doc(messagesRef);
                tx.set(newMessageRef, messageData);

                tx.update(conversationRef, {
                    lastMessage: inputText,
                    lastTimestamp: serverTimestamp(),
                    isBlocked: false,
                    unreadCounts: {
                        ...currentUnread,
                        [otherUserId]: (currentUnread[otherUserId] || 0) + 1,
                        [entityId]: 0,
                    },
                });
            });

            // Після успішної транзакції
            sendPushNotification(inputText);
            setInputText('');
        } catch (err: any) {
            console.error('Send message error:', err);
            Alert.alert('Error', err.message);
        }
    };


    const sendPushNotification = async (body: string) => {
        if (offer) {
            const data: SendNotificationRequest = {
                receiverId: receiverUserId,
                text: body,
                role: role === 'MANAGER' ? 'PROMOTION' : 'MANAGER',
            };
            await sendNotification(data);
        } else {
            const data: SendNotificationRequest = {
                receiverId: receiverUserId,
                text: body,
                typeOffer,
                offerId: offer.offerId || offer.id,
            };
            await sendNotificationOffer(data);
        }
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return isBlocked && role === 'MANAGER' ? (
        <View style={styles.blockedContainer}>
            <Text style={styles.blockedText}>
                The promotion has temporarily paused the conversation.
            </Text>
        </View>
    ) : (
        <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
                onPress={handleAttachFile}
                style={{ marginRight: 8 }}
                disabled={loadingAttachment}>
                {loadingAttachment ? (
                    <ActivityIndicator size={24} color={colors.primaryGreen} />
                ) : (
                    <Icon name="paperclip" size={24} color={colors.primaryGreen} />
                )}
            </TouchableOpacity>

            <TextInput
                placeholder="Type something..."
                style={[styles.input, { flex: 1, textAlignVertical: 'top' }]}
                value={inputText}
                onChangeText={setInputText}
                multiline
            />

            <TouchableOpacity onPress={sendMessage}>
                <Icon name="send" size={24} color={colors.primaryGreen} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    blockedContainer: {
        margin: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blockedText: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: colors.lightGray,
        borderRadius: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 8,
    },
});
