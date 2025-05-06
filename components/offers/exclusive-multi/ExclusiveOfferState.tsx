import {StyleSheet, Text, View} from 'react-native';

import React from 'react';
import colors from '@/styles/colors';

type Props = {
    offer: any;
};

export const ExclusiveOfferState = ({offer}: Props) => {
    const daysLeft = React.useMemo(() => {
        return offer
            ? Math.floor(
            (new Date(offer.dueDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1
            : 0;
    }, [offer]);

    return (
        <>
            <View style={styles.eventSummaryContainer}>
                <View style={styles.summaryRowCentered}>
                    <Text style={styles.summaryLabel}>Time left to apply:</Text>
                    <Text style={styles.summaryValue}>
                        {' '}
                        {offer?.closedReason && offer?.closedReason !== ''
                            ? 'Closed'
                            : daysLeft === 0
                                ? 'Today'
                                : daysLeft + ' Days'}
                    </Text>
                </View>
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    eventSummaryContainer: {
        borderRadius: 8,
        alignItems: 'center',
    },
    summaryRowCentered: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 4,
        paddingVertical: 12,
        justifyContent: 'center',
        width: '100%',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        fontWeight: '500',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.primaryBlack,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.primaryBlack,
    },
});
