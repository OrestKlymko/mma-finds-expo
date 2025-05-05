import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';

type PriceRowProps = {
    title?: string | undefined;
    values?: string[] | undefined;
    currency?: string | undefined;
};

export const PriceRow = ({title, values, currency}: PriceRowProps) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>

            {/* Заголовки над колонками */}
            <View style={styles.row}>
                {['Fight Purse', 'Win Bonus', 'Finish Bonus'].map(label => (
                    <View key={label} style={styles.blockLabel}>
                        <Text style={styles.columnLabel}>{label}</Text>
                    </View>
                ))}
            </View>

            {/* Значення у сірому контейнері */}
            <View style={styles.row}>
                {values?.map((value, index) => (
                    <View key={index} style={styles.block}>
                        <View style={styles.labelRow}>
                            <Text style={styles.value}>
                                {currency}
                                {value}
                            </Text>
                        </View>
                    </View>
                ))}
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
    blockLabel: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 8,
        alignItems: 'flex-start',
    },

    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    value: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.primaryBlack,
    },
    columnLabel: {
        fontSize: 13,
        color: colors.primaryBlack,
        marginBottom: 6,
    },
});
