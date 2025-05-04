import React, {useState} from 'react';
import {ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {deactivateAccount, deleteAccount} from "@/service/service";
import colors from "@/styles/colors";
import GoBackButton from "@/components/GoBackButton";
import {useRouter} from "expo-router";

const AccountManagementScreen = () => {
    const insets = useSafeAreaInsets();
    const [isDeactivateModalVisible, setDeactivateModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDeactivateAccount = () => {
        setDeactivateModalVisible(true);
    };

    const confirmDeactivate = () => {
        setLoading(true);
        deactivateAccount()
            .then(_ => {
                Alert.alert('Success', 'Your account has been deactivated.');
                router.push('/welcome');
            })
            .catch(_ => {
                Alert.alert('Error', 'Something went wrong. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
                setDeactivateModalVisible(false);
            });
    };

    const confirmDelete = () => {
        setLoading(true);
        deleteAccount()
            .then(_ => {
                Alert.alert('Success', 'Your account has been deleted.');
                router.push('/welcome');
            })
            .catch(_ => {
                Alert.alert('Error', 'Something went wrong. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
                setDeleteModalVisible(false);
            });
    };

    const handleDeleteAccount = () => {
        setDeleteModalVisible(true);
    };

    const closeModal = () => {
        setDeactivateModalVisible(false);
        setDeleteModalVisible(false);
    };

    return (
        <View style={{backgroundColor: colors.background, flex: 1}}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                {/* Go Back Button */}

                {/* Header */}
                <Text style={styles.headerTitle}>Account Management</Text>
                <Text style={styles.description}>
                    If you need a break, you can simply deactivate your account. And if
                    you decide to permanently leave MMA Finds, you have the option to
                    delete your account.
                </Text>

                {/* Deactivate Account Section */}
                <TouchableOpacity
                    style={styles.sectionCard}
                    onPress={handleDeactivateAccount}>
                    <View>
                        <View style={styles.rowHeader}>
                            <Text style={styles.sectionTitle}>Deactivate Account</Text>
                            <Icon name="chevron-right" size={27} color={'#980909'} />
                        </View>
                        <Text style={styles.sectionDescription}>
                            Choose to deactivate your account for a temporary break. This
                            action hides your profile from MMA Finds, but allows you to
                            reactivate later.
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Delete Account Section */}
                <TouchableOpacity
                    style={styles.sectionCard}
                    onPress={handleDeleteAccount}>
                    <View>
                        <View style={styles.rowHeader}>
                            <Text style={styles.sectionTitle}>Delete Account</Text>
                            <Icon name="chevron-right" size={27} color={'#980909'} />
                        </View>
                        <Text style={styles.sectionDescription}>
                            Opt for a permanent deletion to completely erase your data from
                            MMA Finds. This is a final step. You cannot recover any files or
                            information once deleted.
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Deactivate Account Modal */}
                <Modal
                    visible={isDeactivateModalVisible}
                    transparent
                    animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
                                <Icon name="close" size={24} color={colors.primaryBlack} />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Deactivate Account</Text>
                            <Text style={styles.modalDescription}>
                                Are you sure you want to deactivate your{`\n`}
                                account? This action hides your profile {`\n`}
                                from MMA Finds, but allows you{`\n`}
                                to reactivate later.
                            </Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                disabled={loading}
                                onPress={confirmDeactivate}>
                                {loading ? (
                                    <ActivityIndicator size="small" color={colors.white} />
                                ) : (
                                    <Text style={styles.modalButtonText}>Deactivate Account</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Delete Account Modal */}
                <Modal visible={isDeleteModalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
                                <Icon name="close" size={24} color={colors.primaryBlack} />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Delete Account</Text>
                            <Text style={styles.modalDescription}>
                                Are you sure you want to delete your{`\n`}
                                account? This is a final step.{`\n`}
                                You cannot recover any files or information once your account is
                                deleted.
                            </Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                disabled={loading}
                                onPress={confirmDelete}>
                                {loading ? (
                                    <ActivityIndicator size="small" color={colors.white} />
                                ) : (
                                    <Text style={styles.modalButtonText}>Delete Account</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

export default AccountManagementScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: '500',
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
        marginTop: 50,
        marginBottom: 37,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 37,
    },
    sectionCard: {
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 22,
        fontFamily: 'Roboto',
        color: '#980909',
        marginBottom: 5,
    },
    sectionDescription: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Roboto',
        paddingRight: 20,
        color: colors.primaryBlack,
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
        paddingHorizontal: 30,
    },
    modalClose: {
        alignSelf: 'flex-end',
        marginTop: 20,
    },
    modalTitle: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 30,
        color: '#980909',
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 16.5,
        color: colors.primaryBlack,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#980909',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 100,
        height: 56,
        justifyContent: 'center',
    },
    modalButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});
