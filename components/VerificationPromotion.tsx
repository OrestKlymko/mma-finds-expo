import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Linking,
} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {getVerificationStatus, sendVerificationDataForPromotion} from '@/service/service';
import ContentLoader from '@/components/ContentLoader';
import {Image} from "expo-image";
import * as DocumentPicker from 'expo-document-picker';


export type VerificationState = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type VerificationMethod = 'EMAIL' | 'DOCUMENT' | null;

const VerificationPromotionScreen: React.FC = () => {
    const [status, setStatus] = useState<VerificationState | null>(null);
    const [method, setMethod] = useState<VerificationMethod>(null);
    // @ts-ignore
    const [file, setFile] = useState<DocumentPicker.Response | null>(null);
    const [contentLoading, setContentLoading] = useState(false);
    useEffect(() => {
        setContentLoading(true);
        getVerificationStatus("promotion-verification")
            .then(res => {
                setStatus(res.status);
            }).catch(() => {
            Alert.alert('Error', 'Could not load verification status.');
        })
            .finally(() => {
                setContentLoading(false);
            });
    }, []);
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
            setStatus('PENDING');
        } catch (err) {
            Alert.alert('Error', 'Could not open the file picker.');
        }
    };

    const resetFlow = () => {
        setStatus('NONE');
        setMethod(null);
        setFile(null);
    };

    const nonVerifiedState = () => {
        return (
            <>
                {/* Початковий екран без верифікації */}
                <View style={styles.checkmarkContainer}>
                    <Image
                        source={require('@/assets/verify.png')}
                        style={styles.icon}
                    />
                </View>

                <Text style={styles.title}>Account Verification</Text>

                <Text style={styles.description}>
                    To verify your profile, we need to be 100% sure{'\n'}
                    it&apos;s you. Simply follow the provided steps{'\n'}
                    to build a secure system together.
                </Text>

                {!method && (
                    <>
                        <TouchableOpacity
                            style={styles.optionCard}
                            activeOpacity={0.85}
                            onPress={() => setMethod('EMAIL')}>
                            <Text style={styles.optionTitle}>Verify via official e-mail</Text>
                            <Text style={styles.optionDesc}>(Recommended)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionCard}
                            activeOpacity={0.85}
                            onPress={() => setMethod('DOCUMENT')}>
                            <Text style={styles.optionTitle}>
                                Verify by uploading a document
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* === E-mail Instructions === */}
                {method === 'EMAIL' && (
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Instructions</Text>
                        <TouchableOpacity
                            onPress={() => Linking.openURL('mailto:info@mmafinds.com')}>
                            <Text style={styles.paragraph}>
                                Send an e-mail from your official address to
                                <Text style={styles.link}> info@mmafinds.com</Text>.
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.paragraph}>
                            Include a short note requesting the verification of your
                            organisation.
                        </Text>
                        <Text style={styles.paragraph}>
                            Our team will match the domain and verify your profile once
                            approved.
                        </Text>
                    </View>
                )}

                {/* === Upload Document === */}
                {method === 'DOCUMENT' && (
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Upload an Official Document</Text>
                        <Text style={styles.paragraph}>Accepted examples:</Text>
                        <View style={styles.bulletContainer}>
                            <Text style={styles.bullet}>• Business registry extract</Text>
                            <Text style={styles.bullet}>• Event-hosting license</Text>
                            <Text style={styles.bullet}>
                                • Certificate from a sports federation
                            </Text>
                            <Text style={styles.bullet}>• Any stamped & signed document</Text>
                        </View>

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
                                <Text style={styles.uploadButtonText}>Select Document</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </>
        );
    };

    const verifiedState = () => {
        return (
            <>
                <View
                    style={[
                        styles.checkmarkContainer,
                        {backgroundColor: colors.primaryGreen},
                    ]}>
                    <Icon name={'check'} size={50} color={colors.white}/>
                </View>
                <Text style={styles.title}>Your account is verified.</Text>
            </>
        );
    };

    const pendingState = () => {
        return (
            <>
                <View style={[styles.checkmarkContainer, {backgroundColor: '#FFA500'}]}>
                    <Icon name={'clock-outline'} size={50} color={colors.white}/>
                </View>
                <Text style={styles.title}>We are reviewing your documents.</Text>
            </>
        );
    };

    const rejectedState = () => {
        return (
            <View style={styles.alertBox}>
                <Text style={styles.alertText}>
                    Verification failed. Please try a different method.
                </Text>
                <TouchableOpacity style={styles.smallCta} onPress={resetFlow}>
                    <Text style={styles.smallCtaText}>Try again</Text>
                </TouchableOpacity>
            </View>
        );
    };
    if (contentLoading) {
        return <ContentLoader/>
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton/>
            <View style={styles.root}>
                {/* === Rejected Banner === */}
                {status === 'REJECTED' && rejectedState()}
                {status === 'APPROVED' && verifiedState()}
                {status === 'PENDING' && pendingState()}
                {status === 'NONE' && nonVerifiedState()}
            </View>
        </View>
    );
};

export default VerificationPromotionScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        backgroundColor: colors.warning,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    alertText: {
        fontSize: 14,
        color: colors.primaryBlack,
        marginBottom: 12,
    },
    smallCta: {
        backgroundColor: colors.primaryBlack,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    smallCtaText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primaryBlack,
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginBottom: 16,
    },
    section: {
        marginTop: 10,
    },
    optionCard: {
        backgroundColor: colors.grayBackground,
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        width: '100%',
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    optionDesc: {
        fontSize: 14,
        color: colors.secondaryBlack,
        marginTop: 4,
    },
    paragraph: {
        fontSize: 15,
        color: colors.secondaryBlack,
        lineHeight: 22,
        marginBottom: 10,
    },
    bulletContainer: {
        marginTop: 8,
        marginBottom: 20,
    },
    bullet: {
        fontSize: 15,
        color: colors.secondaryBlack,
        marginBottom: 6,
        marginLeft: 8,
    },
    link: {
        color: colors.primaryGreen,
        fontWeight: '600',
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
    /** Галочка */
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
    /** Опис */
    description: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 19.34,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 60,
    },

    /** Причина відмови */
    rejectionReason: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 19.34,
        textAlign: 'center',
        color: colors.error,
        marginBottom: 20,
    },

    /** Кнопка */
    button: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 17,
        paddingHorizontal: 32,
        justifyContent: 'center',
        height: 56,
        width: '100%',
    },

    buttonText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 18.75,
        textAlign: 'center',
        color: '#FFFFFF',
    },
});
