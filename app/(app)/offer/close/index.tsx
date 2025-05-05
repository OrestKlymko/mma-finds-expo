import React from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import GoBackButton from '@/components/GoBackButton';
import {closeExclusiveOffer, closeMultiFightOffer, closeOffer,} from '@/service/service';
import {useLocalSearchParams, useRouter} from "expo-router";

const PromotionCloseOfferReasonScreen: React.FC = () => {
    const {offerId, type} = useLocalSearchParams<{
        offerId: string;
        type: 'Exclusive' | 'Multi-fight contract' | 'Single fight';
    }>();
    const router = useRouter();

    const [reason, setReason] = React.useState('');

    const handleGetStarted = () => {
        if (!reason) {
            Alert.alert('Error', 'Please provide a reason for rejection');
            return;
        }
        switch (type) {
            case 'Exclusive':
                closeExclusiveOffer(offerId, reason).then(
                    () => {
                        router.push('/(app)/(tabs)/feed')
                    },
                    () => {
                        Alert.alert('Error', 'Failed to close the offer');
                    },
                );
                break;
            case 'Multi-fight contract':
                closeMultiFightOffer(offerId, reason).then(
                    () => {
                        router.push('/(app)/(tabs)/feed')
                    },
                    () => {
                        Alert.alert('Error', 'Failed to close the offer');
                    },
                );
                break;
            default:
                closeOffer(offerId, reason).then(
                    () => {
                        router.push('/(app)/(tabs)/feed')
                    },
                    () => {
                        Alert.alert('Error', 'Failed to close the offer');
                    },
                );
                break;
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={{flex: 1, backgroundColor: colors.background}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <GoBackButton/>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.checkmarkContainer}>
                        <Icon name="close" color={colors.white} size={100}/>
                    </View>

                    <Text style={styles.title}>Offer Сlosed</Text>

                    <Text style={styles.description}>
                        We&apos;re sorry to hear that you decided to close this offer.{'\n\n'}
                        Please let us know the reason. Your feedback will be shared with all
                        managers involved in the matchmaking process to help improve future
                        negotiations.
                    </Text>

                    <FloatingLabelInput
                        label={'Reason*'}
                        value={reason}
                        onChangeText={setReason}
                        containerStyle={styles.containerInput}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default PromotionCloseOfferReasonScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 24,
    },

    checkmarkContainer: {
        width: 144,
        height: 144,
        borderRadius: 72,
        backgroundColor: colors.darkError,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },

    title: {
        fontFamily: 'Roboto',
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 29.3,
        textAlign: 'center',
        color: colors.darkError,
        marginBottom: 14,
    },

    description: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 19.34,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 20,
    },

    button: {
        backgroundColor: colors.secondaryBlack,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 32,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },

    buttonText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 18.75,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    containerInput: {
        marginBottom: 20,
        width: '100%',
        height: 56,
    },
});
