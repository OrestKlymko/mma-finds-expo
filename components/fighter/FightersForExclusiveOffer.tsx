import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React from "react";
import colors from "@/styles/colors";
import {useRouter} from "expo-router";
import {FighterChosen} from "@/store/createExclusiveOfferSlice";
import {OfferTypeEnum} from "@/models/model";


interface FighterForExclusiveOfferProps {
    fighterChosen?: FighterChosen[] | undefined,
    typeOffer?: OfferTypeEnum
}

export const FighterForExclusiveOffer = ({fighterChosen, typeOffer}: FighterForExclusiveOfferProps) => {
    const router = useRouter();

    return <>
        <Text style={styles.label}>{typeOffer&&typeOffer===OfferTypeEnum.PRIVATE?'Choose reciepients':'Fighter*'}</Text> // TODO: change label for private offer
        <TouchableOpacity
            style={[styles.inputRow]}
            onPress={() => {
                router.push({pathname: '/offer/exclusive/create/fighter/manager'});
            }}>
            <Text style={[styles.inputText]}>{fighterChosen && fighterChosen.length > 0
                ? 'You have chosen ' + fighterChosen.length + ' fighters'
                : 'Choose Fighters'}</Text>
            <Icon name="chevron-right" size={24} color={colors.primaryBlack}/>
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
