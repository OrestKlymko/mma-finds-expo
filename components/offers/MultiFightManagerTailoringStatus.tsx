import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import colors from '@/styles/colors';
import {
    MultiContractFullInfo,
    SubmittedInformationOffer,
} from '@/service/response';
import {getCurrencySymbol} from "@/utils/utils";
import {DocumentTailoring} from "@/components/DocumentTailoring";
import {ChooseAnotherFighterButton} from "@/components/offers/exclusive-multi/ChooseAnotherFighterButton";
import MultiFightNegotiationOfferComponent
    from "@/components/offers/exclusive-multi/MultiFightNegotiationOfferComponent";
import {useAuth} from "@/context/AuthContext";


type TailoringStatusProps = {
    submittedInformation?: SubmittedInformationOffer[];
    previousInfo?: SubmittedInformationOffer[];
    offer: MultiContractFullInfo | null | undefined;
};

export const MultiFightManagerTailoringStatus: React.FC<
    TailoringStatusProps
> = ({submittedInformation = [], previousInfo = [], offer}) => {

    if (submittedInformation.length === 0) return null;
    const {role} = useAuth();
    const first = submittedInformation[0];

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
                    first.statusResponded === 'NEGOTIATING') &&
                first.offered === role && (
                    <>
                        {renderPurseGridAllFights()}
                        <Text style={styles.detailLabel}>Waiting for confirmation.</Text>
                    </>
                )}

            {/* ACCEPTED */}
            {first.statusResponded === 'ACCEPTED' && (
                <>
                    {renderPurseGridAllFights()}
                    <DocumentTailoring kind="multi" offer={offer}/>
                </>
            )}

            {/* REJECTED */}
            {first.statusResponded === 'REJECTED' && (
                <>
                    {renderPurseGridAllFights()}
                    <Text style={[styles.detailLabel, styles.rejectionLabel]}>
                        Offer was rejected with the reason:
                    </Text>
                    <Text style={styles.detailValue}>{first.rejectionReason}</Text>
                    {offer && <ChooseAnotherFighterButton type={'Multi-Fight'} offerId={offer?.offerId}/>}
                </>
            )}

            {/* MANAGER‐NEGOTIATING */}
            {(first.statusResponded === 'NEGOTIATING' || first.statusResponded === 'PENDING') &&
                first.offered === 'PROMOTION' && (
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
});
