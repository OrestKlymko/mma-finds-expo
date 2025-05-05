import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React from "react";
import colors from "@/styles/colors";
import {useRouter} from "expo-router";

interface FighterForOfferProps {
    fighterName: string |undefined | null;
    type: string;
}

export const FighterForOffer = ({fighterName,type}: FighterForOfferProps) => {
    const router = useRouter();
    return <>
        <Text style={styles.label}>Fighter*</Text>
        <TouchableOpacity
            style={[styles.inputRow]}
            onPress={() => {
                router.push({pathname:'/offer/exclusive/create/fighter',params:{type}});
            }}>
            <Text style={[styles.inputText]}>{fighterName || 'Fighter*'}</Text>
            <Icon name="chevron-right" size={24} color={colors.primaryBlack} />
        </TouchableOpacity>
    </>;
};

const styles = StyleSheet.create({
    /** Підпис поля */
    label: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 8,
    },

    /** Випадаючі списки (Fight Length / Benefits) */
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        marginBottom: 20,
        height: 56,
    },
    inputText: {
        fontSize: 16,
        color: colors.gray,
    },
})
