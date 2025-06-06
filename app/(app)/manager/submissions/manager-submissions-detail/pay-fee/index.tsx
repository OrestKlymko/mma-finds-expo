import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/styles/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { paySuccessFee, rejectPublicOffer } from '@/service/service';
import { payWithStripe } from '@/service/create-entity/stripePayment';
import { PaySuccessFeeRequest, ResponsorOfferRequest } from '@/service/request';
import GoBackButton from '@/components/GoBackButton';
import {SubmittedInformationOffer} from "@/service/response";

const MIN_FEE = 30;
const MAX_FEE = 60;
const RATE = 0.0333;
const { width } = Dimensions.get('window');

const SuccessFeePaymentScreen: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{
        submittedInformation?: string;
        offerId?: string;
    }>();
    const offerId = params.offerId as string;

    // безпечний варіант розбору JSON:
    let submitted: SubmittedInformationOffer | undefined;
    if (typeof params.submittedInformation === 'string') {
        try {
            submitted = JSON.parse(params.submittedInformation) as SubmittedInformationOffer;
        } catch (e) {
            console.warn('Неможливо розпарсити submittedInformation:', e);
            submitted = undefined;
        }
    } else {
        // тут params.submittedInformation або undefined, або масив string[] (якщо використовуєте кілька однакових ключів у query)
        submitted = undefined;
    }

    const [loading, setLoading] = useState(true);
    const [fee, setFee] = useState(0);
    const [processing, setProcessing] = useState<'PAY' | 'DECLINE' | null>(null);

    useEffect(() => {
        if(!submitted || !offerId) {
            return;
        }
        const purse = (+submitted.fightPurse || 0) + (+submitted.bonusPurse || 0) + (+submitted.winPurse || 0);
        const raw = purse * RATE;
        setFee(Math.min(Math.max(raw, MIN_FEE), MAX_FEE));
        setLoading(false);
    }, []);

    const openPolicy = () =>
        Alert.alert('Service Fee Policy', 'To support the platform, a Service Fee (3.33% of the purse) is charged — min €30, max €60.');

    const onPay = () => {
        Alert.alert('Confirm Payment', `You will be charged €${fee.toFixed(2)}.`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Pay',
                onPress: async () => {
                    try {
                        setProcessing('PAY');
                        await payWithStripe(fee.toFixed(2));
                        const body: PaySuccessFeeRequest = {
                            offerId,
                            fighterId: submitted.fighterId,
                            feePayment: fee.toFixed(2),
                        };
                        await paySuccessFee(body);
                        router.push(`/offers/public/${offerId}`)
                    } catch (e) {
                        console.error(e);
                        Alert.alert('Error', 'Payment failed. Please try again.');
                    } finally {
                        setProcessing(null);
                    }
                },
            },
        ]);
    };

    const onDecline = () => {
        Alert.alert('Decline Offer', 'Are you sure you want to decline?', [
            { text: 'Keep offer', style: 'cancel' },
            {
                text: 'Decline',
                style: 'destructive',
                onPress: async () => {
                    try {
                        setProcessing('DECLINE');
                        const body: ResponsorOfferRequest = {
                            offerId,
                            fighterId: submitted.fighterId,
                            rejectionReason: 'Declined by fighter',
                        };
                        await rejectPublicOffer(body);
                        router.push('/(app)/(tabs)');
                    } catch (e) {
                        console.error(e);
                        Alert.alert('Error', 'Could not decline the offer.');
                    } finally {
                        setProcessing(null);
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={colors.primaryGreen} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <GoBackButton />
            <LinearGradient
                colors={[colors.primaryGreen, '#14a37f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hero}
            >
                <Text style={styles.heroText}>Service Fee</Text>
                <View style={styles.feeBadge}>
                    <Text style={styles.feeBadgeText}>€{fee.toFixed(2)}</Text>
                </View>
                <Feather name="info" size={18} color={colors.white} onPress={openPolicy} style={styles.infoIcon} />
            </LinearGradient>

            <View style={styles.cardWrapper}>
                <View style={styles.cardGlass}>
                    <Text style={styles.cardTitle}>Almost done!</Text>
                    <Text style={styles.cardBody}>Confirm the service fee to complete your fight submission. The fee is automatically calculated at 3.33 % of the purse.</Text>
                </View>
            </View>

            <View style={styles.buttonsRow}>
                <TouchableOpacity style={[styles.btn, styles.btnPay]} disabled={!!processing} onPress={onPay}>
                    {processing === 'PAY' ? <ActivityIndicator size="small" color={colors.white} /> : <Text style={styles.btnPayText}>Pay €{fee.toFixed(2)}</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnDecline]} disabled={!!processing} onPress={onDecline}>
                    {processing === 'DECLINE' ? <ActivityIndicator size="small" color={colors.darkError} /> : <Text style={styles.btnDeclineText}>Decline</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loadingBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hero: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    heroText: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 6,
    },
    feeBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
    },
    feeBadgeText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    infoIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    cardWrapper: {
        marginTop: -40,
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    cardGlass: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.primaryBlack,
        marginBottom: 10,
    },
    cardBody: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.secondaryBlack,
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 14,
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    btn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    btnPay: {
        backgroundColor: colors.primaryGreen,
    },
    btnPayText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
    btnDecline: {
        borderWidth: 1,
        borderColor: colors.darkError,
        backgroundColor: colors.white,
    },
    btnDeclineText: {
        color: colors.darkError,
        fontWeight: '600',
        fontSize: 16,
    },
});

export default SuccessFeePaymentScreen;
