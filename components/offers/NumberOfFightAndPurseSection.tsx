import FloatingLabelInput from '@/components/FloatingLabelInput';
import {PurseValuesMulti, setCurrency, setNumberOfFights, setPurseValues,} from '@/store/createMultiContractOfferSlice';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {useDispatch} from 'react-redux';
import PurseExclusiveFightComponent from "@/components/offers/PurseExclusiveFightComponent";

interface PurseValues {
    fight: string;
    win: string;
    bonus: string;
}

type NumberOfFightAndPurseSetionProps = {
    numberOfFights: string | null | undefined;
    purseValues: PurseValuesMulti[];
    currency: string | null | undefined;
    hasSubmit: boolean;
};

export const NumberOfFightAndPurseSection = ({
                                                numberOfFights,
                                                purseValues,
                                                currency,
                                                hasSubmit,
                                            }: NumberOfFightAndPurseSetionProps) => {
    const dispatch = useDispatch();
    const count = parseInt(numberOfFights || '0', 10);

    const handleConfirmPurse = (
        index: number,
        values: PurseValues,
        selectedCurrency: string,
    ) => {
        dispatch(setPurseValues({index, values}));
        dispatch(setCurrency(selectedCurrency));
    };

    return (
        <>
            <FloatingLabelInput
                label="Number of Fights*"
                value={numberOfFights ?? ''}
                hasSubmitted={hasSubmit}
                isRequired={true}
                keyboardType="numeric"
                onChangeText={fights => dispatch(setNumberOfFights(fights))}
                containerStyle={styles.inputContainer}
            />

            {Array.from({length: count}, (_, i) => (
                <View key={i} style={{marginBottom: 0}}>
                    <Text style={styles.sectionLabel}>Purse for Fight {i + 1}</Text>
                    <PurseExclusiveFightComponent
                        currencyType={currency ?? 'EUR'}
                        currentValues={purseValues[i]?.values || {fight: '', win: '', bonus: ''}}
                        onConfirm={(vals, cur) => handleConfirmPurse(i, vals, cur)}
                    />
                </View>
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 10,
        height: 56,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: colors.primaryBlack,
    },
});
