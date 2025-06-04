import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import React from 'react';
import colors from '@/styles/colors';
import {countDaysForAcceptance} from "@/utils/utils";
import {publishPrivateOffer} from "@/service/service";
import {ExclusiveOfferInfo, PublicOfferInfo} from "@/service/response";
import {useRouter} from "expo-router";
import {ShareOffer} from "@/components/offers/public/ShareOffer";
import {OfferTypeEnum} from "@/models/model";
import {useAuth} from "@/context/AuthContext";

type Props = {
    offer: any,
    offerType?: OfferTypeEnum
};

export const ExclusiveOfferState = ({offer, offerType}: Props) => {
    const {role} = useAuth();
    const router = useRouter();
    const publishOffer = () => {
        Alert.alert("Show your offer to the world!", "Are you sure you want to publish this offer?",
            [
                {
                    text: "Cancel",
                    style: "destructive"
                },
                {
                    text: "Publish",
                    isPreferred: true,
                    onPress: async () => {
                        if (!offer?.offerId) {
                            Alert.alert("Error", "Offer ID is missing. Cannot publish the offer.");
                            return;
                        }
                        await publishPrivateOffer(offer?.offerId)
                        Alert.alert("Offer published", "Your offer is now visible to the world.");
                        router.back();
                    }
                }
            ])

    }
    const renderPrivateOfferManageState = () => {
        return (offer?.showToAllManagers === false) ? <View style={styles.button}>
            <TouchableOpacity onPress={publishOffer}>
                <Text style={styles.buttonText}>Publish Offer</Text>
            </TouchableOpacity>
        </View> : (
            <View style={styles.summaryRowCentered}>
                <Text style={styles.summaryLabel}>Offer already published</Text>
            </View>
        )
    }

    return (
        <>
            <View style={styles.eventSummaryContainer}>
                {(offerType===OfferTypeEnum.PRIVATE && (role !== 'MANAGER' && role !== 'ANONYMOUS')) &&
                    <ShareOffer offer={offer} typeOffer={OfferTypeEnum.PRIVATE}/>}
                <View style={styles.summaryRowCentered}>
                    <Text style={styles.summaryLabel}>Time left to apply:</Text>
                    <Text style={styles.summaryValue}>
                        {' '}
                        {offer?.closedReason && offer?.closedReason !== ''
                            ? 'Closed'
                            : countDaysForAcceptance(offer?.dueDate) === 0
                                ? 'Today'
                                : countDaysForAcceptance(offer?.dueDate) + ' Days'}
                    </Text>
                </View>
                {((role !== 'MANAGER' && role !== 'ANONYMOUS')&&(role!=null)) && renderPrivateOfferManageState()}
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    eventSummaryContainer: {
        borderRadius: 8,
        alignItems: 'center',
    },
    summaryRowCentered: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 4,
        paddingVertical: 12,
        justifyContent: 'center',
        width: '100%',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        fontWeight: '500',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.primaryBlack,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.primaryBlack,
    },
    button: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
        width: '100%',
        color: colors.white,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
        paddingVertical: 4,
    },
});
