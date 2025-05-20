import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '@/styles/colors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { SubmittedInformationPublicOffer } from '@/models/tailoring-model';

/*
  SuccessFeePaymentSection
  ──────────────────────────────────────────────────────────────
  ▸ Renders inside the public-offer screen.
  ▸ Behaviour depends on the current role:
      • MANAGER   → shows fee details  +   «Pay fee» button (navigates to payment screen)
      • PROMOTION → shows waiting-for-fighter message, no actions
*/

interface Props {
    offerId: string;
    submittedInformation: SubmittedInformationPublicOffer;
}

const SuccessFeePaymentSection: React.FC<Props> = ({ offerId, submittedInformation }) => {
    const { role } = useAuth(); // «MANAGER» | «PROMOTION»
    const router = useRouter();


    /* ── UI for MANAGER ────────────────────────────────────────*/
    if (role === 'MANAGER') {
        const openPolicy = () =>
            Alert.alert(
                'Service Fee Policy',
                'To support the operation and ongoing development of the MMA Finds platform, a Service Fee is applied to each confirmed fight arranged through a Public Fight Offer.\n\nThe fee equals 3.33 % of the fighter’s confirmed purse (fight + bonus + win) with a minimum of €30 and a maximum of €60.'
            );

        const goToPayScreen = () =>{
            if(!submittedInformation){
                Alert.alert('Error', 'No submitted information found.');
                return;
            }
            router.push({
                pathname: '/manager/submissions/manager-submissions-detail/pay-fee',
                params: { offerId, submittedInformation: JSON.stringify(submittedInformation) },
            });
        }


        return (
            <View style={styles.box}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Service Fee</Text>
                    <Feather name="info" size={16} color={colors.secondaryBlack} onPress={openPolicy} />
                </View>

                <Text style={styles.subtitle}>
                    Congratulations on reaching an agreement! Finalise the process by paying the platform
                    fee.
                </Text>

                <TouchableOpacity style={[styles.button, styles.payButton]} onPress={goToPayScreen}>
                    <Text style={styles.payText}>Confirm Participation</Text>
                </TouchableOpacity>
            </View>
        );
    }

    /* ── UI for PROMOTION ─────────────────────────────────────*/
    return (
        <View style={styles.box}>
            <Text style={styles.waitTitle}>Waiting for Fighter</Text>
            <Text style={styles.waitText}>
                We have notified the fighter’s representative about your decision. You’ll be informed as
                soon as they confirm or reject the offer.
            </Text>
        </View>
    );
};

/* ── styles ──────────────────────────────────────────────────*/
const styles = StyleSheet.create({
    box: {
        marginTop: 24,
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: colors.lightGray,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.primaryBlack,
        marginBottom: 16,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    payButton: {
        backgroundColor: colors.primaryGreen,
    },
    payText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
    /* ── waiting message (PROMOTION) ───────────────────────*/
    waitTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginBottom: 4,
    },
    waitText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.primaryBlack,
    },
});

export default SuccessFeePaymentSection;
