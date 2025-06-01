import {StyleSheet, Text, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import React from 'react';
import {formatDateFromLocalDate, formatTime} from "@/utils/utils";

type Props = {
  offer: any;
};

export const LocationAndDateEvent = ({offer}: Props) => {

  return (
    <>
      <View style={[styles.infoRow, {marginTop: 20}]}>
        <Icon
          name="calendar"
          size={26}
          color={colors.primaryBlack}
          style={styles.iconStyle}
        />
        <View style={styles.infoWrapper}>
          <Text style={styles.infoLabel}>
            {formatDateFromLocalDate(offer?.eventDate) || 'Date not provided'}
          </Text>
          <Text style={styles.infoSubLabel}>
            {formatTime(
              offer?.eventTimeFrom,
              offer?.eventTimeTo,
              offer?.eventDate,
            ) || 'Time not provided'}
          </Text>
        </View>
      </View>

      {/* Location */}
      <View style={styles.infoRow}>
        <Icon
          name="map-marker"
          size={26}
          color={colors.primaryBlack}
          style={styles.iconStyle}
        />
        <View style={styles.infoWrapper}>
          <Text style={styles.infoLabel}>
            {offer?.arenaName || 'Venue not provided'}
          </Text>
          <Text style={styles.infoSubLabel}>
            {offer?.eventLocation || 'Address not provided'}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconStyle: {
    marginRight: 12,
    backgroundColor: colors.lightGray,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  infoWrapper: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: colors.lightGray,
    paddingLeft: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryGreen,
    marginBottom: 4,
  },
  infoSubLabel: {
    fontSize: 11,
    fontFamily: 'Roboto',
    fontWeight: '500',
    lineHeight: 11,
    color: colors.gray,
  },
});
