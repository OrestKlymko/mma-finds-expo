import React from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import {Image} from 'expo-image';
import colors from "@/styles/colors";

interface SocialButtonProps {
  text: string;
  onPress: () => void;
  iconSource: any;
  backgroundColor?: string;
  textColor?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  text,
  onPress,
  disabled,
  isLoading,
  iconSource,
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
}) => (
  <TouchableOpacity
    style={[styles.button, {backgroundColor}]}
    disabled={disabled}
    onPress={onPress}>
    <View style={styles.contentContainer}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primaryBlack} />
      ) : (
        <>
          <Image source={iconSource} style={styles.icon} />
          <Text style={[styles.text, {color: textColor}]}>{text}</Text>
        </>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderWidth: 1,
    height: 56,
    borderColor: colors.primaryBlack,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SocialButton;
