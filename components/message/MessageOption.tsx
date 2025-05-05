import React, {useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import MarkUnread from '@/assets/message/unread.svg';
import Blocked from '@/assets/message/blocked.svg';
import Delete from '@/assets/message/delete.svg';
import colors from '@/styles/colors';
import {useAuth} from '@/context/AuthContext';
import {collection, doc, getDoc, getDocs, writeBatch,} from 'firebase/firestore';
import {firestore} from '@/firebase/firebase';

interface MessageOptionProps {
    conversationId: string[];
    isModalVisible: boolean;
    setModalVisible: (arg0: boolean) => void;
    senderName: string;
    receiverId: string[];
}

const MessageOption = ({
                           conversationId,
                           isModalVisible,
                           setModalVisible,
                           senderName,
                           receiverId,
                       }: MessageOptionProps) => {
    const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
    const { role } = useAuth();

    useEffect(() => {
        if (conversationId.length === 0) return;

        const fetchBlockStatus = async () => {
            try {
                const ref = doc(firestore, 'conversations', conversationId[0]);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setIsBlocked(snap.data()?.isBlocked || false);
                }
            } catch (error) {
                console.error('Error fetching block status:', error);
            }
        };

        if (isModalVisible) {
            fetchBlockStatus();
        }
    }, [isModalVisible, conversationId]);

    const toggleBlockUser = async () => {
        try {
            const batch = writeBatch(firestore);
            conversationId.forEach(id => {
                const ref = doc(firestore, 'conversations', id);
                batch.update(ref, { isBlocked: !isBlocked });
            });
            await batch.commit();
            setIsBlocked(prev => !prev);
            setModalVisible(false);
        } catch (error) {
            console.error('Toggle block error:', error);
            Alert.alert('Error', 'Failed to update block status.');
        }
    };

    const markAsRead = async () => {
        if (!receiverId || conversationId.length === 0) return;

        try {
            const batch = writeBatch(firestore);
            conversationId.forEach(id => {
                const convRef = doc(firestore, 'conversations', id);
                receiverId.forEach(receiver =>
                    batch.update(convRef, { [`unreadCounts.${receiver}`]: 0 }),
                );
            });
            await batch.commit();
            setModalVisible(false);
        } catch (error) {
            console.error('Mark as read error:', error);
            Alert.alert('Error', 'Failed to mark as read.');
        }
    };

    const deleteConversations = () => {
        Alert.alert(
            'Delete',
            'Are you sure you want to delete this conversation?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            for (const id of conversationId) {
                                const convRef = doc(firestore, 'conversations', id);
                                const messagesRef = collection(firestore, 'conversations', id, 'messages');
                                const messagesSnap = await getDocs(messagesRef);

                                const batch = writeBatch(firestore);
                                messagesSnap.forEach(msg => batch.delete(msg.ref));
                                batch.delete(convRef);
                                await batch.commit();
                            }
                            setModalVisible(false);
                        } catch (error) {
                            console.error('Delete error:', error);
                            Alert.alert('Error', 'Failed to delete conversation.');
                        }
                    },
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <Modal visible={isModalVisible} transparent animationType="fade">
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setModalVisible(false)}>
                <View style={styles.optionsModal}>
                    <Text style={styles.recieverTitle}>{senderName}</Text>

                    <TouchableOpacity style={styles.optionItem} onPress={markAsRead}>
                        <MarkUnread color={colors.primaryBlack} />
                        <Text style={styles.optionText}>Mark as Read</Text>
                    </TouchableOpacity>

                    {role === 'PROMOTION' && (
                        <TouchableOpacity style={styles.optionItem} onPress={toggleBlockUser}>
                            <Blocked />
                            <Text style={styles.optionText}>
                                {isBlocked ? 'Open chat' : 'Temporarily close chat'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.optionItem} onPress={deleteConversations}>
                        <Delete color={colors.darkError} />
                        <Text style={[styles.optionText, { color: colors.darkError }]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default MessageOption;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    optionsModal: {
        backgroundColor: colors.white,
        paddingVertical: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingBottom: 66,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 26,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    optionText: {
        fontSize: 13,
        marginLeft: 22,
        fontWeight: '400',
        fontFamily: 'Roboto',
        lineHeight: 15,
        color: colors.secondaryBlack,
    },
    recieverTitle: {
        paddingHorizontal: 36,
        marginBottom: 16,
        marginTop: 16,
        fontSize: 13,
        fontWeight: '700',
        color: colors.primaryBlack,
    },
});
