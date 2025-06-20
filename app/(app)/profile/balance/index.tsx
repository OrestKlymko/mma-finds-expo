import React, {useCallback, useEffect, useState} from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { getCredit } from '@/service/service';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';

/**
 * BalanceOverviewScreen
 * - Показує загальну кількість кредитів угорі.
 * - Деталізує, з яких саме типів кредитів складається баланс.
 */
const BalanceOverviewScreen = () => {
    const [isEarnNowModalVisible, setEarnNowModalVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { token, methodAuth, role } = useAuth();
    const [featuringCredit, setFeaturingCredit] = useState(0);
    const [referralCredit, setReferralCredit] = useState(0);

    const totalCredits = featuringCredit + referralCredit;

    /** Fetch credits */
    const fetchCredits = () =>
        getCredit().then((res) => {
            setFeaturingCredit(res.featuringCredit);
            setReferralCredit(res.referralCredit);
        });

    // on screen focus (pull-to-refresh effect)
    useFocusEffect(
        useCallback(() => {
            if (token) {
                fetchCredits();
            }
        }, [token])
    );
    // on auth change
    useEffect(() => {
        if (methodAuth && token) {
            fetchCredits();
        }
    }, [methodAuth, token]);

    const toggleEarnNowModal = () => setEarnNowModalVisible((v) => !v);

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom }}
            >
                {/* ─────────── HEADER ─────────── */}
                <GoBackButton />
                <Text style={styles.title}>Balance Overview</Text>

                {/* ─────────── CURRENT BALANCE ─────────── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>You currently have:</Text>

                    <View style={styles.creditCardTotal}>
                        <Text style={[styles.creditAmount, styles.totalAmount]}>
                            {featuringCredit + referralCredit} MMA Finds Credits
                        </Text>
                    </View>

                    {/* role-specific helper */}
                    {role === 'MANAGER' ? (
                        <Text style={styles.creditDescription}>
                            Use your credits to feature your fighters, increase visibility, and boost
                            their chances of getting the fight.
                        </Text>
                    ) : (
                        <Text style={styles.creditDescription}>
                            Use your credits to feature your public fight offers, increase visibility,
                            and reach more fighters in less time.
                        </Text>
                    )}
                </View>

                {/* ─────────── CALL-TO-ACTION ─────────── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Want more credits?</Text>

                    <Text style={styles.creditDescription}>
                        Invite new members and earn extra credits, or purchase more anytime.
                    </Text>

                    {/* Earn Credits */}
                    <TouchableOpacity onPress={() => router.push('/(app)/profile/invite-friends')}>
                        <Text style={styles.linkText}>Earn Credits</Text>
                    </TouchableOpacity>

                    {/* Purchase Credits */}
                    <TouchableOpacity
                        style={{ marginTop: 12 }}
                        onPress={() =>
                            router.push({
                                pathname: '/profile/balance/credit-option',
                                params: { offerId: undefined, fighterId: undefined },
                            })
                        }
                    >
                        <Text style={styles.linkText}>Purchase Credits</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* -------- EARN NOW MODAL -------- */}
            <Modal
                animationType="fade"
                transparent
                visible={isEarnNowModalVisible}
                onRequestClose={toggleEarnNowModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={toggleEarnNowModal}
                        >
                            <Icon name="close" size={24} color={colors.primaryBlack} />
                        </TouchableOpacity>

                        <Icon
                            name="gift-outline"
                            size={50}
                            color={colors.primaryGreen}
                            style={styles.modalIcon}
                        />
                        <Text style={styles.modalTitle}>Share &amp; earn up to €50 per referral!</Text>
                        <Text style={styles.modalDescription}>
                            Give your contacts 10% off their first platform payment, and earn credits
                            when they complete it.
                        </Text>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                toggleEarnNowModal();
                                router.push('/(app)/profile/invite-friends');
                            }}
                        >
                            <Text style={styles.modalButtonText}>Invite Contact</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default BalanceOverviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 24,
    },
    // --- Sections
    section: {
        marginBottom: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 15,
    },
    // --- Credit cards
    creditCard: {
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 24,
        marginBottom: 12,
    },
    creditCardTotal: {
        backgroundColor: colors.primaryGreen + '20', // light tint
        borderRadius: 8,
        paddingVertical: 28,
        paddingHorizontal: 24,
        marginBottom: 12,
        alignItems: 'center',
    },
    creditAmount: {
        fontSize: 20,
        fontWeight: '500',
        color: colors.primaryGreen,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: '600',
    },
    creditDescription: {
        fontSize: 14,
        color: colors.primaryBlack,
        marginBottom: 10,
        lineHeight: 20,
    },
    linkText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.primaryGreen,
    },
    // --- Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
    },
    modalCloseButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    modalIcon: {
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryGreen,
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 8,
    },
    modalDescription: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 20,
        lineHeight: 20,
    },
    modalButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 17,
        paddingHorizontal: 32,
        alignItems: 'center',
        width: '100%',
        marginBottom: 50,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
    },
});
