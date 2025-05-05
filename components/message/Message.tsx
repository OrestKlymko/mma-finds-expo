import {ActivityIndicator, Alert, Linking, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import React from 'react';
import {useAuth} from '@/context/AuthContext';
import colors from '@/styles/colors';
import {MessageItem} from "@/models/model";

type MessageProps = {
    item: MessageItem;
};

export const Message = ({item}: MessageProps) => {
    const {entityId} = useAuth();
    const [loadingDownload, setLoadingDownload] = React.useState(false);
    const isMyMessage = item.senderId === entityId;
    const convertTime = (item: any) => {
        if (!item || !item.timestamp) return '';
        const time = new Date(item.timestamp.toDate());
        const minutes =
            time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
        return `${time.getHours()}:${minutes}`;
    };

    const downloadAndSaveFile = async (url: string, filename: string) => {
        setLoadingDownload(true);
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Cannot open this file link');
            }
        } catch (error) {
            console.error('Error opening file:', error);
            Alert.alert('Error', 'Failed to open file.');
        } finally {
            setLoadingDownload(false);
        }
    };

    if (item.type === 'file') {
        return (
            <View style={styles.messageWrapper}>
                <View
                    style={[
                        styles.messageBubble,
                        isMyMessage ? styles.senderBubble : styles.receiverBubble,
                    ]}>
                    <TouchableOpacity
                        disabled={loadingDownload}
                        onPress={async () => {
                            if (item.attachmentUrl) {
                                await downloadAndSaveFile(
                                    item.attachmentUrl,
                                    item?.fileName || 'Attachment',
                                );
                            }
                        }}>
                        {loadingDownload ? (
                            <ActivityIndicator size="small" color={colors.primaryGreen} />
                        ) : (
                            <Text style={styles.attachmentText}>
                                📎 {item.fileName || 'Attachment'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
                <Text
                    style={[
                        styles.messageTime,
                        isMyMessage ? styles.timeSender : styles.timeReceiver,
                    ]}>
                    {item.timestamp ? convertTime(item) : ''}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.messageWrapper}>
            <View
                style={[
                    styles.messageBubble,
                    isMyMessage ? styles.senderBubble : styles.receiverBubble,
                ]}>
                <Text style={styles.messageText}>{item.message}</Text>
            </View>
            <Text
                style={[
                    styles.messageTime,
                    isMyMessage ? styles.timeSender : styles.timeReceiver,
                ]}>
                {item.timestamp ? convertTime(item) : ''}
            </Text>
        </View>
    );
};
const styles = StyleSheet.create({
    messageWrapper: {
        marginBottom: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
    },
    senderBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#CCCBCB',
    },
    receiverBubble: {
        alignSelf: 'flex-start',
        backgroundColor: colors.lightGray,
    },
    messageText: {
        color: colors.primaryBlack,
        fontSize: 11,
        fontWeight: '400',
        lineHeight: 19,
    },
    messageTime: {
        fontSize: 11,
        color: colors.gray,
        textAlign: 'right',
    },
    timeSender: {
        alignSelf: 'flex-end',
        marginRight: 10,
        fontWeight: '300',
        fontSize: 12,
        color: '#929AA1',
    },
    timeReceiver: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        fontWeight: '300',
        fontSize: 12,
        color: '#929AA1',
    },
    attachmentText: {
        color: colors.primaryBlack,
        fontSize: 12,
    },
});
