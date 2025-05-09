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
import FloatingLabelInput from '@/components/FloatingLabelInput';
import colors from '@/styles/colors';
import * as WebBrowser from 'expo-web-browser';
import {formatDateFromLocalDate} from '@/utils/utils';

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
    dueDate?: string;
}

export const RequiredDocumentsSection: React.FC<Props> = ({
                                                              documents,
                                                              dueDate,
                                                          }) => {
    const isDeadlinePassed = dueDate ? new Date(dueDate) < new Date() : false;

    const openFileInBrowser = async (url: string) => {
        try {
            const result = await WebBrowser.openBrowserAsync(url);
            if (result.type !== 'opened') {
                Alert.alert('Error', 'Could not open the file.');
            }
        } catch (error) {
            console.error('WebBrowser error:', error);
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

                    {isDeadlinePassed && (
                        <View style={styles.overlay}>
                            <Text style={styles.overlayText}>
                                Deadline for uploading documents has passed. Please contact the
                                promotion.
                            </Text>
                        </View>
                    )}

                    {documents.map((doc, index) => {
                        const isChanged = doc.response !== doc.originalValue;
                        return (
                            <View key={doc.documentName} style={styles.documentContainer}>
                                {doc.documentType === 'TEXT' ? (
                                    <View style={styles.row}>
                                        <FloatingLabelInput
                                            label={doc.documentName}
                                            value={doc.response || doc.originalValue}
                                            onChangeText={doc.onChangeText}
                                            containerStyle={{flex: 1}}
                                            keyboardType="default"
                                        />
                                        {!isChanged && doc.response && (
                                            <Icon
                                                name="check"
                                                size={20}
                                                color={colors.primaryGreen}
                                                style={styles.checkStyle}
                                            />
                                        )}
                                        {isChanged && (
                                            <TouchableOpacity
                                                onPress={doc.onConfirm}
                                                style={styles.confirmButton}>
                                                <Icon name="check" size={20} color={colors.white} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ) : (
                                    <>
                                        <Text style={styles.label}>{doc.documentName}</Text>
                                        <View style={styles.uploadRow}>
                                            <TouchableOpacity
                                                style={styles.fileBox}
                                                onPress={() => {
                                                    if (doc.response) {
                                                        openFileInBrowser(doc.response);
                                                    }
                                                }}
                                                disabled={!doc.response}>
                                                <Text style={styles.fileName}>
                                                    {doc.response
                                                        ? doc.documentName.trim() +
                                                        ' was successfully uploaded'
                                                        : 'Upload ' + doc.documentName}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={doc.onUploadPress}
                                                style={styles.uploadBtn}>
                                                <Icon name="upload" size={20} color={colors.white} />
                                            </TouchableOpacity>
                                            {doc.response && (
                                                <Icon
                                                    name="check"
                                                    size={20}
                                                    color={colors.primaryGreen}
                                                    style={[styles.checkStyle, {right: 60}]}
                                                />
                                            )}
                                        </View>
                                    </>
                                )}
                            </View>
                        );
                    })}

                    {dueDate && (
                        <View style={styles.dueDateContainer}>
                            <Text style={styles.dueDateText}>
                                <Text style={{fontWeight: 'bold'}}>Due date for upload: </Text>
                                {formatDateFromLocalDate(dueDate)}
                            </Text>
                        </View>
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
        marginBottom: 10,
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        color: colors.primaryBlack,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    checkStyle: {
        position: 'absolute',
        right: 10,
    },
    confirmButton: {
        marginLeft: 8,
        backgroundColor: colors.primaryGreen,
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
    },
    uploadRow: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    fileBox: {
        flex: 1,
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        padding: 12,
        height: 56,
        justifyContent: 'center',
    },
    fileName: {
        color: colors.primaryBlack,
    },
    uploadBtn: {
        marginLeft: 8,
        backgroundColor: colors.buttonUploadGray,
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
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
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        paddingHorizontal: 20,
    },
    overlayText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
});
