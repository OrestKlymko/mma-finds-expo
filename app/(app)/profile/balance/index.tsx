import React, {useEffect, useState} from 'react';
import {Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from "@/context/AuthContext";
import {useFocusEffect, useRouter} from "expo-router";
import {getCredit} from "@/service/service";
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";

const BalanceOverviewScreen = () => {
    const [isEarnNowModalVisible, setEarnNowModalVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const {token, methodAuth, role} = useAuth();
    const [featuringCredit, setFeaturingCredit] = useState(0);
    const [referralCredit, setReferralCredit] = useState(0);
    const toggleEarnNowModal = () => {
        setEarnNowModalVisible(!isEarnNowModalVisible);
    };

    useFocusEffect(
        React.useCallback(() => {
            getCredit().then(res => {
                setFeaturingCredit(res.featuringCredit);
                setReferralCredit(res.referralCredit);
            });
        }, []),
    );

    useEffect(() => {
        getCredit().then(res => {
            console.log(res);
            setFeaturingCredit(res.featuringCredit);
            setReferralCredit(res.referralCredit);
        });
    }, [token, methodAuth]);

    return (
        <View style={styles.flexContainer}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[{paddingBottom: insets.bottom}]}>
                {/* Go Back Button */}
                <GoBackButton/>

                {/* Title Section */}
                <Text style={styles.title}>Balance Overview</Text>

                {/* Referral Credits Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Referral Credits</Text>
                    <View style={styles.creditCard}>
                        <Text style={styles.creditAmount}>
                            {referralCredit}{' '}
                            {referralCredit === 1 || featuringCredit === 0
                                ? 'Credit'
                                : 'Credits'}
                        </Text>
                    </View>
                    <Text style={styles.creditDescription}>
                        Want to earn more credits? Invite new members and earn extra credits
                        to use on your next purchase.
                    </Text>
                    <TouchableOpacity onPress={toggleEarnNowModal}>
                        <Text style={styles.linkText}>Earn Now!</Text>
                    </TouchableOpacity>
                </View>

                {/* Feature Credits Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Feature Credits</Text>
                    <View style={styles.creditCard}>
                        <Text style={styles.creditAmount}>
                            {featuringCredit}{' '}
                            {featuringCredit === 1 || featuringCredit === 0
                                ? 'Credit'
                                : 'Credits'}
                        </Text>
                    </View>
                    <Text style={styles.creditDescription}>
                        {role === 'PROMOTION'
                            ? 'Purchase credits to feature your fight offers, increasing their visibility and improving the chances of securing the right match.'
                            : 'Purchase credits to feature your fighter in a specific fight offer and maximize the chance of selection.'}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/profile/balance/credit-option', params: {
                                    offerId: undefined,
                                    fighterId: undefined,
                                }
                            });
                        }}>
                        <Text style={styles.linkText}>Purchase Now!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Modal for "Earn Now!" */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isEarnNowModalVisible}
                onRequestClose={toggleEarnNowModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={toggleEarnNowModal}>
                            <Icon name="close" size={24} color={colors.primaryBlack}/>
                        </TouchableOpacity>

                        <Icon
                            name="gift-outline"
                            size={50}
                            color={colors.primaryGreen}
                            style={styles.modalIcon}
                        />
                        <Text style={styles.modalTitle}>Share & earn up to €100!</Text>
                        <Text style={styles.modalDescription}>
                            Give your friends a 10% discount on their first order, and you&apos;ll
                            both enjoy the benefits.
                        </Text>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                toggleEarnNowModal();
                                router.push('/(app)/profile/invite-friends');
                            }}>
                            <Text style={styles.modalButtonText}>Invite User</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default BalanceOverviewScreen;
const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 4,
    },

    /** Back Button **/
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 16,
    },
    backText: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.primaryBlack,
        marginLeft: 8,
    },

    /** Title **/
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 40,
    },

    /** Section **/
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
    creditCard: {
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 24,
        marginBottom: 12,
    },
    creditAmount: {
        fontSize: 20,
        fontWeight: '500',
        color: colors.primaryGreen,
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

    /** Modal **/
    modalContainer: {
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
        fontWeight: '400',
        fontFamily: 'Roboto',
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
        marginTop: 8,
        width: '100%',
        marginBottom: 50,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
    },
});
