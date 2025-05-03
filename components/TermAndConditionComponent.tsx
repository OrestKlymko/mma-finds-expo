import {Linking, StyleSheet, Switch, Text, View} from 'react-native';
import React from 'react';
import colors from "@/styles/colors";

interface TermAndConditionComponentProps {
  setAgree?: (value: ((prevState: boolean) => boolean) | boolean) => void;
  agreeState?: boolean;
}

export function TermAndConditionComponent({
  setAgree,
  agreeState,
}: TermAndConditionComponentProps) {
  const openTerms = () => {
    const url = 'https://your-terms-url.com'; // Замість цього вставте свою URL адресу
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
        }
      })
      .catch(err => console.error('Помилка при відкритті URI', err));
  };

  const openPrivacy = () => {
    const url = 'https://your-privacy-url.com'; // Замість цього вставте свою URL адресу
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
        }
      })
      .catch(err => console.error('Помилка при відкритті URI', err));
  };
  return (
    <View style={styles.switchContainer}>
      <Switch
        value={agreeState}
        onValueChange={setAgree}
        trackColor={{false: colors.gray, true: colors.primaryGreen}}
        thumbColor={agreeState ? colors.white : colors.gray}
      />
      <Text style={styles.switchLabel}>
        I agree to the{' '}
        <Text style={styles.link} onPress={openTerms}>
          Terms and Conditions
        </Text>{' '}
        and{' '}
        <Text style={styles.link} onPress={openPrivacy}>
          Privacy Policy
        </Text>
        *
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 19,
    color: colors.primaryBlack,
    marginLeft: 10,
  },
  link: {
    color: colors.primaryGreen,
  },
});
