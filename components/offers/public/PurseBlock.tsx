import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {getCurrencySymbol} from "@/utils/utils";

type PurseBlockProps = {
    title: string| undefined;
    oldValue: string| undefined;
    newValue: string| undefined;
    currency: string| undefined;
};

export const PurseBlock = ({
                               title,
                               oldValue,
                               newValue,
                               currency,
                           }: PurseBlockProps) => {
    return (
        <View>
            <Text style={styles.bonusTitle}>{title}</Text>
            <View style={styles.bonusBlock}>
                {oldValue &&
                    <Text style={styles.oldValue}>
                        {getCurrencySymbol(currency)}
                        {oldValue}
                    </Text>
                }
                <Text style={styles.newValue}>
                    {getCurrencySymbol(currency)}
                    {newValue}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bonusTitle: {
        fontSize: 12,
        color: colors.primaryBlack,
        marginBottom: 10,
    },
    oldValue: {
        textDecorationLine: 'line-through',
        color: '#7D7D7D',
        fontSize: 12,
    },
    newValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#131313',
    },
    bonusBlock: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 26,
    },
});
