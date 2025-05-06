import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import {getCurrencySymbol} from "@/utils/utils";


type Purse = { fightPurse: string; winBonus: string; finishBonus: string };

type Props = {
    newOffer: Purse;
    setNewOffer: (v: Purse) => void;
    currency?: string;
};

export const MultiFightNewOfferComponent: React.FC<Props> = ({ newOffer, setNewOffer, currency }) => {
    const [editing, setEditing] = useState<keyof Purse | null>(null);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Offered Purse</Text>

            {/* назви колонок */}
            <View style={styles.row}>
                {['Fight Purse', 'Win Bonus', 'Finish Bonus'].map(label => (
                    <View key={label} style={styles.blockWrapper}>
                        <Text style={styles.columnLabel}>{label}</Text>
                    </View>
                ))}
            </View>

            {/* значення / інпути */}
            <View style={styles.row}>
                {(['fightPurse', 'winBonus', 'finishBonus'] as (keyof Purse)[]).map(field => {
                    const numericVal = newOffer[field].replace(/[^0-9]/g, '');

                    return (
                        <TouchableOpacity
                            key={field}
                            activeOpacity={1}
                            style={styles.block}
                            onPress={() => setEditing(field)}
                        >
                            {editing === field ? (
                                /*  ↳ режим вводу  */
                                <View style={styles.inputRow}>
                                    <Text style={styles.value}>{getCurrencySymbol(currency)}</Text>
                                    <TextInput
                                        value={numericVal}
                                        onChangeText={text =>
                                            setNewOffer({
                                                ...newOffer,
                                                [field]: text.replace(/[^0-9]/g, ''),
                                            })
                                        }
                                        style={styles.input}
                                        keyboardType="numeric"
                                        autoFocus
                                        onBlur={() => setEditing(null)}
                                    />
                                </View>
                            ) : (
                                /*  ↳ звичайний режим  */
                                <View style={styles.inputRow}>
                                    <Text style={styles.value}>
                                        {getCurrencySymbol(currency)}
                                        {numericVal === '' ? '0' : numericVal}
                                    </Text>
                                    <Icon name="pencil" size={16} color={colors.gray} style={{ marginLeft: 4 }} />
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

