import {Alert, StyleSheet, Switch, Text, View} from "react-native";
import React from "react";
import {switchFighterLookingStatus} from "@/service/service";
import colors from "@/styles/colors";


type SwitchLookingFighterProps = {
    fighterId: string;
    isFighterLookingFight: boolean;
    setIsFighterLookingFight: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SwitchLookingFight = (
    {fighterId, isFighterLookingFight, setIsFighterLookingFight}: SwitchLookingFighterProps
) => {
    const handleSwitchLookingFight = async () => {
        setIsFighterLookingFight((prev:boolean) => !prev);
        try {
            switchFighterLookingStatus(fighterId);
        } catch (e) {
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };

    return <View style={styles.switchContainer}>
        <Switch
            trackColor={{false: colors.error, true: colors.primaryGreen}}
            thumbColor={colors.white}
            ios_backgroundColor={colors.error}
            onValueChange={handleSwitchLookingFight}
            value={isFighterLookingFight}
        />
        <Text
            style={{
                color: colors.gray,
                fontSize: 14,
                fontWeight: '400',
                marginLeft: 10,
            }}>
            This fighter is actively looking for a fight
        </Text>
    </View>;
};
const styles = StyleSheet.create({
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'center',
    },
})
