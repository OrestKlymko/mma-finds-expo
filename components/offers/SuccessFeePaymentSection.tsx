// components/SuccessFeePaymentSection.tsx

import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import colors from '@/styles/colors';
import {paySuccessFee, rejectPublicOffer} from '@/service/service';
import {SubmittedInformationPublicOffer} from "@/models/tailoring-model";
import {Feather} from "@expo/vector-icons";
import {payWithStripe} from "@/service/create-entity/stripePayment";
import {useRouter} from "expo-router";
import {PaySuccessFeeRequest, ResponsorOfferRequest} from "@/service/request";

const MIN_FEE = 30;
const MAX_FEE = 60;
const RATE = 0.0333;

interface SuccessFeePaymentSectionProps {
    offerId: string,
    submittedInformation: SubmittedInformationPublicOffer
}

export const SuccessFeePaymentSection: React.FC<SuccessFeePaymentSectionProps> = ({
                                                                                      offerId,
                                                                                      submittedInformation
                                                                                  }) => {
    const [loading, setLoading] = useState(true);
    const [fee, setFee] = useState(0);
    const router = useRouter();
    const [successPayProcess, setSuccessPayProcess] = useState(false);
    const [declineProcess, setDeclineProcess] = useState(false);
    useEffect(() => {
        async function fetchAndCalc() {
            setLoading(true);
            try {
                if (!offerId) throw new Error('Missing parameters');

                const fight = parseFloat(submittedInformation.fightPurse) || 0;
                const bonus = parseFloat(submittedInformation.bonusPurse) || 0;
                const win = parseFloat(submittedInformation.winPurse) || 0;
                const sum = fight + bonus + win;

                const rawFee = sum * RATE;
                const clamped = Math.min(Math.max(rawFee, MIN_FEE), MAX_FEE);
                setFee(clamped);
            } catch (err) {
                console.error(err);
                Alert.alert('Error', 'Failed to load purse information');
            } finally {
                setLoading(false);
            }
        }

        fetchAndCalc();
    }, [offerId]);

    const handlePay = () => {
        Alert.alert(
            `Pay €${fee.toFixed(2)}`,
            `You will be charged €${fee.toFixed(2)} now.`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setSuccessPayProcess(true);
                        await payWithStripe(fee.toString())
                        const data: PaySuccessFeeRequest = {
                            offerId: offerId,
                            fighterId: submittedInformation.fighterId,
                            feePayment: fee.toString(),
                        }
                        await paySuccessFee(data)
                        Alert.alert('Success', 'Payment was successful');
                        setSuccessPayProcess(false);
                        router.back();
                    },
                },
            ]
        );
    };

    const handleDecline = () => {
        Alert.alert(
            'Decline Offer',
            'Are you sure you want to decline this offer?',
            [
                {text: 'No', style: 'cancel'},
                {
                    text: 'Yes, Decline',
                    style: 'destructive',
                    onPress: () => {
                        setDeclineProcess(true);
                        const data: ResponsorOfferRequest = {
                            offerId: offerId,
                            fighterId: submittedInformation.fighterId,
                            rejectedReason: 'Declined by fighter',
                        };
                        rejectPublicOffer(data).then(
                            () => {
                                router.push('/(app)/(tabs)')
                            },
                            () => {
                                Alert.alert('Error', 'Failed to reject the offer');
                            },
                        ).finally(() => setDeclineProcess(false));
                    },
                },
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator style={{marginVertical: 20}}/>;
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', marginBottom: 12, alignItems: 'center'}}>
                <Text style={styles.title}>Service Fee</Text>
                <Feather name="info" size={16} color="black" onPress={() => {
                    Alert.alert('Service Fee Policy', ' To support the operation and ongoing development of the MMA Finds platform, a Service Fee is applied to each confirmed fight arranged through a Public Fight Offer within the platform.\n' +
                        '\n\nThe Service Fee is calculated as 3.33% of the fighter’s confirmed purse (fight purse + bonus purse + win purse), with a minimum fee of €30 and a maximum fee of €60 per fight, regardless of the purse amount.')
                }}/>
            </View>
            <Text style={styles.headerSubtitle}>
                Congratulations on confirming this offer! We’re thrilled you’ve reached an agreement.
                To continue with your submission, please pay a Service Fee of €{fee.toFixed(2)}.
            </Text>

            <View style={styles.buttonsRow}>
                <TouchableOpacity
                    disabled={successPayProcess}
                    style={[styles.button, styles.payButton]}
                    onPress={handlePay}
                >
                    {successPayProcess ? (
                        <ActivityIndicator size="small" color={colors.white}/>) : (
                        <Text style={styles.payText}>Pay €{fee.toFixed(2)}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.declineButton]}
                    disabled={declineProcess}
                    onPress={handleDecline}
                >
                    {declineProcess ? (
                        <ActivityIndicator size="small" color={colors.darkError}/>) : (
                        <Text style={styles.declineText}>Decline</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderColor: colors.lightGray,
        paddingTop: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginRight: 5,
    },
    policyContainer: {
        maxHeight: 120,
        marginBottom: 16,
    },
    policyText: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.primaryBlack,
    },
    summary: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginBottom: 4,
    },
    feeAmount: {
        fontSize: 22,
        fontWeight: '600',
        color: colors.primaryGreen,
        marginBottom: 16,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    payButton: {
        backgroundColor: colors.primaryGreen,
        marginRight: 8,
    },
    declineButton: {
        borderWidth: 1,
        borderColor: colors.darkError,
    },
    payText: {
        color: colors.white,
        fontWeight: '600',
    },
    declineText: {
        color: colors.darkError,
        fontWeight: '600',
    },
    headerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginLeft: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.primaryBlack,
        marginBottom: 16,
    },
});
