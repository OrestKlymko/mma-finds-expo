import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {countDaysForAcceptance} from "@/utils/utils";

type Props = {
  offer: any;
  fightersLength: number;
};

export const OfferState = ({offer, fightersLength}: Props) => {

  return (
    <>
      <View style={styles.summaryRowCentered}>
        <Text style={styles.summaryLabel}>Submitted Fighters: </Text>
        <Text style={styles.summaryValue}>{fightersLength}</Text>
      </View>
      <View style={styles.summaryRowCentered}>
        <Text style={styles.summaryLabel}>Time left to apply:</Text>
        <Text style={styles.summaryValue}>
          {' '}
          {offer?.closedReason && offer?.closedReason !== ''
            ? 'Closed'
            : countDaysForAcceptance(offer?.dueDate) === 0
            ? 'Today'
            : countDaysForAcceptance(offer?.dueDate) + ' Days'}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
