 import React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '@/styles/colors';
import {MultiContractFullInfo, SubmittedInformationOffer,} from '@/service/response';
import {PromotionRequiredDocumentsSection} from "@/components/offers/PromotionRequiredDocumentsSection";
import {useRouter} from "expo-router";
import MultiFightNegotiationOfferComponent
    from "@/components/offers/exclusive-multi/MultiFightNegotiationOfferComponent";
 import {MultiFightPurseGrid} from "@/components/offers/exclusive-multi/MultiFightPurseGrid";

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



    return (
        <>
            {/* PENDING або PROMOTION‐NEGOTIATING */}
            {(first.statusResponded === 'PENDING' ||
                (first.statusResponded === 'NEGOTIATING' &&
                    first.offered === 'PROMOTION')) && (
                <>
                    <MultiFightPurseGrid submittedInformation={submittedInformation}/>
                    <Text style={styles.detailLabel}>Waiting for confirmation.</Text>
                </>
            )}

            {/* ACCEPTED */}
            {first.statusResponded === 'ACCEPTED' && (
                <>
                    <MultiFightPurseGrid submittedInformation={submittedInformation}/>
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
                    <MultiFightPurseGrid submittedInformation={submittedInformation}/>
                    <Text style={[styles.detailLabel, styles.rejectionLabel]}>
                        Offer was rejected with the reason:
                    </Text>
                    <Text style={styles.detailValue}>{first.rejectionReason}</Text>
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
