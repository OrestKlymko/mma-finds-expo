import React, {FC, useCallback, useMemo, useState} from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';
import {Country} from 'react-native-country-picker-modal';
import colors from '@/styles/colors';

type PurseType = 'Between';

interface PurseValues {
    from: string;
    to: string;
}

interface PurseModalProps {
    currentValues?: PurseValues;
    onConfirm: (type: PurseType, values: PurseValues, currency: string) => void;
    hasError?: boolean;
}

const PurseComponent: FC<PurseModalProps> = ({
                                                 currentValues,
                                                 onConfirm,
                                                 hasError,
                                             }) => {

    const [isPickerVisible, setPickerVisible] = useState(false);
    const [currency, setCurrency] = useState('EUR');
    const [purseValues, setPurseValues] = useState<PurseValues>(
        currentValues ?? {
            from: '',
            to: '',
        }
    );

    const [purseModalVisible, setPurseModalVisible] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<Country | null>();

    const handleSelect = (country: Country) => {
        setSelectedCurrency(country);
        setCurrency(country.currency[0]);
        setPickerVisible(false);
    };

    // Функція для отримання символу валюти
    const getCurrencySymbol = useCallback(() => {
        return new Intl.NumberFormat('en', {
            style: 'currency',
            currency: selectedCurrency?.currency[0] || 'EUR',
        })
            .format(0)
            .replace(/\d/g, '')
            .trim()
            .replace(/\s/g, '')
            .replace('.', '');
    }, [selectedCurrency?.currency]);

    const handleConfirm = () => {
        if (purseValues?.from === '' || purseValues?.to === '') {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        onConfirm('Between', purseValues, currency === '' ? 'EUR' : currency);
        setPurseModalVisible(false);
    };

    // Обчислюємо текст, який буде відображено у кнопці відкриття пурс-модалки
    const displayText = useMemo(() => {
        if (purseValues?.from !== '' && purseValues?.to !== '') {
            return `${getCurrencySymbol()}${purseValues?.from} - ${getCurrencySymbol()}${purseValues?.to}`;
        } else {
            return 'Purse';
        }
    }, [getCurrencySymbol, purseValues?.from, purseValues?.to]);

    function handleAlert() {
        Alert.alert(
            'Enter a purse range representing the total amount the fighter can earn from the fight, including potential win and finish bonuses. This range should reflect the minimum you’d offer to a lower-tier fighter and the maximum you’d be willing to pay to secure a top-tier fighter. Once you select a fighter, you’ll be able to specify the exact amount based on their value. The final sum will then be determined through negotiation with the fighter or their representative.',
        );
    }

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
                <TouchableWithoutFeedback
                    onPress={() => {
                        setPurseModalVisible(false);
                        Keyboard.dismiss();
                    }}
                    accessible={false}>
                    <KeyboardAvoidingView
                        style={styles.centeredOverlay}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.modalContainer}>
                                <SafeAreaView>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 10,
                                        }}>
                                        <Text style={styles.modalTitle}>Enter Purse</Text>
                                        <TouchableOpacity
                                            style={{marginLeft: 5}}
                                            onPress={handleAlert}>
                                            <Icon
                                                name="information-outline"
                                                size={20}
                                                color={colors.primaryBlack}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center', // Центрує всі елементи по горизонталі
                                            paddingVertical: 10,
                                        }}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Minimum"
                                            keyboardType="numeric"
                                            placeholderTextColor={colors.gray}
                                            value={purseValues?.from}
                                            onChangeText={text =>
                                                setPurseValues({...purseValues, from: text})
                                            }
                                        />
                                        <Text style={styles.separator}> - </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Maximum"
                                            keyboardType="numeric"
                                            placeholderTextColor={colors.gray}
                                            value={purseValues?.to}
                                            onChangeText={text =>
                                                setPurseValues({...purseValues, to: text})
                                            }
                                        />
                                        <CountryPicker
                                            withCurrency
                                            placeholder={getCurrencySymbol()}
                                            withFilter
                                            withFlag
                                            visible={isPickerVisible}
                                            onSelect={handleSelect}
                                            onClose={() => setPickerVisible(false)}
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
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
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
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.primaryBlack,
        textAlign: 'center',
    },

    purseButtonActive: {
        backgroundColor: colors.primaryBlack,
        borderColor: colors.primaryBlack,
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
        textAlign: 'center',
    },
    separator: {
        fontSize: 20, // Збільшуємо розмір символу тире
        marginHorizontal: 10, // Відступи між полями вводу
        textAlign: 'center',
        height: 40,
    },
});
