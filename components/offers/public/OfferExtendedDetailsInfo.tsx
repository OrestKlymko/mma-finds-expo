import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';

import {Benefit} from '@/service/response';
import {getCurrencySymbol} from "@/utils/utils";
import {BenefitRenderComponent} from "@/components/offers/BenefitRenderComponent";

type Prop = {
    offer: any;
    benefits: Benefit | undefined | null;
};
const OfferExtendedDetailsInfo = ({offer, benefits}: Prop) => {
    const [moreInfoVisible, setMoreInfoVisible] = useState(false);

    const details = [
        {label: 'Sport', value: offer?.sportType},
        {
            label: 'Rules',
            value: offer?.mmaRules === 'PROFESSIONAL' ? 'Professional' : 'Amateur',
        },
        ...(offer?.purse
            ? [
                {
                    label: 'Purse',
                    value: offer?.purse + getCurrencySymbol(offer?.currency),
                },
            ]
            : [
                {
                    label: 'Purse Win',
                    value: offer?.purseWin + getCurrencySymbol(offer?.currency),
                },
                {
                    label: 'Purse Fight',
                    value: offer?.purseFight + getCurrencySymbol(offer?.currency),
                },
                {
                    label: 'Purse Bonus',
                    value: offer?.purseBonus + getCurrencySymbol(offer?.currency),
                },
            ]),
    ];

    return (
        <View>
            <TouchableOpacity
                style={styles.moreInfoButton}
                onPress={() => setMoreInfoVisible(!moreInfoVisible)}>
                <Text style={styles.moreInfoButtonText}>More Information</Text>
                <Icon
                    name={moreInfoVisible ? 'chevron-down' : 'chevron-right'}
                    size={20}
                    color={colors.primaryGreen}
                />
            </TouchableOpacity>

            {moreInfoVisible && (
                <View style={styles.detailsContainer}>
                    {details
                        .filter(
                            detail =>
                                detail.value && detail.value !== 'N/A' && detail.value !== '0',
                        )
                        .map((detail, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.detailRow,
                                    index % 2 === 0 ? styles.zebraLight : styles.zebraDark,
                                ]}>
                                <Text style={styles.detailLabel}>{detail.label}</Text>
                                <Text style={styles.detailValue}>{detail.value}</Text>
                            </View>
                        ))}

                    {[
                        {label: 'Gender', value: offer?.gender},
                        {label: 'Weight Class', value: offer?.weightClass},
                        {label: 'Based In', value: offer?.country},
                        {label: 'Minimum Fights', value: offer?.minFights},
                        {label: 'Maximum Fights', value: offer?.maxFights},
                        {label: 'Minimum Win/Loss Ratio', value: offer?.winLoseCount},
                        {label: 'Fight Length', value: offer?.rounds+' Rounds '+": "+offer.minutes+' Minutes'},
                        {label: 'Additional Information', value: offer?.description},
                    ]
                        .filter(
                            detail =>
                                detail.value && detail.value !== 'N/A' && detail.value !== '0',
                        )
                        .map((detail, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.detailRow,
                                    index % 2 === 0 ? styles.zebraLight : styles.zebraDark,
                                ]}>
                                <Text style={styles.detailLabel}>{detail.label}</Text>
                                <Text style={styles.detailValue}>{detail.value}</Text>
                            </View>
                        ))}
                    <BenefitRenderComponent benefits={benefits}/>
                </View>
            )}
        </View>
    );
};

export default OfferExtendedDetailsInfo;

const styles = StyleSheet.create({
    moreInfoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        justifyContent: 'space-between',
    },
    moreInfoButtonText: {
        fontSize: 14,
        color: colors.primaryGreen,
        marginRight: 6,
    },
    greenSectionHeader: {
        paddingVertical: 10,
        borderRadius: 8,
    },
    greenSectionHeaderText: {
        fontSize: 14,
        fontWeight: '600',
    },
    detailsContainer: {
        borderRadius: 8,
        marginBottom: 8,
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
        fontSize: 12,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    detailValue: {
        fontSize: 12,
        color: colors.primaryBlack,
    },
});
