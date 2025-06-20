import {Linking, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {FighterInfoResponse} from '@/service/response';

export const FighterCharacters = ({fighter}: { fighter: FighterInfoResponse | null | undefined }) => {
    return (
        <View style={styles.detailsContainer}>
            {[
                {label: 'Gender', value: fighter?.gender},
                {label: 'Age', value: fighter?.age ? `${fighter.age} years` : null},
                {label: 'Weight Class', value: fighter?.weightClass},
                {
                    label: 'Weight (Kg)',
                    value: fighter?.weightKg,
                },
                {
                    label: 'Weight (Lbs)',
                    value: fighter?.weightLbs,
                },
                {
                    label: 'Height (Cm)',
                    value: fighter?.heightCm,
                },
                {
                    label: 'Height (Feet)',
                    value: `${fighter?.heightFeet} ft ${fighter?.heightInches} in`,
                },
                {
                    label: 'Reach (Cm)',
                    value: fighter?.reachCm,
                },
                {
                    label: 'Reach (Feet)',
                    value: `${fighter?.reachFeet} ft ${fighter?.reachInches} in`,
                },

                {label: 'Gym Name', value: fighter?.gymName},
                {label: 'Nationality', value: fighter?.nationality},
                {label: 'Based In', value: fighter?.countryName},
                {label: 'Foundation Style', value: fighter?.foundationStyle},
                {
                    label: 'Tapology Link',
                    value: fighter?.tapologyLink ? 'Click to Open' : null,
                    link: fighter?.tapologyLink,
                },
                {
                    label: 'Sherdog Link',
                    value: fighter?.sherdogLink ? 'Click to Open' : null,
                    link: fighter?.sherdogLink,
                },
                {
                    label: 'Instagram',
                    value: fighter?.instagram && `@${new URL(fighter?.instagram).pathname.replace(/^\/+|\/+$/g, '')}`,
                    link: fighter?.instagram
                },
                {
                    label: 'Facebook',
                    value: fighter?.facebook && `@${new URL(fighter?.facebook).pathname.replace(/^\/+|\/+$/g, '')}`,
                    link: fighter?.facebook
                },
                {
                    label: 'Twitter/X',
                    value: fighter?.twitter && `@${new URL(fighter?.twitter).pathname.replace(/^\/+|\/+$/g, '')}`,
                    link: fighter?.twitter
                },
                {
                    label: 'Snapchat',
                    value: fighter?.snapchat && `@${new URL(fighter?.snapchat).pathname.replace(/^\/+|\/+$/g, '')}`,
                    link: fighter?.snapchat
                },
            ]
                .filter(
                    detail =>
                        detail.value && detail.value !== 'N/A' && detail.value !== '0',
                ) // Фільтруємо відсутні значення
                .map((detail, index) => (
                    <View
                        key={index}
                        style={[
                            styles.detailRow,
                            index % 2 === 0 ? styles.zebraLight : styles.zebraDark,
                        ]}>
                        <Text style={styles.detailLabel}>{detail.label}</Text>
                        {detail.link ? (
                            <Text
                                style={styles.linkValue}
                                onPress={() => {
                                    if (detail.link) {
                                        Linking.openURL(detail.link);
                                    }
                                }}>
                                {detail.value}
                            </Text>
                        ) : (
                            <Text style={styles.detailValue}>{detail.value}</Text>
                        )}
                    </View>
                ))}
        </View>
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
        fontSize: 12,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    detailValue: {
        fontSize: 12,
        color: colors.primaryBlack,
    },
    linkValue: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.primaryGreen,
        textDecorationLine: 'underline',
    },
});
