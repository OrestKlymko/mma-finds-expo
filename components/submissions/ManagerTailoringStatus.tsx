import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import {SubmittedInformationPublicOffer} from "@/models/tailoring-model";
import NegotiationOfferComponent from "@/components/offers/NegotiationOfferComponent";
import {getCurrencySymbol} from "@/utils/utils";
import colors from "@/styles/colors";
import {ExclusiveOfferInfo, PublicOfferInfo} from "@/service/response";


type ManagerTailoringStatusProps = {
    submittedInformation?: SubmittedInformationPublicOffer | undefined | null,
    previousInfo?: SubmittedInformationPublicOffer | undefined | null,
    typeOffer: string,
    offer: PublicOfferInfo |ExclusiveOfferInfo | null | undefined
};

export const ManagerTailoringStatus = ({
                                           submittedInformation,
                                           previousInfo,
                                           typeOffer,
                                           offer
                                       }: ManagerTailoringStatusProps) => {
    if (
        (submittedInformation?.statusResponded === 'PENDING' || submittedInformation?.statusResponded === 'NEGOTIATING') &&
        submittedInformation?.offered === 'PROMOTION'
    ) {
        return (
            <NegotiationOfferComponent
                typeOffer={typeOffer}
                submittedInformation={submittedInformation}
                previousInformation={previousInfo}
                offer={offer}
            />
        );
    }
    if (
        submittedInformation?.statusResponded === 'PENDING' ||
        (submittedInformation?.statusResponded === 'NEGOTIATING' &&
            submittedInformation?.offered === 'MANAGER')
    ) {
        return (
            <>
                <Text style={[styles.detailLabel, {marginBottom: 15, marginTop: 15}]}>Purse</Text>
                <View style={styles.detailsContainer}>
                    {[
                        {label: 'Fight Purse', value: submittedInformation?.fightPurse},
                        {label: 'Win Bonus', value: submittedInformation?.winPurse},
                        {label: 'Finish Bonus', value: submittedInformation?.bonusPurse},
                    ].map((detail, index) => (
                        <View
                            key={index}
                            style={[
                                styles.detailRow,
                                index % 2 === 1 ? styles.zebraLight : styles.zebraDark,
                            ]}>
                            <Text style={styles.detailLabel}>{detail.label}</Text>
                            <Text style={styles.detailValue}>
                                {getCurrencySymbol(submittedInformation.currency)}
                                {detail.value}
                            </Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.detailLabel}>Waiting for confirmation.</Text>
            </>
        );
    }

    if (submittedInformation?.statusResponded === 'ACCEPTED') {
        return (
            <>
                <Text style={[styles.detailLabel, {marginBottom: 15}]}>Purse</Text>
                <View style={styles.detailsContainer}>
                    {[
                        {label: 'Fight Purse', value: submittedInformation?.fightPurse},
                        {label: 'Win Bonus', value: submittedInformation?.winPurse},
                        {label: 'Finish Bonus', value: submittedInformation?.bonusPurse},
                    ].map((detail, index) => (
                        <View
                            key={index}
                            style={[
                                styles.detailRow,
                                index % 2 === 1 ? styles.zebraLight : styles.zebraDark,
                            ]}>
                            <Text style={styles.detailLabel}>{detail.label}</Text>
                            <Text style={styles.detailValue}>
                                {getCurrencySymbol(submittedInformation.currency)}
                                {detail.value}
                            </Text>
                        </View>
                    ))}
                </View>
            </>
        );
    }

    if (submittedInformation?.statusResponded === 'REJECTED') {
        return (
            <>
                <Text style={[styles.eventTitle, {color: colors.darkError}]}>
                    Rejected Offer
                </Text>
                <Text style={[styles.detailLabel, {marginBottom: 15}]}>Purse</Text>
                <View style={styles.detailsContainer}>
                    {[
                        {label: 'Fight Purse', value: submittedInformation?.fightPurse},
                        {label: 'Win Bonus', value: submittedInformation?.winPurse},
                        {label: 'Finish Bonus', value: submittedInformation?.bonusPurse},
                    ].map((detail, index) => (
                        <View
                            key={index}
                            style={[
                                styles.detailRow,
                                index % 2 === 1 ? styles.zebraLight : styles.zebraDark,
                            ]}>
                            <Text style={styles.detailLabel}>{detail.label}</Text>
                            <Text style={styles.detailValue}>
                                {getCurrencySymbol(submittedInformation.currency)}
                                {detail.value}
                            </Text>
                        </View>
                    ))}
                    <Text
                        style={[
                            styles.detailLabel,
                            {marginBottom: 5, marginTop: 20, color: colors.darkError},
                        ]}>
                        Rejection Reason:
                    </Text>
                    <Text>{submittedInformation?.rejectionReason}</Text>
                </View>
            </>
        );
    }

    return null;
};
const styles = StyleSheet.create({
    detailsContainer: {
        borderRadius: 8,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    zebraLight: {
        backgroundColor: colors.white,
    },
    zebraDark: {
        backgroundColor: colors.lightGray,
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    detailValue: {
        fontSize: 12,
        color: colors.primaryBlack,
    },
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 24,
        marginTop: 10,
        color: colors.primaryGreen,
        position: 'relative',
    },
});
