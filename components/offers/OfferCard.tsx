import React, {useCallback} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import {MaterialCommunityIcons, MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {Image} from "expo-image";
import {PublicOfferInfo} from "@/service/response";
import {useAuth} from "@/context/AuthContext";
import colors from "@/styles/colors";
import {getCurrencySymbol} from "@/utils/utils";
import {useRouter} from "expo-router";


interface OfferCardProps {
    item: PublicOfferInfo;
    isFavorite?: boolean;
    removeFavorite?: (offer: PublicOfferInfo) => void;
    horizontal?: boolean;
    onClick?: (offerId:string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
                                                        item,
                                                        isFavorite,
                                                        removeFavorite,
                                                        horizontal,
                                                        onClick,
                                                    }) => {

    const {role} = useAuth();
    const screenWidth = Dimensions.get('window').width;
    const CARD_WIDTH = screenWidth - 30 * 2; // 38 зліва та 38 справа
    const setWidth = React.useMemo(() => {
        return horizontal ? {width: CARD_WIDTH, marginRight: 13} : {};
    }, [CARD_WIDTH, horizontal]);
    const router = useRouter();
    const handleOfferDetail = useCallback(() => {
        if (onClick) {
            onClick(item.offerId);
            return;
        } else {
            router.push(`/offers/public/${item.offerId}`)
        }
    }, [item.offerId, role]);

    return (
        <TouchableOpacity
            onPress={handleOfferDetail}
            style={[
                styles.eventCard,
                setWidth,
                item.closedReason &&
                item.closedReason.trim().length > 0 &&
                styles.inactiveOffer,
            ]}>
            {isFavorite && (
                <TouchableOpacity
                    onPress={() => removeFavorite?.(item)}
                    style={styles.favoriteIcon}>
                    <Icon
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isFavorite ? colors.darkError : colors.gray}
                    />
                </TouchableOpacity>
            )}

            {(item.isOfferFeatured&&!isFavorite) && (
                <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>Featured</Text>
                </View>
            )}

            <Image
                source={{uri: item.eventImageLink}}
                style={styles.eventImage}
            />

            <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{item.eventName}</Text>
                <Text style={styles.eventDetail}>
                    <Text style={styles.eventLabel}>Opponent: </Text>
                    {item.opponentName}
                </Text>
                {role === 'PROMOTION' ? (
                    item.gender && (
                        <Text style={styles.eventDetail}>
                            <Text style={styles.eventLabel}>Gender: </Text>
                            {item.gender}
                        </Text>
                    )
                ) : (
                    <Text style={styles.eventDetail}>
                        <Text style={styles.eventLabel}>Promotion: </Text>
                        {item.promotionName}
                    </Text>
                )}
                <Text style={styles.eventDetail}>
                    <Text style={styles.eventLabel}>Weight Class: </Text>
                    {item.weightClass}
                </Text>
                <Text style={styles.eventDetail}>
                    <Text style={styles.eventLabel}>Based In: </Text>
                    {item.country}
                </Text>
                {item.purse && (
                    <Text style={styles.eventDetail}>
                        <Text style={styles.eventLabel}>Purse: </Text>
                        {item.purse?.includes('-')
                            ? `${getCurrencySymbol(item.currency)}${item.purse
                                .split('-')[0]
                                ?.trim()} - ${getCurrencySymbol(item.currency)}${item.purse
                                .split('-')[1]
                                ?.trim()}`
                            : getCurrencySymbol(item.currency) + item.purse}
                    </Text>
                )}
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
                        Closed with reason: {item.closedReason || 'Offer is closed'}
                    </Text>
                </View>
            )}
            <Icon
                name="chevron-right"
                size={24}
                color={colors.gray}
                style={styles.iconStyle}
            />

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
        backgroundColor: colors.gray,
    },
    eventDetails: {
        flex: 1,
        paddingVertical: 8,
        justifyContent: 'flex-start',
    },
    eventTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.primaryGreen,
        marginBottom: 3,
    },
    eventDetail: {
        fontSize: 10,
        color: colors.primaryBlack,
        marginBottom: 2,
    },
    eventLabel: {
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    iconStyle: {
        position: 'absolute',
        right: 0,
    },
    favoriteIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 5,
    },
    featuredBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FFD700',
        paddingVertical: 4,
        paddingHorizontal: 15,
        borderTopRightRadius: 10,
        zIndex: 10,
    },
    featuredBadgeText: {
        color: '#000',
        fontSize: 8,
        fontWeight: '500',
    },
    closedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        zIndex: 10,
    },
    closedOverlayText: {
        color: colors.darkError,
        zIndex: 11,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
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
