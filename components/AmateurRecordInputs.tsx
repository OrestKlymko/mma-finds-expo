import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import FloatingLabelInput from '@/components/FloatingLabelInput'; // адаптуй шлях
import colors from '@/styles/colors';

interface Props {
    amWins: string;
    setAmWins: (val: string) => void;
    amLoss: string;
    setAmLoss: (val: string) => void;
    amDraw: string;
    setAmDraw: (val: string) => void;
    sportType?: string;
}

export const AmateurRecordInputs = ({
                                        amWins,
                                        setAmWins,
                                        amLoss,
                                        setAmLoss,
                                        amDraw,
                                        setAmDraw,
                                        sportType,
                                    }: Props) => {
    return (
        <>
            <Text style={styles.sectionTitle}>Amateur {sportType} Record</Text>
            <View style={styles.recordRow}>
                <FloatingLabelInput
                    label="Win"
                    value={amWins}
                    onChangeText={setAmWins}
                    containerStyle={styles.recordInput}
                    keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                />
                <FloatingLabelInput
                    label="Loss"
                    value={amLoss}
                    onChangeText={setAmLoss}
                    containerStyle={styles.recordInput}
                    keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                />
                <FloatingLabelInput
                    label="Draw"
                    value={amDraw}
                    onChangeText={setAmDraw}
                    containerStyle={styles.recordInput}
                    keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: colors.primaryBlack,
    },
    recordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    recordInput: {
        flex: 1,
        marginRight: 8,
    },
});
