import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';

interface Props {
    mmaRule: 'Amateur' | 'Professional';
    setMmaRule: (rule: 'Amateur' | 'Professional') => void;
    selectedSportType: {id: string; name: string} | null | undefined;
}

const RuleSelector = ({mmaRule, setMmaRule, selectedSportType}: Props) => {
    const isDisabled = selectedSportType?.name?.includes('MMA Gloves');

    useEffect(() => {
        if (isDisabled) {
            setMmaRule('Professional');
        }
    }, [isDisabled, setMmaRule]);
    return (
        <>
            <Text style={styles.label}>Rules</Text>
            <View style={styles.buttonGroup}>
                {(['Amateur', 'Professional'] as const).map(rule => {
                    const isActive = mmaRule === rule;

                    return (
                        <TouchableOpacity
                            key={rule}
                            disabled={isDisabled}
                            style={[
                                styles.ruleButton,
                                isActive && styles.ruleButtonActive,
                                isDisabled && {opacity: 0.5},
                            ]}
                            onPress={() => setMmaRule(rule)}>
                            <Text
                                style={[
                                    styles.ruleButtonText,
                                    isActive && styles.ruleButtonTextActive,
                                ]}>
                                {rule}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </>
    );
};

export default RuleSelector;

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 8,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    ruleButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.grayBackground,
        backgroundColor: colors.grayBackground,
        borderRadius: 8,
        marginRight: 8,
        height: 56,
        justifyContent: 'center',
    },
    ruleButtonActive: {
        backgroundColor: colors.primaryGreen,
        borderColor: colors.primaryGreen,
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
