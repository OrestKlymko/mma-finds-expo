import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import FloatingLabelInput from '@/components/FloatingLabelInput'; // адаптуй шлях
import colors from '@/styles/colors';

interface Props {
    proWins: string;
    setProWins: (val: string) => void;
    proLoss: string;
    setProLoss: (val: string) => void;
    proDraw: string;
    setProDraw: (val: string) => void;
    hasSubmitted: boolean;
    sportType?: string;
}

export const ProfessionalRecordInputs = ({
                                             proWins,
                                             setProWins,
                                             proLoss,
                                             setProLoss,
                                             proDraw,
                                             setProDraw,
                                             hasSubmitted,
                                             sportType,
                                         }: Props) => {
    return (
        <>
            <Text style={styles.sectionTitle}>Professional {sportType} Record*</Text>
            <View style={styles.recordRow}>
                <FloatingLabelInput
                    label="Win"
                    value={proWins}
                    hasSubmitted={hasSubmitted}
                    isRequired
                    onChangeText={setProWins}
                    containerStyle={styles.recordInput}
                    keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                />
                <FloatingLabelInput
                    label="Loss"
                    value={proLoss}
                    hasSubmitted={hasSubmitted}
                    isRequired
                    onChangeText={setProLoss}
                    containerStyle={styles.recordInput}
                    keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                />
                <FloatingLabelInput
                    label="Draw"
                    value={proDraw}
                    hasSubmitted={hasSubmitted}
                    isRequired
                    onChangeText={setProDraw}
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
