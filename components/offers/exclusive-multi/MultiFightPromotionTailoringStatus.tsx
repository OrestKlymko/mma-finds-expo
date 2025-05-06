import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import {MultiContractFullInfo, SubmittedInformationOffer,} from '@/service/response';
import {getCurrencySymbol} from "@/utils/utils";
import {PromotionRequiredDocumentsSection} from "@/components/offers/PromotionRequiredDocumentsSection";
import {useRouter} from "expo-router";
import MultiFightNegotiationOfferComponent
    from "@/components/offers/exclusive-multi/MultiFightNegotiationOfferComponent";

type TailoringStatusProps = {
    submittedInformation?: SubmittedInformationOffer[];
    previousInfo?: SubmittedInformationOffer[];
    offer: MultiContractFullInfo | null | undefined;
    docs: any[];
};

export const MultiFightPromotionTailoringStatus: React.FC<
    TailoringStatusProps
> = ({submittedInformation = [], previousInfo = [], offer, docs}) => {
    const router = useRouter();
    if (submittedInformation.length === 0) return null;

    const first = submittedInformation[0];
    const renderPurseGrid = () => (
        <>
            <Text style={[styles.detailLabel, {marginBottom: 15}]}>Purse</Text>
            <View style={styles.detailsContainer}>
                {[
                    {label: 'Fight Purse', value: first.fightPurse},
                    {label: 'Win Bonus', value: first.winPurse},
                    {label: 'Finish Bonus', value: first.bonusPurse},
                ].map((d, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.detailRow,
                            idx % 2 === 1 ? styles.zebraLight : styles.zebraDark,
                        ]}>
                        <Text style={styles.detailLabel}>{d.label}</Text>
                        <Text style={styles.detailValue}>
                            {getCurrencySymbol(first.currency)}
                            {d.value}
                        </Text>
                    </View>
                ))}
            </View>
        </>
    );

    const renderPurseGridAllFights = () => (
        <>
            {submittedInformation.map((offer, idx) => (
                <View key={offer.fightNumber ?? idx} style={{marginBottom: 20}}>
                    {/* Заголовок з номером бою */}
                    <Text style={[styles.detailLabel, {marginBottom: 15}]}>
                        Fight {offer.fightNumber}
                    </Text>

                    {/* Сама сітка */}
                    <View style={styles.detailsContainer}>
                        {[
                            {label: 'Fight Purse', value: offer.fightPurse},
                            {label: 'Win Bonus', value: offer.winPurse},
                            {label: 'Finish Bonus', value: offer.bonusPurse},
                        ].map((d, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.detailRow,
                                    i % 2 === 1 ? styles.zebraLight : styles.zebraDark,
                                ]}>
                                <Text style={styles.detailLabel}>{d.label}</Text>
                                <Text style={styles.detailValue}>
                                    {getCurrencySymbol(offer.currency)}
                                    {d.value}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </>
    );

    return (
        <>
            {/* PENDING або PROMOTION‐NEGOTIATING */}
            {(first.statusResponded === 'PENDING' ||
                (first.statusResponded === 'NEGOTIATING' &&
                    first.offered === 'PROMOTION')) && (
                <>
                    {renderPurseGridAllFights()}
                    <Text style={styles.detailLabel}>Waiting for confirmation.</Text>
                </>
            )}

            {/* ACCEPTED */}
            {first.statusResponded === 'ACCEPTED' && (
                <>
                    {renderPurseGridAllFights()}
                    <PromotionRequiredDocumentsSection
                        typeOffer={'Multi-fight contract'}
                        documents={docs}
                        dueDate={offer?.dueDateDocument}
                        offerId={offer!.offerId}
                        fighterId={first.fighterId}
                    />
                </>
            )}

            {/* REJECTED */}
            {first.statusResponded === 'REJECTED' && (
                <>
                    {renderPurseGrid()}
                    <Text style={[styles.detailLabel, styles.rejectionLabel]}>
                        Offer was rejected by manager with the reason:
                    </Text>
                    <Text style={styles.detailValue}>{first.rejectionReason}</Text>
                    <TouchableOpacity
                        style={styles.createProfileButton}
                        onPress={() => {
                            router.push({pathname: '/offer/exclusive/create/fighter', params: {type: 'Multi-Fight'}})
                        }}>
                        <Text style={styles.createProfileButtonText}>
                            Choose Another Fighter
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {/* MANAGER‐NEGOTIATING */}
            {first.statusResponded === 'NEGOTIATING' &&
                first.offered === 'MANAGER' && (
                    <MultiFightNegotiationOfferComponent
                        offer={offer}
                        submittedInformation={submittedInformation}
                        previousInformation={previousInfo}
                    />
                )}
        </>
    );
};

const styles = StyleSheet.create({
    fightBlock: {
        marginBottom: 24,
        padding: 12,
        backgroundColor: colors.white,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    fightHeader: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
        color: colors.primaryBlack,
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
    rejectionLabel: {
        marginTop: 20,
        marginBottom: 5,
        color: colors.darkError,
    },
    createProfileButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        height: 56,
        marginTop: 20,
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
