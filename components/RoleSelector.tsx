import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from "@/styles/colors";

type Props = {
  selected: 'MANAGER' | 'PROMOTION' | null;
  onSelect: (r: 'MANAGER' | 'PROMOTION') => void;
};

export const RoleSelector: React.FC<Props> = ({selected, onSelect}) => {
  return (
    <View style={styles.wrapper}>
      {(['MANAGER', 'PROMOTION'] as const).map(role => {
        const active = role === selected;
        return (
          <TouchableOpacity
            key={role}
            activeOpacity={0.7}
            style={[styles.pill, active && styles.pillActive]}
            onPress={() => onSelect(role)}>
            <Icon
              name={role === 'MANAGER' ? 'account-tie' : 'office-building'}
              size={18}
              color={active ? colors.white : colors.primaryGreen}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {role === 'MANAGER' ? 'Manager' : 'Promotion'}
            </Text>
            {active && (
              <Icon
                name="check-circle"
                size={16}
                color={colors.white}
                style={styles.check}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 4,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    marginBottom: 24,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 30,
  },
  pillActive: {
    backgroundColor: colors.primaryGreen,
    elevation: 3,                 // Android
    shadowColor: '#000',          // iOS
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
  },
  label: {
    marginLeft: 6,
    color: colors.primaryGreen,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.white,
  },
  check: {
    marginLeft: 4,
  },
});
