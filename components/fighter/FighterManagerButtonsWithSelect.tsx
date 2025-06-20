import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import React from 'react';
import {FighterInfoResponse} from '@/service/response';
import {useRouter} from "expo-router";
import {OfferTypeEnum} from "@/models/model";
import {chooseFighterForExclusiveOffer} from "@/service/service";

type FighterManagerButtonsProps = {
    fighter?: FighterInfoResponse | undefined | null,
    offerId?: string | null,
    fighterId?: string,
    currency?: string,
    eligibleToSelect?: boolean | null,
    offerType?: OfferTypeEnum | null | undefined
};

export const FighterManagerButtonsWithSelect = ({
                                                    fighter,
                                                    offerId,
                                                    fighterId,
                                                    currency,
                                                    eligibleToSelect,
                                                    offerType
                                                }: FighterManagerButtonsProps) => {
    const router = useRouter();
    const handleSelectFighter = async () => {
        if (!eligibleToSelect) {
            Alert.alert(
                'You cannot select this fighter',
                'Please extend the due date of the offer.',
            );
            return;
        }
        if (offerType === OfferTypeEnum.PRIVATE) {
            if (!offerId || !fighterId) {
                Alert.alert("Error", "Offer ID or Fighter ID is missing. Cannot proceed with the selection.");
                return;
            }
            await chooseFighterForExclusiveOffer(fighterId, offerId);
            Alert.alert("Private Offer Sent", "Please wait until the fighter accepts your offer.");
            router.back();
            return;
        }
        router.push({
            pathname: `/offer/public/${offerId}/send-price`, params: {
                fighterId: fighterId,
                currency: currency,
            }
        });
    };

    return (
        <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectFighter}>
                <Text style={styles.selectButtonText}>Select Fighter</Text>
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
