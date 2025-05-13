// components/MissingFieldsModal.tsx

import React, {useState} from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import colors from '@/styles/colors';

type MissingFieldsModalProps = {
    visible: boolean;
    missingFields: string[];
    onClose: () => void;
};

export default function MissingFieldsModal({
                                               visible,
                                               onClose,
                                                  missingFields,
                                           }: MissingFieldsModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        Please fill in the following fields:
                    </Text>
                    {missingFields.map(field => (
                        <Text key={field} style={styles.modalItem}>
                            • {field}
                        </Text>
                    ))}
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={onClose}
                    >
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: colors.primaryBlack,
    },
    modalItem: {
        fontSize: 14,
        color: colors.darkError,
        marginBottom: 4,
    },
    modalButton: {
        marginTop: 16,
        alignSelf: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.primaryGreen,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonText: {
        color: colors.white,
        fontWeight: '500',
    },
});
