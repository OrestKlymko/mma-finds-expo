import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import {declineExclusiveOffer, declineMultiFightOffer, rejectPublicOffer,} from '@/service/service';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import GoBackButton from '@/components/GoBackButton';
import {ResponsorOfferRequest} from '@/service/request';
import {useLocalSearchParams, useRouter} from "expo-router";

const RejectOffer: React.FC = () => {
    const {fighterId, offerId, typeOffer} = useLocalSearchParams<{
        fighterId: string;
        offerId: string;
        typeOffer: 'Exclusive' | 'Multi-fight contract' | 'Public';
    }>();
    const router = useRouter();
    const [reason, setReason] = React.useState('');

    const rejectExclusiveOffer = () => {
        if (!fighterId) {
            Alert.alert('Error', 'Please, go back and try again');
            return;
        }
        const data = {
            fighterId: fighterId,
            response: reason,
            typeOffer: typeOffer,
        };
        declineExclusiveOffer(offerId, data).then(() => {
            router.push('/(app)/(tabs)')
        });
    };

    const rejectMultiFightOffer = () => {
        if (!fighterId) {
            Alert.alert('Error', 'Please, go back and try again');
            return;
        }
        const data = {
            fighterId: fighterId,
            response: reason,
            typeOffer: typeOffer,
        };
        declineMultiFightOffer(offerId, data).then(() => {
            router.push('/(app)/(tabs)')
        });
    };

    const handleGetStarted = () => {
        if (!reason) {
            Alert.alert('Error', 'Please provide a reason for rejection');
            return;
        }
        switch (typeOffer) {
            case 'Exclusive':
                rejectExclusiveOffer();
                break;
            case 'Multi-fight contract':
                rejectMultiFightOffer();
                break;
            default:
                const data: ResponsorOfferRequest = {
                    offerId: offerId,
                    fighterId: fighterId,
                    rejectionReason: reason,
                };
                rejectPublicOffer(data).then(
                    () => {
                        router.push('/(app)/(tabs)')
                    },
                    () => {
                        Alert.alert('Error', 'Failed to reject the offer');
                    },
                );
                break;
        }
    };

    return (
        <View style={{backgroundColor: colors.background, flex: 1}}>
            <GoBackButton />
            <View style={styles.container}>
                {/* Галочка */}
                <View style={styles.checkmarkContainer}>
                    <Icon name="close" color={colors.white} size={100} />
                </View>

                {/* Заголовок */}
                <Text style={styles.title}>Participation Rejected</Text>

                {/* Опис */}
                <Text style={styles.description}>
                    We are sorry to hear that your rejected the offer.{'\n'}
                    Kindly provide your reason for rejection
                </Text>
                <FloatingLabelInput
                    label={'Reason*'}
                    value={reason}
                    onChangeText={setReason}
                    containerStyle={styles.containerInput}
                />
                {/* Кнопка */}
                <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                    <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RejectOffer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 24,
    },

    /** Галочка */
    checkmarkContainer: {
        width: 144,
        height: 144,
        borderRadius: 72,
        backgroundColor: colors.darkError,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },

    /** Заголовок */
    title: {
        fontFamily: 'Roboto',
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 29.3,
        textAlign: 'center',
        color: colors.darkError,
        marginBottom: 14,
    },

    /** Опис */
    description: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 19.34,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 20,
    },

    /** Кнопка */
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
