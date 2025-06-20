import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {FighterInfoResponse} from '@/service/response';
import {useRouter} from "expo-router";

type FighterManageButtonProps = {
    fighterId: string;
    fighter?: FighterInfoResponse | null;
};

export const FighterManageButtonWithSendExclusiveOffer = ({
                                        fighterId,
                                        fighter,
                                    }: FighterManageButtonProps) => {
    const router = useRouter();
    return (
        <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                    router.push({pathname: '/offer/exclusive/create', params: {fighterId: fighterId}})
                }}>
                <Text style={styles.selectButtonText}>Send Private Offer</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.contactButton}
                onPress={() => {
                    router.push({
                        pathname: '/messages/private', params: {
                            receiverUserId: fighter?.managerId,
                            avatar: fighter?.managerImageLink,
                            senderName: fighter?.managerName,
                        }
                    })
                }}>
                <Text style={styles.contactButtonText}>Contact Manager</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    selectButton: {
        flex: 1,
        backgroundColor: colors.primaryGreen,
        paddingVertical: 17,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
        height: 56,
        justifyContent: 'center',
    },
    selectButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        fontFamily: 'Roboto',
    },
    contactButton: {
        flex: 1,
        backgroundColor: colors.lightGray,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    contactButtonText: {
        color: colors.primaryBlack,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        fontFamily: 'Roboto',
    },
});
