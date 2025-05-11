import {StyleSheet, Text, View} from "react-native";
import {getCurrencySymbol} from "@/utils/utils";
import React from "react";
import {SubmittedInformationOffer} from "@/service/response";
import colors from "@/styles/colors";

type MultiFightPurseGridProps = {
    submittedInformation: SubmittedInformationOffer[];
}

export const MultiFightPurseGrid = (
    {submittedInformation}: MultiFightPurseGridProps,
) => {
    return (
        <>
            {submittedInformation.map((offer, idx) => (
                <View key={offer.fightNumber ?? idx} style={{marginBottom: 20}}>
                    {/* Заголовок з номером бою */}
                    <Text style={[styles.detailLabel, {marginBottom: 15}]}>
                        Fight {offer.fightNumber}
                    </Text>

                    {/* Сама сітка */}
                    <View style={styles.detailsContainer}>
                        {[
                            {label: 'Fight Purse', value: offer.fightPurse},
                            {label: 'Win Bonus', value: offer.winPurse},
                            {label: 'Finish Bonus', value: offer.bonusPurse},
                        ].map((d, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.detailRow,
                                    i % 2 === 1 ? styles.zebraLight : styles.zebraDark,
                                ]}>
                                <Text style={styles.detailLabel}>{d.label}</Text>
                                <Text style={styles.detailValue}>
                                    {getCurrencySymbol(offer.currency)}
                                    {d.value}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    detailLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    detailValue: {
        fontSize: 12,
        color: colors.primaryBlack,
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
    detailsContainer: {
        borderRadius: 8,
        marginBottom: 16,
    },
})
