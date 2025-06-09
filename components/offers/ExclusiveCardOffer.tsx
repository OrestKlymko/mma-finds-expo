import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons, MaterialIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';

import {Image} from "expo-image";
import {countDaysForAcceptance} from "@/utils/utils";
import {useRouter} from "expo-router";

interface ExclusiveCardOfferProps {
    item: {
        offerId: string;
        typeOffer: 'PRIVATE' | 'MULTI';
        isFightTitled?: boolean;
        eventImageLink: string;
        eventName?: string;
        fighterName: string;
        fighterNickName: string;
        opponentName: string;
        dueDate: string;
        promotionAvatar?: string;
        contractStartDate?: string;
        contractEndDate?: string;
        numberOfFights?: number;
        closedReason?: string | null;

        verifiedState?: string; // 'NONE' | 'PENDING' | 'VERIFIED'
    };
}

export const ExclusiveCardOffer: React.FC<ExclusiveCardOfferProps> = ({
                                                                          item,
                                                                      }) => {
    const router = useRouter();
    const handlePress = useCallback(() => {
        if (item.verifiedState === 'NONE' || item.verifiedState === 'PENDING') {
            router.push('/profile/settings/account/account-info/verification')
        } else {
            if (item.typeOffer === 'PRIVATE') {
                router.push(`/offers/private/${item.offerId}`)
            } else {
                router.push(`/offer/exclusive/multi/${item.offerId}`)
            }
        }
    }, [item.offerId, item.typeOffer, item.verifiedState]);

    return (
        <TouchableOpacity
            key={item.offerId}
            style={[
                styles.eventCard,
                ((item.verifiedState === 'NONE' || item.verifiedState === 'PENDING') || item.closedReason) &&
                styles.inactiveOffer,
            ]}
            onPress={handlePress}>
            <Image
                source={{uri: item.eventImageLink || item.promotionAvatar}}
                style={styles.eventImage}
            />

            <View style={styles.eventDetails}>
                {item.typeOffer === 'PRIVATE' && (
                    <Text style={styles.eventTitle}>{item.eventName}</Text>
                )}

                <Text style={styles.eventDetail}>
                    <Text style={styles.eventLabel}>Offer Type: </Text>
                    <Text style={styles.eventValue}>
                        {item.typeOffer === 'MULTI'
                            ? 'Multi-Fight Contract'
                            : 'Private Offer'}
                    </Text>
                </Text>

                <Text style={styles.eventDetail}>
                    <Text style={styles.eventLabel}>Fighter: </Text>
                    <Text style={styles.eventValue}>
                        {item.fighterName || 'No fighter chosen yet'}
                    </Text>
                </Text>

                {item.opponentName && (
                    <Text style={styles.eventDetail}>
                        <Text style={styles.eventLabel}>Opponent: </Text>
                        <Text style={styles.eventValue}>{item.opponentName}</Text>
                    </Text>
                )}

                <Text style={styles.eventDetail}>
                    <Text style={styles.eventLabel}>Time left for acceptance: </Text>
                    <Text style={[styles.eventLabel, {fontWeight: '400'}]}>
                        {countDaysForAcceptance(item.dueDate)} Days
                    </Text>
                </Text>
            </View>

            {(item.verifiedState === 'NONE' || item.verifiedState === 'PENDING') && (
                <View style={styles.reviewOverlay}>
                    <MaterialCommunityIcons name="account-clock-outline" size={24} color="black"/>
                    <Text style={styles.reviewOverlayText}>
                        Waiting for profile verification.
                    </Text>
                </View>
            )}
            {(item.closedReason) && (
                <View style={styles.reviewOverlay}>
                    <Text style={styles.closedReasonText}>
                        {item.closedReason || 'Offer is closed'}
                    </Text>
                </View>
            )}


            <Icon name="chevron-right" size={24} color={colors.gray}/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    eventCard: {
        backgroundColor: colors.lightGray,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 120,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
    },
    inactiveOffer: {
        opacity: 0.5,
    },
    eventImage: {
        width: 125,
        height: '100%',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        marginRight: 10,
        backgroundColor: colors.primaryGreen,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eventDetails: {
        flex: 1,
        paddingVertical: 8,
        justifyContent: 'flex-start',
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryGreen,
        marginBottom: 6,
    },
    eventDetail: {
        fontSize: 12,
        color: colors.primaryBlack,
        marginBottom: 2,
    },
    eventLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    eventValue: {
        fontSize: 10,
        color: colors.primaryBlack,
    },
    titleFightTag: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.yellow,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopRightRadius: 10,
        zIndex: 1,
    },
    titleFightText: {
        fontSize: 9,
        fontWeight: '500',
    },
    multiContractText: {
        fontSize: 10,
        color: colors.white,
        fontWeight: '600',
    },
    reviewOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    reviewOverlayText: {
        color: colors.primaryGreen,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
    closedReasonText: {
        color: colors.darkError,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
});
