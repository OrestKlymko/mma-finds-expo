import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import {confirmExclusiveOffer, confirmPublicOffer} from '@/service/service';
import {ResponsorOfferRequest} from '@/service/request';
import {ExclusiveOfferInfo, PublicOfferInfo, SubmittedInformationOffer} from "@/service/response";
import {useRouter} from "expo-router";
import {PurseBlock} from "@/components/offers/public/PurseBlock";

interface NegotiationOfferComponentProps {
    submittedInformation?: SubmittedInformationOffer | undefined | null,
    previousInformation?: SubmittedInformationOffer | undefined | null,
    typeOffer: string,
    offer: PublicOfferInfo |ExclusiveOfferInfo | undefined | null,
}

const NegotiationOfferComponent = ({
                                       submittedInformation,
                                       previousInformation,
                                       typeOffer,
                                       offer
                                   }: NegotiationOfferComponentProps) => {
    const router = useRouter();

    const handleConfirmOffer = () => {
        if (!submittedInformation?.offerId || !submittedInformation?.fighterId) {
            Alert.alert('Error', 'Invalid offer or fighter ID');
            return;
        }
        const data: ResponsorOfferRequest = {
            offerId: submittedInformation?.offerId,
            fighterId: submittedInformation?.fighterId,
        };
        if (typeOffer === 'Exclusive') {
            confirmExclusiveOffer(data).then(
                () => {
                    router.back();
                },
                () => {
                    Alert.alert('Error', 'Failed to confirm the offer');
                },
            );
        } else {
            confirmPublicOffer(data).then(
                () => {
                    router.back();
                },
                () => {
                    Alert.alert('Error', 'Failed to confirm the offer');
                },
            );
        }
    };

    const handleRejectOffer = () => {
        router.push({
            pathname: '/offer/reject',
            params: {
                fighterId: submittedInformation?.fighterId || '',
                offerId: submittedInformation?.offerId || '',
                typeOffer,
            }
        })
    };

    const handleNegotiateOffer = () => {
        router.push({
            pathname: '/offer/negotiation',
            params: {
                fighterId: submittedInformation?.fighterId || '',
                offerId: submittedInformation?.offerId || '',
                submittedInformation: JSON.stringify(submittedInformation),
                previousInformation: JSON.stringify(previousInformation),
                offer: JSON.stringify(offer),
                typeOffer,
            }
        });

    };
    return (
        <View style={styles.container}>

            <View style={styles.card}>
                <View style={styles.bonusRow}>
                    <PurseBlock
                        title="Fight Purse"
                        oldValue={previousInformation?.fightPurse}
                        newValue={submittedInformation?.fightPurse}
                        currency={submittedInformation?.currency}
                    />
                    <PurseBlock
                        title="Win Bonus"
                        oldValue={previousInformation?.winPurse}
                        newValue={submittedInformation?.winPurse}
                        currency={submittedInformation?.currency}
                    />
                    <PurseBlock
                        title="Finish Bonus"
                        oldValue={previousInformation?.bonusPurse}
                        newValue={submittedInformation?.bonusPurse}
                        currency={submittedInformation?.currency}
                    />
                </View>

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
});

export default NegotiationOfferComponent;
