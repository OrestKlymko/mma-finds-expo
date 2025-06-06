import {StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import React from 'react';
import {getCurrencySymbol} from "@/utils/utils";

type Purse ={
    fightPurse: string;
    winBonus: string;
    finishBonus: string;
}
type NewOfferComponentProps = {
    newOffer: Purse
    setNewOffer: (newOffer: Purse) => void;
    currency?: string;
    editingField: string | null;
    setEditingField: (editedField: string | null) => void;
}

export const NewOfferComponent = (
    {newOffer, setNewOffer, editingField, setEditingField, currency}: NewOfferComponentProps,
) => {
    return (

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Offered Purse</Text>

            <View style={styles.row}>
                {['Fight Purse', 'Win Bonus', 'Finish Bonus'].map(label => (
                    <View key={label} style={styles.blockWrapper}>
                        <Text style={styles.columnLabel}>{label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.row}>
                {(['fightPurse', 'winBonus', 'finishBonus'] as (keyof Purse)[]).map(field => {
                    const numericValue = newOffer[field].replace(/[^0-9]/g, '');
                    return (
                        <TouchableOpacity
                            key={field}
                            activeOpacity={1}
                            style={styles.block}
                            onPress={() => setEditingField(field)}>
                            {editingField === field ? (
                                <View style={styles.inputRow}>
                                    <Text style={styles.value}>
                                        {getCurrencySymbol(currency)}
                                    </Text>
                                    <TextInput
                                        value={numericValue}
                                        onChangeText={text => {
                                            const onlyNums = text.replace(/[^0-9]/g, '');
                                            const updatedOffer: Purse = {
                                                ...newOffer,
                                                [field]: onlyNums,
                                            };
                                            setNewOffer(updatedOffer);
                                        }}
                                        style={styles.input}
                                        keyboardType="numeric"
                                        autoFocus
                                        onBlur={() => setEditingField(null)}
                                    />
                                </View>
                            ) : (
                                <View style={styles.inputRow}>
                                    <Text style={styles.value}>
                                        {getCurrencySymbol(currency)}
                                        {numericValue === '' ? '0' : numericValue}
                                    </Text>
                                    <Icon
                                        name="pencil"
                                        size={16}
                                        color={colors.gray}
                                        style={{marginLeft: 4}}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.primaryBlack,
    },
    blockWrapper: {
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'flex-start',
    },
    input: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primaryBlack,
        paddingVertical: 0,
        paddingHorizontal: 0,
        margin: 0,
        height: 22,
        textAlignVertical: 'center',
        minWidth: 40,
    },
    block: {
        flex: 1,
        backgroundColor: colors.grayBackground,
        padding: 10,
        marginHorizontal: 4,
        borderRadius: 8,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },
    columnLabel: {
        fontSize: 13,
        color: colors.primaryBlack,
        marginBottom: 6,
    },
});
