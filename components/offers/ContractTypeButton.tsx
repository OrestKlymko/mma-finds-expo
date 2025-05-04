import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from "@/styles/colors";

export const ContractTypeButton = ({ rule, isActive, onPress, onInfoPress }:{
    rule: string;
    isActive: boolean;
    onPress: () => void;
    onInfoPress: () => void;
}) => (
    <TouchableOpacity
        style={[styles.ruleButton, isActive && styles.ruleButtonActive]}
        onPress={onPress}
    >
        <Text style={[styles.ruleButtonText, isActive && styles.ruleButtonTextActive]}>
            {rule}
        </Text>
        <TouchableOpacity onPress={onInfoPress}>
            <Icon
                name="information-outline"
                size={20}
                color={isActive ? colors.white : colors.primaryBlack}
            />
        </TouchableOpacity>
    </TouchableOpacity>
);

const styles = StyleSheet.create({

    ruleButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.grayBackground,
        backgroundColor: colors.grayBackground,
        borderRadius: 8,
        marginRight: 8,
        height: 56,
        justifyContent: 'space-between',
        flexDirection:'row'
    },
    ruleButtonActive: {
        backgroundColor: colors.primaryGreen,
        borderColor: colors.primaryBlack,
    },
    ruleButtonText: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.primaryBlack,
    },
    ruleButtonTextActive: {
        color: colors.white,
        fontWeight: '500',
    },
});
