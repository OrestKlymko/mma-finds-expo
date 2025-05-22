import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {MultiContractFullInfo} from '@/service/response';
import {ExclusiveOfferState} from "@/components/offers/exclusive-multi/ExclusiveOfferState";

type Props = {
    offer: MultiContractFullInfo | null | undefined;
};

export const MainOfferDetails = ({offer}: Props) => {
    return (
        <View>
            <ExclusiveOfferState offer={offer} />
            <View style={{marginTop: 30}}>
                <Text style={styles.cardTitle}>Main Offer Details</Text>
                <View style={styles.offerDetailsCard}>
                    {/* Активність пропозиції */}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Contact Duration (Months):</Text>
                        <Text style={styles.infoValue}>
                            {offer?.durationContractMonth} Months
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Number of Fights:</Text>
                        <Text style={styles.infoValue}>{offer?.numberOfFight || '--'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Weight Class:</Text>
                        <Text style={styles.infoValue}>
                            {offer?.weightClass?.join(', ') || '--'}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Sport:</Text>
                        <Text style={styles.infoValue}>
                            {offer?.sportType?.join(', ') || '--'}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Exclusivity:</Text>
                        <Text style={styles.infoValue}>
                            {offer?.exclusivity || '--'}
                        </Text>
                    </View>
                    {offer?.description && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Additional Info:</Text>
                            <Text style={styles.infoValue}>{offer?.description}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    offerDetailsCard: {
        backgroundColor: colors.lightGray,
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryGreen,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.primaryBlack,
        maxWidth: '65%',
    },
});
