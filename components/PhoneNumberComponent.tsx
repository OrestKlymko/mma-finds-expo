import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CountryPicker} from 'react-native-country-picker-modal/lib/CountryPicker';

import React, {useEffect, useState} from 'react';
import {getExampleNumber, parsePhoneNumberFromString} from 'libphonenumber-js';
import metadata from 'libphonenumber-js/metadata.full.json';
import FloatingLabelInput from "./FloatingLabelInput";
import colors from "@/styles/colors";

interface PhoneNumberComponentProps {
    phoneNumber: string;
    setPhoneNumber: (phoneNumber: string) => void;
    hasSubmitted?: boolean;
    isRequired?: boolean;
    errorPhone: (error: string | null) => void;
}

export function PhoneNumberComponent({
                                         phoneNumber,
                                         setPhoneNumber,
                                         isRequired,
                                         hasSubmitted,
                                         errorPhone,
                                     }: PhoneNumberComponentProps) {
    const [countryCode, setCountryCode] = useState<'SK' | 'UA' | 'US'>('SK');
    const [callingCode, setCallingCode] = useState('421');
    const [isCountryPickerVisible, setCountryPickerVisible] = useState(false);
    const [localPhone, setLocalPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [exampleNumber, setExampleNumber] = useState<string | null>(null);
    const hasError = isRequired && hasSubmitted && !localPhone.trim();

    useEffect(() => {
        const example = getExampleNumber(countryCode, metadata as any);
        if (example) {
            setExampleNumber(example.formatNational());
        } else {
            setExampleNumber(null);
        }
    }, [countryCode]);

    useEffect(() => {
        if (phoneNumber) {
            const parts = phoneNumber.split(' ');
            if (parts.length > 1) {
                setCallingCode(parts[0]);
                setLocalPhone(parts.slice(1).join(' '));
            } else {
                setLocalPhone(phoneNumber);
            }
        }
    }, [phoneNumber]);

    const handlePhoneNumberChange = (newNumber: string) => {
        setLocalPhone(newNumber);
        const fullNumber = `+${callingCode}${newNumber.replace(/\D/g, '')}`;

        // Використовуємо libphonenumber-js для валідації
        const parsedNumber = parsePhoneNumberFromString(fullNumber, countryCode);
        if (!parsedNumber || !parsedNumber.isValid()) {
            setError('Invalid phone number format');
        } else {
            setError(null);
        }

        setPhoneNumber(`${callingCode} ${newNumber}`);
        errorPhone(error);
    };

    return (
        <View style={styles.phoneContainer}>
            <View style={styles.phoneRow}>
                <TouchableOpacity
                    style={styles.countryPickerButton}
                    onPress={() => setCountryPickerVisible(true)}>
                    <CountryPicker
                        withFlag={true}
                        withCallingCode
                        withFilter
                        countryCode={countryCode}
                        visible={isCountryPickerVisible}
                        onSelect={country => {
                            setCountryCode(country.cca2 as 'SK' | 'UA' | 'US');
                            setCallingCode(country.callingCode[0]);
                            setCountryPickerVisible(false);
                            setPhoneNumber(`${country.callingCode[0]} ${localPhone}`);
                        }}
                        onClose={() => setCountryPickerVisible(false)}
                    />
                    <Text style={styles.countryCode}>+{callingCode}</Text>
                </TouchableOpacity>
                <FloatingLabelInput
                    label="Phone Number*"
                    value={localPhone}
                    hasSubmitted={hasSubmitted}
                    isRequired={isRequired}
                    onChangeText={handlePhoneNumberChange}
                    containerStyle={[{flex: 2}, hasError && styles.errorBorder]}
                    keyboardType="phone-pad"
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {exampleNumber && (
                <Text style={styles.exampleText}>Example: {exampleNumber}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    phoneContainer: {
        marginBottom: 20,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countryPickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 56,
        marginRight: 10,
        backgroundColor: colors.white,
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
    exampleText: {
        color: colors.gray,
        fontSize: 14,
        marginTop: 5,
    },
    errorBorder: {
        borderColor: colors.error,
        color: colors.error,
    },
});
