import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons as Icon} from "@expo/vector-icons";
import colors from "@/styles/colors";
import React, {useState} from "react";
import {sendVerificationDataForPromotion} from "@/service/service";
import * as DocumentPicker from 'expo-document-picker';
import GoBackButton from "@/components/GoBackButton";
import {Image} from "expo-image";


export const VerificationPromotionTypeDocuments = () => {

    // @ts-ignore
    const [file, setFile] = useState<DocumentPicker.Response | null>(null);

    const pickDocument = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });
            if (res.canceled) return;
            setFile(res);
            const formData = new FormData();
            formData.append('document', {
                uri: res.assets?.[0]?.uri,
                type: res.assets?.[0]?.mimeType || 'application/octet-stream',
                name: res.assets?.[0]?.name,
            } as any);
            await sendVerificationDataForPromotion(formData);
        } catch (err) {
            Alert.alert('Error', 'Could not open the file picker.');
        }
    };

    return <View style={{flex: 1, backgroundColor: colors.background}}>
        <GoBackButton/>

        <View style={styles.container}>
            <Image
                source={require('@/assets/verify.png')}
                style={styles.icon}
            />

            <Text style={styles.title}>Account Verification</Text>
            <View style={styles.section}>
                <Text style={styles.paragraph}>If you don’t have an official email with your promotion’s domain, please
                    upload any non-public legal document that includes the promotion’s name and clearly indicates that only the promotion itself would have access to
                    such a document.</Text>

                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={pickDocument}>
                    {file ? (
                        <View style={styles.fileInfo}>
                            <Icon
                                name="file-document"
                                size={20}
                                color={colors.primaryGreen}
                            />
                            <Text style={styles.fileName}>
                                We received your document. We&apos;ll review it shortly.
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.uploadButtonText}>Upload Document</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    section: {
        marginTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 15,
        color: colors.secondaryBlack,
        lineHeight: 22,
        marginBottom: 10,
    },
    uploadButton: {
        marginTop: 16,
        backgroundColor: colors.grayBackground,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadButtonText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileName: {
        fontSize: 12,
        color: colors.primaryBlack,
        marginLeft: 8,
    },
    checkmarkContainer: {
        width: 144,
        height: 144,
        borderRadius: 72,
        backgroundColor: colors.primaryGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },

    /** Іконка */
    icon: {
        width: 163,
        height: 163,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primaryBlack,
        marginBottom: 24,
    },
});