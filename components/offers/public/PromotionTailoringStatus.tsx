import {StyleSheet, Text, View} from 'react-native';
import colors from '@/styles/colors';
import React from 'react';
import {PublicOfferInfo, SubmittedInformationOffer} from '@/service/response';
import {getCurrencySymbol} from "@/utils/utils";
import NegotiationOfferComponent from "@/components/offers/NegotiationOfferComponent";
import {PromotionRequiredDocumentsSection} from "@/components/offers/PromotionRequiredDocumentsSection";

type TailoringStatusProps = {
    submittedInformation?: SubmittedInformationOffer;
    offer: PublicOfferInfo;
    previousInfo?: SubmittedInformationOffer;
    docs: any[];
};

export const PromotionTailoringStatus = ({
                                             submittedInformation,
                                             offer,
                                             previousInfo,
                                             docs,
                                         }: TailoringStatusProps) => {
    if (
        submittedInformation?.statusResponded === 'PENDING' ||
        (submittedInformation?.statusResponded === 'NEGOTIATING' &&
            submittedInformation?.offered === 'PROMOTION')
    ) {
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
                                {getCurrencySymbol(submittedInformation?.currency)}
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
                                {getCurrencySymbol(submittedInformation?.currency)}
                                {detail.value}
                            </Text>
                        </View>
                    ))}
                    <PromotionRequiredDocumentsSection
                        typeOffer={'Public'}
                        documents={docs}
                        dueDate={offer?.dueDateForDocument}
                        offerId={offer.offerId}
                        fighterId={submittedInformation?.fighterId}
                    />
                </View>
            </>
        );
    }

    if (submittedInformation?.statusResponded === 'REJECTED') {
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
                                {getCurrencySymbol(submittedInformation?.currency)}
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

    if (
        submittedInformation?.statusResponded === 'NEGOTIATING' &&
        submittedInformation?.offered === 'MANAGER'
    ) {
        return (
            <NegotiationOfferComponent
                offer={offer}
                submittedInformation={submittedInformation}
                previousInformation={previousInfo}
                typeOffer={'Public'}
            />
        );
    }

    return null;
};

const styles = StyleSheet.create({
    detailLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    detailValue: {
        fontSize: 12,
        color: colors.primaryBlack,
    },
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
});
