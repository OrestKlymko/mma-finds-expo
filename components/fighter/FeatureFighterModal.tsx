import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import colors from '@/styles/colors';
import React, {useEffect, useState} from 'react';
import {
    featureFighterOnOffer,
    getCredit,
    submitOfferByFighterWithoutFeaturing,
} from '@/service/service';
import {PublicOfferInfo} from "@/service/response";
import {useRouter} from "expo-router";
import {Image} from "expo-image";

type FeatureFighterModalProps = {
    fighterId: string | null;
    offerToSubmit: PublicOfferInfo | null;
    isFeatureModalVisible: boolean;
    setFeatureModalVisible: (visible: boolean) => void;
    setIsMainVisible: (visible: boolean) => void;
};
export const FeatureFighterModal = ({
                                        fighterId,
                                        offerToSubmit,
                                        isFeatureModalVisible,
                                        setFeatureModalVisible,
                                        setIsMainVisible,
                                    }: FeatureFighterModalProps) => {
    const [loading, setLoading] = useState(false);
    const [availableCredits, setAvailableCredits] = useState(0);
    const router = useRouter();
    useEffect(() => {
        getAvailableCredits();
    }, []);

    const getAvailableCredits = async () => {
        getCredit().then(res => {
            setAvailableCredits(res.featuringCredit);
        });
    };
    const continueWithFeature = () => {
        if (availableCredits === 0) {
            setFeatureModalVisible(false);
            router.push({
                pathname:'/profile/balance/credit-option',
                params: {
                    offerId: offerToSubmit?.offerId,
                    fighterId: fighterId,
                },
            })
            return;
        }
        if (!offerToSubmit || !fighterId) {
            Alert.alert('Unexpectable error, please try again later.');
            return;
        }
        featureFighterOnOffer(offerToSubmit?.offerId, fighterId)
            .then(() => {
                setFeatureModalVisible(false);
                router.push('/manager/fighter/success');
            })
            .catch(() => {
                Alert.alert('Error', 'Failed to feature fighter');
            });
    };

    const handleContinueWithoutFeaturing = () => {
        setFeatureModalVisible(false);
        setIsMainVisible(true);
        setLoading(true);

        if (!offerToSubmit || !fighterId) {
            Alert.alert('Error', 'No fighter or offer data.');
            setLoading(false);
            return;
        }

        submitOfferByFighterWithoutFeaturing(offerToSubmit.offerId, fighterId)
            .then(() => {
                router.back();
            })
            .catch(_ => {
                Alert.alert('Error', 'Failed to submit offer');
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <Modal
            visible={isFeatureModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => {
                setFeatureModalVisible(false);
                setIsMainVisible(true);
            }}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Image
                        source={{uri: offerToSubmit?.eventImageLink}}
                        style={styles.bannerInModal}
                    />
                    <View style={{paddingHorizontal: 28}}>
                        <Text style={styles.modalTitle}>Feature Your Fighter</Text>
                        <Text style={styles.modalSubtitle}>
                            You currently have {availableCredits} credits left.
                        </Text>
                        <Text style={styles.modalDescription}>
                            Do you want to elevate your fighter&apos;s position, securing a prime
                            spot on the list of potential fighters?
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            disabled={loading}
                            onPress={continueWithFeature}>
                            {loading ? (
                                <ActivityIndicator size="small" color={colors.white} />
                            ) : (
                                <Text style={styles.modalButtonText}>Feature for 1 Credit</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalSecondaryButton}
                            disabled={loading}
                            onPress={handleContinueWithoutFeaturing}>
                            {loading ? (
                                <ActivityIndicator size="small" color={colors.white} />
                            ) : (
                                <Text style={styles.modalSecondaryButtonText}>
                                    Continue Without Featuring
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        height: 56,
        justifyContent: 'center',
    },
    modalButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    modalSecondaryButton: {
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 40,
        height: 56,
        justifyContent: 'center',
    },
    modalSecondaryButtonText: {
        color: colors.secondaryBlack,
        fontSize: 16,
        fontWeight: '400',
    },
    modalTitle: {
        marginTop: 20,
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 30,
        color: colors.primaryGreen,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '400',
        lineHeight: 19,
        color: colors.primaryBlack,
        marginBottom: 17,
    },
    modalDescription: {
        fontSize: 16.5,
        color: colors.primaryBlack,
        fontWeight: '400',
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bannerInModal: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginBottom: 20,
    },
});
