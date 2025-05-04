import {StyleSheet, Text, View} from "react-native";
import React from "react";
import colors from "@/styles/colors";

type EventPromotionNameProps = {
    organizationName: string|null;
}

export const EventPromotionName = (
    {organizationName}: EventPromotionNameProps
) => {
    return <>
        <Text style={styles.titleProfile}>Promotion*</Text>
        <View style={styles.grayField}>
            <Text style={styles.grayFieldTextManager}>{organizationName??''}</Text>
        </View></>;
};

const styles = StyleSheet.create({
    titleProfile: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 19,
        marginBottom: 12,
        color: 'rgb(19, 19, 19)',
    },
    grayField: {
        width: '100%',
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        height: 56,
        marginBottom: 15,
    },
    grayFieldTextManager: {
        fontSize: 16,
        color: colors.primaryBlack,
        paddingVertical: 8,
    },
})
