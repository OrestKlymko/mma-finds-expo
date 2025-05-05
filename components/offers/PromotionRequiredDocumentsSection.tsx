import React from 'react';


import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import {formatDateFromLocalDate} from "@/utils/utils";
import * as Linking from 'expo-linking';
import {useRouter} from "expo-router";

interface DocumentItem {
    documentName: string;
    documentType: 'FILE' | 'TEXT';
    response: string;
    originalValue: string;
    onUploadPress: () => void;
    onChangeText: (text: string) => void;
    onConfirm: () => void;
}

interface Props {
    documents: DocumentItem[];
    typeOffer: 'Public' | 'Exclusive' | 'Multi-fight contract' | undefined;
    dueDate?: string;
    offerId?: string;
    fighterId?: string;
}

export const PromotionRequiredDocumentsSection: React.FC<Props> = ({
                                                                       documents,
                                                                       dueDate,
                                                                       offerId,
                                                                       fighterId,
                                                                       typeOffer,
                                                                   }) => {
    const router = useRouter();
    const handleRejectOffer = () => {
        router.push({
            pathname: '/offer/reject',
            params: {
                fighterId,
                offerId,
                typeOffer: typeOffer,
            }
        })
    };

    const downloadFile = async (url: string, filename: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Cannot open the file link.');
            }
        } catch (err) {
            console.error('Open file error:', err);
            Alert.alert('Error', 'An error occurred while opening the file.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{flex: 1}}>
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>Required Documents</Text>

                    {documents.map(doc => (
                        <View key={doc.documentName} style={styles.documentContainer}>
                            <View style={styles.row}>
                                <View style={styles.fieldBox}>
                                    {doc.documentType === 'TEXT' ? (
                                        <Text style={styles.fieldText}>
                                            {doc.documentName}: {doc.response || '—'}
                                        </Text>
                                    ) : (
                                        <TouchableOpacity
                                            disabled={!doc.response}
                                            onPress={() =>
                                                doc.response &&
                                                downloadFile(doc.response, `${doc.documentName}.pdf`)
                                            }>
                                            <Text style={styles.fieldText}>
                                                {doc.documentName}:{' '}
                                                {doc.response
                                                    ? 'Uploaded. Tap to download!'
                                                    : 'Not uploaded'}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    {doc.response && (
                                        <Icon
                                            name={doc.documentType === 'TEXT' ? 'check' : 'download'}
                                            size={20}
                                            color={colors.primaryGreen}
                                            style={styles.icon}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}

                    {dueDate && (
                        <>
                            <View style={styles.dueDateContainer}>
                                <Text style={styles.dueDateText}>
                                    <Text style={{fontWeight: 'bold'}}>
                                        Due date for upload:{' '}
                                    </Text>
                                    {formatDateFromLocalDate(dueDate)}
                                </Text>
                            </View>
                            <View style={styles.buttonsRow}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/offer/document',
                                            params: {
                                                offerId,
                                                typeOffer: typeOffer,
                                            }
                                        })
                                    }>
                                    <Text style={styles.actionText}>Renew Due Date</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handleRejectOffer}>
                                    <Text style={[styles.actionText, {color: colors.darkError}]}>
                                        Cancel Fighter
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    sectionTitle: {
        fontWeight: '600',
        fontSize: 13,
        marginBottom: 16,
        color: colors.primaryBlack,
    },
    documentContainer: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    fieldBox: {
        flex: 1,
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 56,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    fieldText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    icon: {
        marginLeft: 8,
    },

    dueDateContainer: {
        marginTop: 10,
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dueDateText: {
        fontSize: 15,
        color: colors.primaryBlack,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    actionButton: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '400',
        color: colors.primaryGreen,
    },
});
