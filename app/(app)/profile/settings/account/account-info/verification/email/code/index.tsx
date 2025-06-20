import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import {Image} from 'expo-image';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import VerificationMainBanner from '@/components/verification/VerificationMainBanner';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import {sendVerificationCode} from '@/service/service';
import {useRouter} from "expo-router";

export default function VerificationPromotionCodeConfirmation() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSubmitCode = async () => {
        if (!code.trim()) return;
        try {
            setLoading(true);
            const request = {
                code: code.trim(),
            }
            await sendVerificationCode(request);
            Alert.alert('Success', 'Your code has been submitted successfully.');
            router.push('/');
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Invalid code.');
        } finally {
            setLoading(false);
            setCode('');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{flex: 1, backgroundColor: colors.background}}>
                <GoBackButton/>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <VerificationMainBanner
                        icon={<Image source={require('@/assets/verify.png')} style={styles.bannerImage}/>}
                        bg={colors.background + '20'}
                        text="Provide the 6-digit code we sent to your e-mail address"
                    />

                    <View style={styles.codeBox}>
                        <Text style={styles.codeLabel}>Enter the 6-digit code we sent to your e-mail:</Text>
                        <FloatingLabelInput
                            label={'Code*'}
                            value={code}
                            onChangeText={setCode}
                            keyboardType={'numeric'}
                            containerStyle={styles.codeInput}
                            maxLength={6}
                        />
                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleSubmitCode}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={colors.white}/>
                            ) : (
                                <Text style={styles.submitTxt}>Submit Code</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.white,
    },
    codeBox: {
        marginTop: 10,
        borderRadius: 12,
    },
    codeLabel: {
        fontSize: 14,
        color: colors.primaryBlack,
        marginBottom: 15,
    },
    codeInput: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: colors.white,
        letterSpacing: 4,
        marginBottom: 16,
    },
    submitBtn: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitTxt: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    bannerImage: {
        width: 128,
        height: 128,
        resizeMode: 'contain',
        marginBottom: 20,
    },
});