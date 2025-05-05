import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {CountryPicker} from 'react-native-country-picker-modal/lib/CountryPicker';
import {Country, CurrencyCode} from 'react-native-country-picker-modal';
import {getCurrencySymbol} from '@/utils/utils';

type CurrencyComponentProps = {
    initialCurrency: CurrencyCode;
    onSelect: (country: Country) => void;
};

export const CurrencyComponent: React.FC<CurrencyComponentProps> = ({
                                                                        initialCurrency,
                                                                        onSelect,
                                                                    }) => {
    const [isPickerVisible, setPickerVisible] = useState(false);

    const handleSelect = (country: Country) => {
        setPickerVisible(false);
        onSelect(country);
    };

    const displayedCurrencySymbol = getCurrencySymbol(initialCurrency);

    return (
        <CountryPicker
            withCurrency
            withFilter
            withFlag
            visible={isPickerVisible}
            onSelect={handleSelect}
            onClose={() => setPickerVisible(false)}
            renderFlagButton={({}) => {
                return (
                    <TouchableOpacity
                        onPress={() => setPickerVisible(true)}
                        style={styles.countryPickerCustomButton}>
                        <Text style={styles.countryPickerCustomText}>
                            {displayedCurrencySymbol}
                        </Text>
                    </TouchableOpacity>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    countryPickerCustomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgb(101,101,101)', // або colors.priceGray
        borderRadius: 8,
        paddingHorizontal: 20,
        height: 56,
        justifyContent: 'center',
        marginLeft: 8,
    },
    countryPickerCustomText: {
        color: 'white',
        fontSize: 16,
    },
});
