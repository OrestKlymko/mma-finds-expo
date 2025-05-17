import {StyleSheet, Text, View} from "react-native";
import colors from "@/styles/colors";
import {getCurrencySymbol} from "@/utils/utils";
import React from "react";

type RejectedReasonSectionProps = {
    rejectionReason?: string;
};
export const RejectedReasonSection = (
    {rejectionReason}: RejectedReasonSectionProps,
) => {
    return (
        <>
            <Text style={[styles.eventTitle, {color: colors.darkError}]}>
                Offer was rejected
            </Text>
            <View style={styles.detailsContainer}>
                <Text
                    style={[
                        styles.detailLabel,
                        {marginBottom: 5, marginTop: 20, color: colors.darkError},
                    ]}>
                    Rejection Reason:
                </Text>
                <Text>{rejectionReason}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    detailsContainer: {
        borderRadius: 8,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    zebraLight: {
        backgroundColor: colors.white,
    },
    zebraDark: {
        backgroundColor: colors.lightGray,
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    detailValue: {
        fontSize: 12,
        color: colors.primaryBlack,
    },
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 24,
        marginTop: 10,
        color: colors.primaryGreen,
        position: 'relative',
    },
});
