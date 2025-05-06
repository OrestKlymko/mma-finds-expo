import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import React from 'react';
import {ExclusiveOfferInfo, SubmittedInformationOffer} from '@/service/response';
import colors from '@/styles/colors';
import {PromotionRequiredDocumentsSection} from '../PromotionRequiredDocumentsSection';
import NegotiationOfferComponent from '../NegotiationOfferComponent';
import {getCurrencySymbol} from "@/utils/utils";
import {useRouter} from "expo-router";

type TailoringStatusProps = {
    submittedInformation?: SubmittedInformationOffer;
    offer: ExclusiveOfferInfo;
    previousInfo?: SubmittedInformationOffer;
    docs: any[];
};

export const ExclusivePromotionTailoringStatus = ({
                                                      submittedInformation,
                                                      offer,
                                                      previousInfo,
                                                      docs,
                                                  }: TailoringStatusProps) => {
    const router = useRouter();
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
                        typeOffer={'Exclusive'}
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
                    <TouchableOpacity
                        style={styles.createProfileButton}
                        onPress={() => {
                            router.push({pathname: '/offer/exclusive/create/fighter', params: {type:'Exclusive'}})
                        }}>
                        <Text style={styles.createProfileButtonText}>
                            Choose Another Fighter
                        </Text>
                    </TouchableOpacity>
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
                submittedInformation={submittedInformation}
                previousInformation={previousInfo}
                typeOffer={'Exclusive'}
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
    createProfileButton: {
        marginTop: 16,
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },
    createProfileButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
        paddingVertical: 4,
    },
});
