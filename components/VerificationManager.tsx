import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {getVerificationStatus} from '@/service/service';
import ContentLoader from '@/components/ContentLoader';
import {Image} from "expo-image";
import {useRouter} from "expo-router";

const VerificationManagerScreen: React.FC = () => {
    const router = useRouter();
    const [verificationStatus, setVerificationStatus] = useState<
        'PENDING' | 'APPROVED' | 'REJECTED' | 'NONE'
    >();

    const [contentLoading, setContentLoading] = useState(false);

    useEffect(() => {
        setContentLoading(true);
        getVerificationStatus("manager-verification")
            .then(res => {
                setVerificationStatus(res.status);
            })
            .finally(() => {
                setContentLoading(false);
            });
    }, []);

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

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/profile/settings/account/account-info/verification/choose-document')}>
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
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
            <>
                <View style={[styles.checkmarkContainer, {backgroundColor: '#8b0808'}]}>
                    <Icon name={'close'} size={50} color={colors.white}/>
                </View>
                <Text style={styles.title}>Your verification request is rejected.</Text>
                <TouchableOpacity
                    style={[styles.button, {backgroundColor: colors.darkError, marginBottom: 10}]}
                    onPress={() => router.push('/profile/settings/account/account-info/verification/choose-document')}>
                    <Text style={styles.buttonText}>Verify Again</Text>
                </TouchableOpacity>
            </>
        );
    };

    if (contentLoading) {
        return <ContentLoader/>;
    }
    return (
        <View style={styles.mainContainer}>
            <GoBackButton/>
            <View style={styles.container}>
                {verificationStatus !== 'NONE' ? (
                    <>
                        {verificationStatus === 'PENDING' && pendingState()}
                        {verificationStatus === 'APPROVED' && verifiedState()}
                        {verificationStatus === 'REJECTED' && rejectedState()}
                    </>
                ) : (
                    nonVerifiedState()
                )}
            </View>
        </View>
    );
};

export default VerificationManagerScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 10,
    },

    mainContainer: {
        backgroundColor: colors.background,
        flex: 1,
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

    /** Заголовок */
    title: {
        fontFamily: 'Roboto',
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 29.3,
        textAlign: 'center',
        color: colors.primaryGreen,
        marginBottom: 14,
    },

    /** Опис */
    description: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 19.34,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 20,
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
        width: '80%',
    },

    buttonText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 18.75,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    notification: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 19.34,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 20,
    },
});
