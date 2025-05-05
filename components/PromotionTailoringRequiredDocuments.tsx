import React, {useCallback} from 'react';
import {ActivityIndicator, Modal, Platform, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import {DocumentRequiredResponse} from '@/service/response';
import {getAllRequiredDocumentByPromotion} from '@/service/service';
import {useFocusEffect} from '@react-navigation/native';
import {formatDate} from "@/utils/utils";
import {RequiredDocumentList} from "@/components/RequiredDocumentList";

type Props = {
    documents: DocumentRequiredResponse[];
    setDocuments: (docs: DocumentRequiredResponse[]) => void;
    dueDate: Date | null;
    setDueDate: (date: Date) => void;
    isDatePickerVisible: boolean;
    setDatePickerVisible: (visible: boolean) => void;
    handleContinue: (shouldSave: boolean) => void;
    isSaveDocumentModalVisible: boolean;
    setSaveDocumentModalVisible: (val: boolean) => void;
    loading: boolean;
};

export const PromotionTailoringRequiredDocuments = ({
                                                        documents,
                                                        setDocuments,
                                                        dueDate,
                                                        setDueDate,
                                                        isDatePickerVisible,
                                                        setDatePickerVisible,
                                                        handleContinue,
                                                        isSaveDocumentModalVisible,
                                                        setSaveDocumentModalVisible,
                                                        loading,
                                                    }: Props) => {
    const handleConfirmDate = (date: Date) => {
        setDueDate(date);
        setDatePickerVisible(false);
    };
    useFocusEffect(
        useCallback(() => {
            getAllRequiredDocumentByPromotion().then(response => {
                setDocuments(
                    response.map((doc: DocumentRequiredResponse) => ({
                        ...doc,
                        isCustom: false,
                    })),
                );
            });
        }, []),
    );
    return (
        <>
            <Text style={styles.sectionTitle}>Required Documents</Text>

            <RequiredDocumentList
                documents={documents}
                setDocuments={setDocuments}
            />

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Due Date For Documents
            </Text>

            <TouchableOpacity
                style={styles.selectFieldButton}
                onPress={() => setDatePickerVisible(true)}
            >
                <Text style={styles.selectFieldText}>
                    {dueDate ? `${formatDate(dueDate)}` : 'Set a Due Date*'}
                </Text>
                <Icon name={'chevron-right'} size={24} color={colors.primaryBlack} />
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                locale="en-GB"
                minimumDate={new Date()}
                onConfirm={handleConfirmDate}
                onCancel={() => setDatePickerVisible(false)}
            />

            {/* MODAL */}
            <Modal visible={isSaveDocumentModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            onPress={() => setSaveDocumentModalVisible(false)}
                            style={styles.modalClose}
                        >
                            <Icon name="close" size={24} color={colors.primaryBlack} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Custom Document</Text>
                        <Text style={styles.modalDescription}>
                            We noticed you have created the following custom documents:
                        </Text>
                        <View style={styles.documentList}>
                            {documents
                                .filter(doc => doc.isCustom)
                                .map(doc => (
                                    <Text
                                        key={doc.id}
                                        style={styles.customDocText}
                                    >
                                        {doc.documentName}
                                    </Text>
                                ))}
                        </View>
                        <Text style={styles.modalDescription}>
                            Would you like to save these documents as required documents to your profile?
                        </Text>

                        <TouchableOpacity
                            style={styles.modalButton}
                            disabled={loading}
                            onPress={() => {
                                setSaveDocumentModalVisible(false);
                                handleContinue(true);
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={colors.white} />
                            ) : (
                                <Text style={styles.modalButtonText}>Save To Profile</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalButtonSkip}
                            disabled={loading}
                            onPress={() => {
                                setSaveDocumentModalVisible(false);
                                handleContinue(false);
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={colors.white} />
                            ) : (
                                <Text style={[styles.modalButtonText, { color: colors.primaryBlack }]}>
                                    Skip
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginBottom: 29,
    },
    selectFieldButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 14,
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    selectFieldText: {
        fontSize: 16,
        fontWeight: '400',
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
        fontWeight: '600',
        lineHeight: 30,
        color: colors.primaryBlack,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 17.5,
        color: colors.primaryBlack,
        lineHeight: 20,
        textAlign: 'center',
        marginVertical: 10,
    },
    documentList: {
        marginVertical: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    customDocText: {
        color: colors.primaryGreen,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
    modalButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        height: 56,
        justifyContent: 'center',
    },
    modalButtonSkip: {
        alignItems: 'center',
        marginBottom: 30,
        height: 56,
        justifyContent: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
});
