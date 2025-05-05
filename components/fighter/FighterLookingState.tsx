import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';


export const FighterLookingState = ({
  lookingForOpponent,
}: {
  lookingForOpponent: boolean;
}) => {
  return (
    <>
      {lookingForOpponent ? (
        <View style={styles.activeLookingContainer}>
          <View style={styles.greenDot} />
          <Text style={styles.activeLookingForOpponent}>
            This fighter is actively looking for a fight
          </Text>
        </View>
      ) : (
        <View style={styles.activeLookingContainer}>
          <View style={styles.redDot} />
          <Text style={styles.notLookingForOpponent}>
            This fighter is not looking for a fight
          </Text>
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  activeLookingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    marginBottom: 16,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    marginRight: 5,
    marginTop: 2, // додатковий відступ для вирівнювання
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C01818',
    marginRight: 5,
    marginTop: 2,
  },
  activeLookingForOpponent: {
    color: colors.primaryGreen,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  notLookingForOpponent: {
    color: '#C01818',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
});
