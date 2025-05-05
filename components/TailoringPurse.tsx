import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import React from 'react';
import {Country} from 'react-native-country-picker-modal';
import {CurrencyComponent} from "@/components/CurrencyComponent";

type TailoringPurseProps = {
    purseValues: {
        fight: string;
        win: string;
        bonus: string;
    };
    setPurseValues: React.Dispatch<
        React.SetStateAction<{
            fight: string;
            win: string;
            bonus: string;
        }>
    >;
    currencyChoosen: string;
    setCurrencyChoosen: React.Dispatch<React.SetStateAction<string>>;
};

export const TailoringPurse = ({
                                   purseValues,
                                   setPurseValues,
                                   currencyChoosen,
                                   setCurrencyChoosen,
                               }: TailoringPurseProps) => {
    const handleSelect = (country: Country) => {
        setCurrencyChoosen(country.currency[0]); // Оновлюємо currency на основі вибору
    };

    return (
        <>
            <Text
                style={[
                    styles.sectionTitle,
                    {marginBottom: 29, fontSize: 20, fontWeight: '600'},
                ]}>
                Purse
            </Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fight Purse</Text>
                <Icon
                    name="information-outline"
                    size={20}
                    color={colors.primaryBlack}
                    onPress={() => {
                        Alert.alert(
                            'Guaranteed amount paid for participating in the fight, regardless of the outcome.',
                        );
                    }}
                />
            </View>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Value"
                    keyboardType="numeric"
                    placeholderTextColor={colors.gray}
                    value={purseValues.fight}
                    onChangeText={text => setPurseValues({...purseValues, fight: text})}
                />
                <CurrencyComponent
                    initialCurrency={currencyChoosen}
                    onSelect={handleSelect}
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
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Value"
                    keyboardType="numeric"
                    placeholderTextColor={colors.gray}
                    value={purseValues.win}
                    onChangeText={text => setPurseValues({...purseValues, win: text})}
                />
                <CurrencyComponent
                    initialCurrency={currencyChoosen}
                    onSelect={handleSelect}
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
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Value"
                    keyboardType="numeric"
                    placeholderTextColor={colors.gray}
                    value={purseValues.bonus}
                    onChangeText={text => setPurseValues({...purseValues, bonus: text})}
                />
                <CurrencyComponent
                    initialCurrency={currencyChoosen}
                    onSelect={handleSelect}
                />
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryBlack,
        marginRight: 5,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: colors.primaryBlack,
        backgroundColor: 'rgb(240, 240, 240)',
        height: 56,
    },
});
