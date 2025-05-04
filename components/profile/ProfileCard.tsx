import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React from 'react';
import colors from "@/styles/colors";

type ProfileCardProps = {
  label: string,
  isActive: boolean,
  onPress: () => void,
}

export const ProfileCard = (
  {label, isActive, onPress}: ProfileCardProps
) => {

  return <TouchableOpacity
    style={[styles.card, isActive && styles.cardActive]}
    activeOpacity={0.8}
    onPress={onPress}>
    <View style={styles.cardContent}>
      <Icon
        name={label === 'Manager' ? 'account-tie' : 'account-group'}
        size={24}
        color={colors.primaryBlack}
      />
      <Text style={styles.cardText}>{label}</Text>
    </View>

    {isActive && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Active</Text>
      </View>
    )}
  </TouchableOpacity>;
};

const styles = StyleSheet.create({
  /* ---------- CARD ---------- */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 56,
  },
  cardActive: {
    backgroundColor: '#E9F7EF',
    borderWidth: 2,
    borderColor: colors.primaryGreen,
    height: 56,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryBlack,
  },
  badge: {
    backgroundColor: colors.primaryGreen,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
})
