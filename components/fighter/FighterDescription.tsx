import {StyleSheet, Text} from 'react-native';
import React from 'react';
import colors from "@/styles/colors";

type FighterDescriptionProps = {
    description?: string;
}
export const FighterDescription = (
    {description}: FighterDescriptionProps,
) => {
    return (
        <>
            <Text style={styles.sectionTitle}>About the Fighter</Text>
            <Text style={styles.fighterDescription}>
                {description || 'No description provided. '}
            </Text>
        </>
    );
};
const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 12,
        marginTop: 14,
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 8,
    },
    fighterDescription: {
        fontSize: 11,
        color: colors.gray,
        fontFamily: 'Roboto',
        fontWeight: '400',
        lineHeight: 17,
        marginBottom: 16,
        textAlign: 'justify',
    },
});
