import {StyleSheet, Switch, Text, View} from 'react-native';
import colors from '@/styles/colors';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import {setExclusivity, setExclusivityEnabled,} from '@/store/createMultiContractOfferSlice';
import React from 'react';
import {useDispatch} from 'react-redux';

type ExclusivitySectionProps = {
    isExclusive: boolean | null | undefined;
    exclusivity: string | null | undefined;
};

export const ExclusivitySection = ({
                                       isExclusive,
                                       exclusivity,
                                   }: ExclusivitySectionProps) => {
    const dispatch = useDispatch();
    const onToggleExclusive = (value: boolean) => {
        dispatch(setExclusivityEnabled(value));
        if (!value) dispatch(setExclusivity(''));
    };
    return (
        <>
            <View style={styles.exclusivityRow}>
                <Text style={styles.labelExclusivity}>Exclusivity</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.toggleLabel}>{isExclusive ? 'Yes' : 'No'}</Text>
                    <Switch
                        value={isExclusive??false}
                        onValueChange={onToggleExclusive}
                        trackColor={{false: colors.gray, true: colors.primaryGreen}}
                        thumbColor={isExclusive ? colors.white : colors.gray}
                    />
                </View>
            </View>

            {isExclusive && (
                <FloatingLabelInput
                    label="Exclusivity Details"
                    value={exclusivity ?? ''}
                    onChangeText={text => dispatch(setExclusivity(text))}
                    containerStyle={styles.inputContainer}
                    maxLength={255}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    exclusivityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    toggleLabel: {
        marginRight: 8,
        fontSize: 14,
        color: colors.primaryBlack,
    },
    labelExclusivity: {
        fontSize: 15,
        lineHeight: 18,
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 8,
    },
    inputContainer: {
        marginBottom: 20,
        height: 56,
    },
});
