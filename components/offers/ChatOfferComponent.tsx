import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {useRouter} from "expo-router";

interface ChatOfferComponentProps {
    offer?: any;
    receiverUserId: string;
    senderName: string;
    avatar: string | null | undefined;
    typeOffer: string;
}

export const ChatOfferComponent = ({
                                       offer,
                                       receiverUserId,
                                       senderName,
                                       avatar,
                                       typeOffer,
                                   }: ChatOfferComponentProps) => {

    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => {
                router.push({
                    pathname: '/messages/offer', params: {
                        offer: offer,
                        receiverUserId: receiverUserId,
                        senderName: senderName,
                        avatar: avatar ?? '',
                        typeOffer,
                    }
                })
            }}>
            <Text style={styles.ctaButtonText}>Chat</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    ctaButton: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
        marginBottom: 16,
    },
    ctaButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});
