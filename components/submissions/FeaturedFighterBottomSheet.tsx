import {
    ActivityIndicator,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    Alert,
    Image
} from 'react-native';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import {declineOffer, featureFighterOnOffer, getCredit, renewSubmissionOffer} from '@/service/service';
import colors from '@/styles/colors';
import {ShortInfoFighter} from "@/service/response";


interface FeatureFighterBottomSheetProps {
    offerId?: string | undefined,
    fighterId: string,
    eventImage?: string | undefined,
    isFeatured?: string,
    visible?: boolean,
    onClose: () => void,
    onRefreshFighterList: () => void,
    fighters?: ShortInfoFighter[]
}

export const FeatureFighterBottomSheet = ({
                                              offerId,
                                              fighterId,
                                              eventImage,
                                              isFeatured,
                                              visible,
                                              onRefreshFighterList,
                                              onClose,
                                              fighters
                                          }: FeatureFighterBottomSheetProps) => {
    const [cancelLoading, setCancelLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [availableCredits, setAvailableCredits] = useState(0);

    useEffect(() => {
        getAvailableCredits();
    }, []);
    const getAvailableCredits = async () => {
        getCredit().then(res => {
            setAvailableCredits(res.featuringCredit);
        });
    };
    const handleFeatureFighter = async () => {
        if (!offerId || !fighterId) {
            Alert.alert('Error', 'Invalid offer or fighter ID');
            setLoading(false);
            return;
        }
        if (availableCredits == 0) {
            onClose();
            router.push({
                pathname: '/profile/balance/credit-option',
                params: {
                    offerId: offerId,
                    fighterId: fighterId
                },
            })
            return;
        }
        setLoading(true);

        featureFighterOnOffer(offerId, fighterId)
            .then(() => {
                onRefreshFighterList();
                getAvailableCredits();
            })
            .catch(() => {
                Alert.alert('Error', 'Something went wrong. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
                onClose();
            });
    };

    const renewSubmission = async () => {
        if (!offerId || !fighterId) {
            Alert.alert('Error', 'Invalid offer or fighter ID');
            return;
        }
        setLoading(true);
        await renewSubmissionOffer(offerId, fighterId)
        setLoading(false);
        router.back();
    }

    const cancelFighter = () => {
        Alert.alert("Are you sure?", "Are you sure you want to cancel the fighter from the offer?", [
            {
                text: "No",
                onPress: () => {
                    setCancelLoading(false);
                    onClose();
                },
                style: "cancel"
            },
            {
                text: "Yes",
                onPress: () => {
                    if (!offerId || !fighterId) {
                        Alert.alert('Error', 'Invalid offer or fighter ID');
                        setCancelLoading(false);
                        return;
                    }
                    setCancelLoading(true);
                    declineOffer(offerId, fighterId)
                        .then(() => {
                            onRefreshFighterList();
                            router.back();
                        })
                        .catch(() => {
                            Alert.alert('Error', 'Something went wrong. Please try again');
                        })
                        .finally(() => {
                            setCancelLoading(false);
                            onClose();
                        });
                }
            }
        ]);

    };

    const renderChangeStateSubmission = () => {
        if (fighters && fighters[0]?.fighterStateApprove === 'INACTIVE') {
            return <TouchableOpacity
                style={styles.modalThirdButton}
                disabled={loading}
                onPress={renewSubmission}>
                {loading ? (
                    <ActivityIndicator size="small" color={colors.primaryGreen}/>
                ) : (
                    <Text
                        style={[
                            styles.modalSecondaryButtonText,
                            {color: colors.primaryGreen},
                        ]}>
                        Renew submission
                    </Text>
                )}
            </TouchableOpacity>
        }
        return <TouchableOpacity
            style={styles.modalThirdButton}
            disabled={cancelLoading}
            onPress={cancelFighter}>
            {cancelLoading ? (
                <ActivityIndicator size="small" color={colors.white}/>
            ) : (
                <Text
                    style={[
                        styles.modalSecondaryButtonText,
                        {color: colors.darkError},
                    ]}>
                    Cancel fighter
                </Text>
            )}
        </TouchableOpacity>
    }

    const renderBodySubmission = () => {
        if (fighters && fighters[0]?.fighterStateApprove === 'ACTIVE' && fighters[0]?.isFeatured === 'false') {
            return <>
                <Text style={styles.modalTitle}>Feature Your Fighter</Text>
                <Text style={styles.modalSubtitle}>
                    You currently have {availableCredits} credits left.
                </Text>
                <Text style={styles.modalDescription}>
                    Do you want to elevate your fighter's position, securing a prime
                    spot on the list of potential fighters?
                </Text>
            </>
        }
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => {
                onClose();
            }}>
            <TouchableWithoutFeedback onPress={() => onClose()}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Image
                            source={{uri: eventImage}}
                            style={styles.bannerInModal}
                        />
                        <View style={{paddingHorizontal: 28}}>
                            {renderBodySubmission()}
                            {isFeatured === 'false' && fighters && fighters[0].fighterStateApprove === 'ACTIVE' && (
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    disabled={loading}
                                    onPress={handleFeatureFighter}>
                                    {loading ? (
                                        <ActivityIndicator size="small" color={colors.white}/>
                                    ) : (
                                        <Text style={styles.modalButtonText}>
                                            Feature for 1 Credit
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={styles.modalSecondaryButton}
                                disabled={loading}
                                onPress={() => {
                                    onClose();
                                    router.navigate(`/manager/fighter/${fighterId}`);
                                }}>
                                <Text style={styles.modalSecondaryButtonText}>
                                    Show info about fighter
                                </Text>
                            </TouchableOpacity>
                            {renderChangeStateSubmission()}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
    modalTitle: {
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 30,
        color: colors.primaryGreen,
        textAlign: 'center',
        marginBottom: 16,
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
    modalButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        height: 56,
        marginBottom: 10,
        justifyContent: 'center',
    },
    modalButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    modalSecondaryButton: {
        backgroundColor: colors.primaryBlack,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
        marginBottom: 10,
    },
    modalThirdButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    modalSecondaryButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '400',
        borderRadius: 8,
    },
});
