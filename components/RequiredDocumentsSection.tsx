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
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import FloatingLabelInput from '@/components/FloatingLabelInput';
import { formatDateFromLocalDate } from '@/utils/utils';
import colors from '@/styles/colors';

export interface DocumentRow {
    documentId:    string;
    documentName:  string;
    documentType:  'FILE' | 'TEXT';
    response:      string;          // value the user is editing
    originalValue: string;          // value that came from backend
    isLoading:     boolean;
    hasSuccess:    boolean;
    onUpload:      () => void;
    onChangeText:  (t: string) => void;
    onConfirm:     () => void;
}

interface Props {
    rows: DocumentRow[];
    dueDate?: string;
}

export const RequiredDocumentsSection: React.FC<Props> = ({
                                                              rows,
                                                              dueDate,
                                                          }) => {
    /* helpers ---------------------------------------------------- */
    const openFile = async (url: string) => {
        try {
            const r = await WebBrowser.openBrowserAsync(url);
            if (r.type !== 'opened') {
                Alert.alert('Error', 'Could not open the file');
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'An error occurred while opening the file.');
        }
    };

    /* render ----------------------------------------------------- */
    const deadlinePassed =
        dueDate ? new Date(dueDate) < new Date() : false;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Required Documents</Text>

                    {deadlinePassed && (
                        <View style={styles.overlay}>
                            <Text style={styles.overlayTxt}>
                                Deadline has passed. Please contact promotion.
                            </Text>
                        </View>
                    )}

                    {rows.map((row) => {
                        const changed   = row.response !== row.originalValue;
                        const uploading = row.isLoading;

                        return (
                            <View key={row.documentId} style={styles.docBlock}>
                                {row.documentType === 'TEXT' ? (
                                    /* -------- TEXT ROW -------------------------------- */
                                    <View style={styles.row}>
                                        <FloatingLabelInput
                                            label={row.documentName}
                                            value={row.response}
                                            onChangeText={row.onChangeText}
                                            containerStyle={{ flex: 1 }}
                                        />

                                        {!changed && row.response && row.hasSuccess && (
                                            <Icon
                                                name="check"
                                                size={20}
                                                color={colors.primaryGreen}
                                                style={styles.checkIcon}
                                            />
                                        )}

                                        {changed && !uploading && (
                                            <TouchableOpacity
                                                onPress={row.onConfirm}
                                                style={styles.confirmBtn}
                                            >
                                                <Icon name="check" size={20} color={colors.white} />
                                            </TouchableOpacity>
                                        )}

                                        {uploading && (
                                            <ActivityIndicator
                                                size="small"
                                                color={colors.primaryGreen}
                                                style={styles.spinner}
                                            />
                                        )}
                                    </View>
                                ) : (
                                    /* -------- FILE ROW -------------------------------- */
                                    <>
                                        <Text style={styles.label}>{row.documentName}</Text>

                                        <View style={styles.fileRow}>
                                            <TouchableOpacity
                                                style={styles.fileBox}
                                                onPress={() => row.response && openFile(row.response)}
                                                disabled={!row.response}
                                            >
                                                <Text style={styles.fileName}>
                                                    {row.response
                                                        ? `${row.documentName} uploaded`
                                                        : `Upload ${row.documentName}`}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={row.onUpload}
                                                style={[
                                                    styles.uploadBtn,
                                                    uploading && { opacity: 0.6 },
                                                ]}
                                                disabled={uploading}
                                            >
                                                {uploading ? (
                                                    <ActivityIndicator size="small" color={colors.white} />
                                                ) : (
                                                    <Icon name="upload" size={20} color={colors.white} />
                                                )}
                                            </TouchableOpacity>

                                            {row.hasSuccess && !uploading && (
                                                <Icon
                                                    name="check"
                                                    size={20}
                                                    color={colors.primaryGreen}
                                                    style={[styles.checkIcon, { right: 60 }]}
                                                />
                                            )}
                                        </View>
                                    </>
                                )}
                            </View>
                        );
                    })}

                    {dueDate && (
                        <View style={styles.dueBox}>
                            <Text style={styles.dueTxt}>
                                <Text style={{ fontWeight: 'bold' }}>Due date: </Text>
                                {formatDateFromLocalDate(dueDate)}
                            </Text>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

/* ---------------- styles ------------------------------------- */
const styles = StyleSheet.create({
    container:     { marginTop: 20 },
    title:         { fontWeight: '600', fontSize: 13, marginBottom: 16, color: colors.primaryBlack },
    docBlock:      { marginBottom: 12 },
    row:           { flexDirection: 'row', alignItems: 'center', position: 'relative' },
    fileRow:       { flexDirection: 'row', alignItems: 'center', position: 'relative' },
    label:         { marginBottom: 8, fontSize: 14, color: colors.primaryBlack },
    fileBox:       { flex: 1, backgroundColor: colors.lightGray, borderRadius: 8, padding: 12, height: 56, justifyContent: 'center' },
    fileName:      { color: colors.primaryBlack },
    uploadBtn:     { marginLeft: 8, backgroundColor: colors.buttonUploadGray, padding: 10, borderRadius: 8, height: 56, justifyContent: 'center', alignItems: 'center' },
    confirmBtn:    { marginLeft: 8, backgroundColor: colors.primaryGreen, padding: 10, borderRadius: 8, height: 56, justifyContent: 'center', alignItems: 'center' },
    checkIcon:     { position: 'absolute', right: 10 },
    spinner:       { position: 'absolute', right: 16 },
    dueBox:        { marginTop: 10, backgroundColor: colors.lightGray, padding: 12, borderRadius: 8, height: 56, justifyContent: 'center', alignItems: 'center' },
    dueTxt:        { fontSize: 15, color: colors.primaryBlack },
    overlay:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 10, paddingHorizontal: 20 },
    overlayTxt:    { textAlign: 'center', fontSize: 16, fontWeight: '600', color: colors.primaryBlack },
});
