import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React from 'react';
import colors from "@/styles/colors";
import {useRouter} from "expo-router";

type Section = {
  label: string;
  icon: string;
  pathToScreen: string;
};
type SectionProps = {
  title: string;
  items: Section[];
};

export const SectionItem = ({title, items}: SectionProps) => {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item: Section, index: number) => {
        const isComingSoon =
          item.label === 'Task Center';
        return (
          <TouchableOpacity
            key={index}
            style={styles.item}
            disabled={isComingSoon}
            onPress={() =>
              !isComingSoon && router.push(item.pathToScreen as any)
            }>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.iconContainer}>
                <Icon
                  name={item.icon}
                  size={21}
                  color={colors.primaryGreen}
                  style={styles.icon}
                />
              </View>
              <Text style={styles.itemText}>{item.label}</Text>
            </View>
            {isComingSoon && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  /** SECTION **/
  section: {
    marginTop: 24,
    paddingHorizontal: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primaryBlack,
    marginBottom: 20,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.primaryBlack,
  },

  comingSoonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  comingSoonBadge: {
    backgroundColor: colors.primaryGreen, // або будь-який соковитий акцент
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'white',
    marginRight: 1,
  },

  /** ICONS **/
  icon: {
    marginLeft: 4,
  },
});
