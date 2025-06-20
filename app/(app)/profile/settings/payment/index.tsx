import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CardInfoResponse} from "@/service/response";
import {
    createPaymentIntentWithoutCharge,
    detachPaymentMethod,
    getPaymentMethods,
    setDefaultPaymentMethodById, setDefaultPaymentMethodStripe
} from "@/service/service";
import colors from "@/styles/colors";
import GoBackButton from "@/components/GoBackButton";
import {useStripe} from "@stripe/stripe-react-native";


const PaymentMethodsScreen = () => {
    const insets = useSafeAreaInsets();
    const [paymentMethods, setPaymentMethods] = useState<CardInfoResponse[]>([]);
    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const [loading, setLoading] = useState(false);


    const loadPaymentMethods = async () => {
        setLoading(true);
        try {
            const methods = await getPaymentMethods();
            setPaymentMethods(methods);
        } catch (error) {
            Alert.alert('Error', 'Failed to load payment methods');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPaymentMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleSetDefault = async (id: string) => {
        try {
            await setDefaultPaymentMethodById(id);
            Alert.alert('Success', 'Default payment method updated');
            await loadPaymentMethods();
        } catch (error) {
            Alert.alert('Error', 'Failed to update default method');
        }
    };

    const handleDeleteMethod = async (id: string) => {
        Alert.alert(
            'Delete Payment Method',
            'Are you sure you want to delete this payment method?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await detachPaymentMethod(id);
                            Alert.alert('Success', 'Payment method deleted successfully');
                            loadPaymentMethods();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete payment method');
                        }
                    },
                },
            ],
        );
    };

    /**
     * Додавання нового платіжного методу
     */
    const handleAddPaymentMethod = async () => {
        try {
            const {clientSecret, customerId} = await createPaymentIntentWithoutCharge();

            const {error: initError} = await initPaymentSheet({
                setupIntentClientSecret: clientSecret,
                merchantDisplayName: 'MMA Finds',
                customerId: customerId,
                style: 'automatic',
                returnURL: 'com.mmafinds.app://stripe-redirect',
                applePay: {
                    merchantCountryCode: 'SK',
                },
                googlePay: {
                    merchantCountryCode: 'SK',
                    currencyCode: 'EUR',
                    testEnv: true,
                },
            });
            console.log(initError);
            if (initError) {
                Alert.alert('Error', `Failed to initialize: ${initError.message}`);
                return;
            }

            // Показуємо PaymentSheet
            const {error: paymentSheetError} = await presentPaymentSheet();
            console.log(paymentSheetError);

            if (paymentSheetError) {
                Alert.alert(
                    'Error',
                    `Failed to present Payment Sheet: ${paymentSheetError.message}`,
                );
                return;
            }


            setDefaultPaymentMethodStripe({clientSecret});
            await loadPaymentMethods();
        } catch (error: any) {
            Alert.alert('Error', 'Failed to add payment method');
        }
    };

    /**
     * Відображення компоненту
     */
    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton/>
            <View
                style={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <Text style={styles.title}>Payment Methods</Text>
                {paymentMethods.length > 0 && (
                    <Text style={styles.subtitle}>Payment options</Text>
                )}
                {paymentMethods.length === 0 && !loading && (
                    <Text style={styles.paymentAvailable}>
                        No payment methods available
                    </Text>
                )}
                {!loading ? (
                    <FlatList
                        data={paymentMethods}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <View style={[styles.card, item.isDefault && styles.defaultCard]}>
                                <Icon
                                    name="credit-card-outline"
                                    size={24}
                                    color={colors.primaryBlack}
                                />
                                <Text style={styles.cardText}>
                                    {item.brand.toUpperCase()} •••• {item.last4}
                                </Text>
                                <View style={styles.actions}>
                                    {item.isDefault ? (
                                        <Text style={styles.defaultTag}>Default</Text>
                                    ) : (
                                        <TouchableOpacity onPress={() => handleSetDefault(item.id)}>
                                            <Text style={styles.setDefault}>Set as Default</Text>
                                        </TouchableOpacity>
                                    )}
                                    {/* Кнопка Delete для будь-якої карти */}
                                    <TouchableOpacity onPress={() => handleDeleteMethod(item.id)}>
                                        <Text style={styles.delete}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                ) : (
                    <ActivityIndicator size="large" color={colors.primaryGreen}/>
                )}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddPaymentMethod}>
                    <Text style={styles.addButtonText}>Add Payment Method</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PaymentMethodsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 50,
    },
    subtitle: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginBottom: 16,
        fontWeight: '500',
        fontFamily: 'Roboto',
        marginLeft: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    defaultCard: {
        borderWidth: 1,
        borderColor: colors.primaryGreen,
        backgroundColor: '#E6F5EA',
    },
    cardText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    defaultTag: {
        backgroundColor: colors.primaryGreen,
        color: colors.white,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        fontSize: 12,
        fontWeight: '500',
    },
    setDefault: {
        color: colors.primaryGreen,
        fontWeight: '400',
        fontFamily: 'Roboto',
        fontSize: 12,
    },
    delete: {
        color: 'red',
        fontWeight: '500',
        fontFamily: 'Roboto',
        fontSize: 12,
        marginLeft: 8,
    },
    addButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 30,
    },
    addButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    paymentAvailable: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.primaryBlack,
        marginTop: 50,
    },
});
