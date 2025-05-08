import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from '@/context/AuthContext';
import {
    createPaymentIntentForCharge,
    featureFighterOnOffer,
    featureYourOffer,
    getCredit,
    payForCredit,
    setDefaultPaymentMethod,
} from '@/service/service';
import {initPaymentSheet, presentPaymentSheet,} from '@stripe/stripe-react-native';
import {PayCreditRequest} from '@/service/request';
import {useLocalSearchParams, useRouter} from "expo-router";

type CreditOption = {
    id: number;
    label: string;
    price: string;
}

const manager:CreditOption[] = [
    {id: 1, label: '1', price: '9,99'},
    {id: 5, label: '5', price: '39,99'},
    {id: 10, label: '10', price: '69,99'},
];

const promotion:CreditOption[] = [
    {id: 1, label: '1', price: '99,99'},
    {id: 5, label: '5', price: '399,99'},
    {id: 10, label: '10', price: '699,99'},
];

const ChooseCreditOptionScreen = () => {

    const {role} = useAuth();
    const [selectedOption, setSelectedOption] = useState<number | null>(1);
    const insets = useSafeAreaInsets();
    const [featuringCredit, setFeaturingCredit] = useState(0);
    const [loading, setLoading] = useState(false);
    const [creditOptions, setCreditOptions] = useState<CreditOption[]>();
    const {offerId, fighterId} = useLocalSearchParams<{
        offerId?: string;
        fighterId?: string;
    }>();
    const router = useRouter();


    useEffect(() => {
        if (role === 'MANAGER') {
            setCreditOptions(manager);
        } else {
            setCreditOptions(promotion);
        }
        getCredit().then(res => {
            setFeaturingCredit(res.featuringCredit);
        });
    }, [role]);

    const handleOptionSelect = (id: number) => {
        setSelectedOption(id);
    };

    const handlePayNow = async () => {
        if (selectedOption !== null) {
            const selectedCredit = creditOptions?.find(
                option => option.id === selectedOption,
            );
            if(!selectedCredit) {
                Alert.alert('Error', 'Credit option not found');
                return;
            }

            const data: PayCreditRequest = {
                credit: selectedCredit?.label,
                valueToPay: selectedCredit?.price.replace(',', '.'),
            };

            setLoading(true);

            try {
                await payForCredit(data);
                if (offerId && fighterId) {
                    await featureFighterOnOffer(offerId, fighterId);
                } else if (offerId) {
                    await featureYourOffer(offerId);
                }
                router.push('/(app)/(tabs)')
            } catch {
                const paymentData = {
                    price: selectedCredit?.price.replace(',', '.'),
                };

                const {clientSecret} = await createPaymentIntentForCharge(paymentData);
                // Ініціалізуємо PaymentSheet
                const {error: initError} = await initPaymentSheet({
                    paymentIntentClientSecret: clientSecret,
                    merchantDisplayName: 'MMA Finds',
                    merchantCountryCode: 'SK',
                    style: 'automatic',
                    primaryButtonColor: colors.primaryGreen,
                    applePay: {merchantCountryCode: 'SK'},
                    googlePay: {
                        merchantCountryCode: 'SK',
                        currencyCode: 'EUR',
                        testEnv: true, // Видалити у продакшені
                    },
                });

                if (initError) {
                    Alert.alert('Error', 'Failed to initialize payment sheet');
                    return;
                }

                // Відкриваємо PaymentSheet
                const {error: presentError} = await presentPaymentSheet();

                if (presentError) {
                    Alert.alert('Payment failed', 'Please enter valid payment details');
                } else {
                    await setDefaultPaymentMethod().then(async () => {
                        await payForCredit(data);
                        if (offerId && fighterId) {
                            await featureFighterOnOffer(offerId, fighterId);
                        } else if (offerId) {
                            await featureYourOffer(offerId);
                        }
                        router.push('/(app)/(tabs)')
                    });
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                {/* Title Section */}
                <Text style={styles.title}>Choose Credit Option</Text>
                <Text style={styles.subtitle}>
                    You currently have{' '}
                    <Text style={styles.greenText}>{featuringCredit}</Text> credits left.
                    {'\n'}
                    To feature your fighter, please purchase credits.
                </Text>

                {/* Credit Options */}
                <View style={styles.optionsContainer}>
                    {creditOptions &&
                        creditOptions.map(option => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.creditOption,
                                    selectedOption === option.id && styles.selectedOption,
                                ]}
                                onPress={() => handleOptionSelect(option.id)}>
                                <Text
                                    style={[
                                        styles.optionTitle,
                                        selectedOption === option.id && styles.selectedText,
                                    ]}>
                                    {option.label}{' '}
                                    {option.label === '1' ? 'Feature Credit' : 'Feature Credits'}
                                </Text>
                                <Text
                                    style={[
                                        styles.optionPrice,
                                        selectedOption === option.id && styles.selectedText,
                                    ]}>
                                    €{option.price}
                                </Text>
                            </TouchableOpacity>
                        ))}
                </View>

                {/* Pay Now Button */}
                <TouchableOpacity
                    style={[
                        styles.payButton,
                        selectedOption === null && styles.payButtonDisabled,
                    ]}
                    onPress={handlePayNow}
                    disabled={selectedOption === null || loading}>
                    {loading ? (
                        <ActivityIndicator color={colors.white} size="small"/>
                    ) : (
                        <Text style={styles.payButtonText}>Pay Now</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ChooseCreditOptionScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },

    /** Title Section **/
    title: {
        fontSize: 25,
        lineHeight: 30,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 8,
        marginTop: 50,
    },
    subtitle: {
        fontWeight: '400',
        fontFamily: 'Roboto',
        fontSize: 16,
        color: colors.primaryBlack,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    greenText: {
        color: colors.primaryGreen,
        fontWeight: '600',
    },

    /** Credit Options **/
    optionsContainer: {
        gap: 12,
    },
    creditOption: {
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingVertical: 30,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: colors.primaryGreen,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 22,
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
    },
    optionPrice: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 22,
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
    },
    selectedText: {
        color: colors.white,
    },

    /** Pay Now Button **/
    payButton: {
        marginTop: 30,
        backgroundColor: colors.primaryBlack,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
    },
    payButtonDisabled: {
        backgroundColor: colors.gray,
    },
    payButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});
