import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import {MultiContractFullInfo, SubmittedInformationOffer} from '@/service/response';
import {acceptMultiFightOffer} from '@/service/service';
import {PurseBlock} from "@/components/offers/public/PurseBlock";
import {useRouter} from "expo-router";

interface MultiFightNegotiationOfferComponentProps {
    submittedInformation?: SubmittedInformationOffer[];
    previousInformation?: SubmittedInformationOffer[];
    offer: MultiContractFullInfo | null | undefined
}

const MultiFightNegotiationOfferComponent = ({
                                                 offer,
                                                 submittedInformation,
                                                 previousInformation,
                                             }: MultiFightNegotiationOfferComponentProps) => {
    const router = useRouter();
    const handleConfirmOffer = () => {
        if (
            !submittedInformation ||
            !submittedInformation[0]?.offerId ||
            !submittedInformation[0]?.fighterId
        ) {
            Alert.alert('Error', 'Invalid offer or fighter ID');
            return;
        }
        acceptMultiFightOffer(submittedInformation[0].offerId, submittedInformation[0].fighterId).then(() => {
            Alert.alert('Success', 'Offer accepted successfully');
            router.push('/(app)/(tabs)')
        })
    };

    const handleRejectOffer = () => {
        if (
            !submittedInformation ||
            !submittedInformation[0]?.offerId ||
            !submittedInformation[0]?.fighterId
        ) {
            Alert.alert('Error', 'Invalid offer or fighter ID');
            return;
        }
        router.push({
            pathname: '/offer/reject',
            params: {
                fighterId: submittedInformation[0]?.fighterId || '',
                offerId: submittedInformation[0]?.offerId || '',
                typeOffer: 'Multi-fight contract',
            }
        })
    };

    const handleNegotiateOffer = () => {
        router.push({
            pathname: '/offer/negotiation/multi',
            params: {
                offer: JSON.stringify(offer),
                submittedInformation: JSON.stringify(submittedInformation),
                previousInformation: JSON.stringify(previousInformation)
            }
        })
    };
    return (
        <View>
            <View>
                {submittedInformation?.map(info => {
                    const prev = previousInformation?.find(
                        p => p.fightNumber === info.fightNumber,
                    );

                    return (
                        <View key={info.fightNumber} style={styles.fightCard}>
                            <Text style={styles.header}>Fight {info.fightNumber}</Text>
                            <View style={styles.bonusRow}>
                                <PurseBlock
                                    title="Fight Purse"
                                    oldValue={prev?.fightPurse}
                                    newValue={info.fightPurse}
                                    currency={info.currency}
                                />
                                <PurseBlock
                                    title="Win Bonus"
                                    oldValue={prev?.winPurse}
                                    newValue={info.winPurse}
                                    currency={info.currency}
                                />
                                <PurseBlock
                                    title="Finish Bonus"
                                    oldValue={prev?.bonusPurse}
                                    newValue={info.bonusPurse}
                                    currency={info.currency}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmOffer}>
                    <Text style={styles.confirmText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.negotiateButton}
                    onPress={handleNegotiateOffer}>
                    <Text style={styles.negotiateText}>Negotiate the Offer</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleRejectOffer}>
                    <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },
    statusText: {
        marginBottom: 10,
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#F2F2F2',
        borderRadius: 12,
        padding: 16,
    },
    bonusRow: {
        flexDirection: 'row',
        marginBottom: 16,
        justifyContent: 'space-between',
    },

    confirmButton: {
        backgroundColor: '#0E6F57',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 12,
        height: 56,
        justifyContent: 'center',
    },
    confirmText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    negotiateButton: {
        backgroundColor: 'rgb(255, 202, 58)',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 12,
        height: 56,
        justifyContent: 'center',
    },
    negotiateText: {
        color: '#131313',
        fontSize: 16,
    },
    rejectText: {
        color: colors.darkError,
        textAlign: 'center',
        fontSize: 16,
    },
    fightCard: {
        backgroundColor: '#F2F2F2',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    header: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
        color: colors.primaryBlack,
    },
    actionsContainer: {
        marginTop: 20,
    },
});

export default MultiFightNegotiationOfferComponent;
