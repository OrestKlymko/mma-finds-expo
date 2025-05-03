import {StyleSheet, Text, View} from "react-native";
import React from "react";
import colors from "@/styles/colors";

export const Divider = () => {
  return <View style={styles.dividerContainer}>
      <View style={styles.divider} />
      <Text style={styles.dividerText}>or</Text>
      <View style={styles.divider} />
  </View>;
};

const styles = StyleSheet.create({
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.gray,
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: '300',
        lineHeight: 12,
        color: colors.primaryBlack,
    },
})
