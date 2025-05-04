import {StyleSheet, Switch, Text, View} from "react-native";
import colors from "@/styles/colors";
import React from "react";

type TitleFightSwitcherProps = {
    isTitleFight: boolean;
    setIsTitleFight: (isTitleFight: boolean) => void;
}

export const TitleFightSwitcher = (
    {isTitleFight, setIsTitleFight}: TitleFightSwitcherProps
) => {
    return <View style={styles.toggleRowWithoutSpaceBetween}>
        <Switch
            value={isTitleFight}
            onValueChange={setIsTitleFight}
            trackColor={{false: colors.gray, true: colors.primaryGreen}}
            thumbColor={isTitleFight ? colors.white : colors.gray}
        />
        <Text style={styles.toggleLabel}>This fight is a Title Fight</Text>
    </View>;
};

const styles = StyleSheet.create({
    toggleRowWithoutSpaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    toggleLabel: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.primaryBlack,
        marginLeft: 8,
    },
})
