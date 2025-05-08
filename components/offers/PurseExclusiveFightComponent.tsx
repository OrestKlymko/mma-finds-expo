import React, {FC, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';
import {Country, CurrencyCode} from 'react-native-country-picker-modal';
import colors from '@/styles/colors';

interface PurseValues {
    fight: string;
    win: string;
    bonus: string;
}

interface PurseModalProps {
    currencyType: string;
    currentValues?: PurseValues;
    onConfirm: (values: PurseValues, currency: string) => void;
    hasError?: boolean;
}

const PurseComponent: FC<PurseModalProps> = ({
                                                 currencyType,
                                                 currentValues,
                                                 onConfirm,
                                                 hasError,
                                             }) => {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [currency, setCurrency] = useState('EUR');
    const [purseValues, setPurseValues] = useState<PurseValues>(
        currentValues ?? {
            win: '',
            fight: '',
            bonus: '',
        },
    );
    const [purseModalVisible, setPurseModalVisible] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<Country | null>();
    const handleSelect = (country: Country) => {
        setSelectedCurrency(country); // Беремо перший код валюти
        setCurrency(country.currency[0]); // Оновлюємо currency на основі вибору
        setPickerVisible(false);
    };

    // Функція для отримання символу валюти
    const getCurrencySymbol = (currencyCode: CurrencyCode | undefined) => {
        if (!currencyCode) currencyCode = 'EUR';
        return new Intl.NumberFormat('en', {
            style: 'currency',
            currency: currencyCode,
        })
            .format(0)
            .replace(/\d/g, '')
            .trim()
            .replace(/\s/g, '')
            .replace('.', '');
    };

    useEffect(() => {
        if (!selectedCurrency && currencyType) {
            setSelectedCurrency({ currency: [currencyType] } as Country);
        }

        if (!currency) {
            setCurrency(currencyType);
        }
    }, []);

    const handleConfirm = () => {
        if (
            purseValues.fight === '' &&
            purseValues.win === '' &&
            purseValues.bonus === ''
        ) {
            Alert.alert('Please fill in all fields');
            return;
        }
        onConfirm(purseValues, currency);
        setPurseModalVisible(false);
    };

    // Обчислюємо текст, який буде відображено у кнопці відкриття пурс-модалки
    const displayText = (() => {
        const symbol = getCurrencySymbol(selectedCurrency?.currency[0] || '');
        if (
            purseValues.fight !== '' &&
            purseValues.win !== '' &&
            purseValues.bonus !== ''
        ) {
            return `Fight: ${symbol}${purseValues.fight}, Win: ${symbol}${purseValues.win}, Finish: ${symbol}${purseValues.bonus}`;
        } else {
            return 'Select Purse';
        }
    })();

    return (
        <>
            {/* Кнопка відкриття пурс-модалки */}
            <TouchableOpacity
                style={[
                    styles.purseOpenButton,
                    hasError && {borderColor: colors.error},
                ]}
                onPress={() => setPurseModalVisible(true)}>
                <Text
                    style={[
                        styles.purseOpenButtonText,
                        hasError && {color: colors.error},
                    ]}>
                    {displayText}
                </Text>
                <Icon name="chevron-right" size={24} color={colors.primaryBlack} />
            </TouchableOpacity>

            <Modal
                visible={purseModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setPurseModalVisible(false)}>
                <KeyboardAvoidingView
                    style={styles.centeredOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss();
                            setPurseModalVisible(false);
                        }}>
                        <View style={styles.centeredOverlay}>
                            {/* Внутрішній TouchableWithoutFeedback перехоплює події,
            щоб не закривати модалку при натисканні всередині неї */}
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                {/* Огорнемо контент у ScrollView, щоб при великому вмісті він прокручувався */}
                                <View style={styles.modalContainer}>
                                    <SafeAreaView>
                                        <Text style={styles.modalTitle}>Select Purse</Text>
                                        {/* Кнопки вибору типу пурс */}
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Fight Purse</Text>
                                            <Icon
                                                name="information-outline"
                                                size={24}
                                                color={colors.primaryBlack}
                                                onPress={() => {
                                                    Alert.alert(
                                                        'Guaranteed amount paid for participating in the fight, regardless of the outcome.',
                                                    );
                                                }}
                                            />
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Amount"
                                                keyboardType="numeric"
                                                placeholderTextColor={colors.gray}
                                                value={purseValues?.fight}
                                                onChangeText={text =>
                                                    setPurseValues({...purseValues, fight: text})
                                                }
                                            />
                                            <CountryPicker
                                                withCurrency
                                                placeholder={
                                                    getCurrencySymbol(selectedCurrency?.currency[0]) ||
                                                    getCurrencySymbol(currency) ||
                                                    'Select currency'
                                                }
                                                withFilter
                                                withFlag
                                                containerButtonStyle={[
                                                    {
                                                        height: 56,
                                                        flex: 1,
                                                        marginLeft: 10,
                                                        paddingHorizontal: 20,
                                                        backgroundColor: colors.grayBackground,
                                                    },
                                                    styles.input,
                                                ]}
                                                visible={isPickerVisible}
                                                onSelect={handleSelect}
                                                onClose={() => setPickerVisible(false)}
                                            />
                                        </View>

                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Win Bonus</Text>
                                            <Icon
                                                name="information-outline"
                                                size={24}
                                                color={colors.primaryBlack}
                                                onPress={() => {
                                                    Alert.alert(
                                                        'Win Bonus is the amount of money that a fighter will receive if he wins the fight.',
                                                    );
                                                }}
                                            />
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Amount"
                                                keyboardType="numeric"
                                                placeholderTextColor={colors.gray}
                                                value={purseValues?.win}
                                                onChangeText={text =>
                                                    setPurseValues({...purseValues, win: text})
                                                }
                                            />
                                            <CountryPicker
                                                withCurrency
                                                placeholder={
                                                    getCurrencySymbol(selectedCurrency?.currency[0]) ||
                                                    getCurrencySymbol(currency) ||
                                                    'Select currency'
                                                }
                                                withFilter
                                                withFlag
                                                containerButtonStyle={[
                                                    {
                                                        height: 56,
                                                        flex: 1,
                                                        marginLeft: 10,
                                                        paddingHorizontal: 20,
                                                        backgroundColor: colors.grayBackground,
                                                    },
                                                    styles.input,
                                                ]}
                                                visible={isPickerVisible}
                                                onSelect={handleSelect}
                                                onClose={() => setPickerVisible(false)}
                                            />
                                        </View>
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Finish Bonus</Text>
                                            <Icon
                                                name="information-outline"
                                                size={24}
                                                color={colors.primaryBlack}
                                                onPress={() => {
                                                    Alert.alert(
                                                        'Extra reward for finishing the fight (e.g., KO, TKO or submission).',
                                                    );
                                                }}
                                            />
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Amount"
                                                keyboardType="numeric"
                                                placeholderTextColor={colors.gray}
                                                value={purseValues?.bonus}
                                                onChangeText={text =>
                                                    setPurseValues({...purseValues, bonus: text})
                                                }
                                            />
                                            <CountryPicker
                                                withCurrency
                                                placeholder={
                                                    getCurrencySymbol(selectedCurrency?.currency[0]) ||
                                                    getCurrencySymbol(currency) ||
                                                    'Select currency'
                                                }
                                                withFilter
                                                withFlag
                                                containerButtonStyle={[
                                                    {
                                                        height: 56,
                                                        flex: 1,
                                                        marginLeft: 10,
                                                        paddingHorizontal: 20,
                                                        backgroundColor: colors.grayBackground,
                                                    },
                                                    styles.input,
                                                ]}
                                                visible={isPickerVisible}
                                                onSelect={handleSelect}
                                                onClose={() => setPickerVisible(false)}
                                            />
                                        </View>

                                        <View style={styles.buttonsRow}>
                                            <TouchableOpacity
                                                style={styles.confirmButton}
                                                onPress={handleConfirm}>
                                                <Text style={styles.confirmButtonText}>Confirm</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </SafeAreaView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
};

export default PurseComponent;

const styles = StyleSheet.create({
    centeredOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        // alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        maxHeight: '80%', // щоби не “стискалось” і дозволяло прокрутку
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 16,
        alignSelf: 'center', // якщо alignItems: 'center' відключили
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        color: colors.primaryBlack,
        textAlign: 'center',
    },
    purseOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    purseButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.grayBackground,
        backgroundColor: colors.grayBackground,
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    purseButtonActive: {
        backgroundColor: colors.primaryBlack,
        borderColor: colors.primaryBlack,
    },
    purseButtonText: {
        fontSize: 14,
        color: colors.primaryBlack,
    },
    purseButtonTextActive: {
        color: colors.white,
        fontWeight: '500',
    },
    purseOpenButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        marginBottom: 20,
        height: 56,
    },
    purseOpenButtonText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    input: {
        borderWidth: 1,
        flex: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        color: colors.primaryBlack,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    confirmButton: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        height: 56,
        justifyContent: 'center',
        backgroundColor: colors.primaryBlack,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    separator: {
        fontSize: 20, // Збільшуємо розмір символу тире
        marginHorizontal: 10, // Відступи між полями вводу
        textAlign: 'center',
        height: 40,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        color: colors.primaryBlack,
        fontWeight: '600',
        marginRight: 4,
    },
});
