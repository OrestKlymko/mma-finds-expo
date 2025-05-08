import React from 'react';
import {Platform, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import FloatingLabelInput from "@/components/FloatingLabelInput";
import colors from "@/styles/colors";


interface ReachInputProps {
    reachValue: string;
    setReachValue: (val: string) => void;
    reachFeet: string;
    setReachFeet: (val: string) => void;
    reachInches: string;
    setReachInches: (val: string) => void;
    reachUnit: 'cm' | 'inch';
    setReachUnit: (val: 'cm' | 'inch') => void;
}

export const ReachInput = ({
                               reachValue,
                               setReachValue,
                               reachFeet,
                               setReachFeet,
                               reachInches,
                               setReachInches,
                               reachUnit,
                               setReachUnit,
                           }: ReachInputProps) => {
    return (
        <View style={styles.rowContainer}>
            {reachUnit === 'cm' ? (
                <FloatingLabelInput
                    label="Reach"
                    value={reachValue}
                    onChangeText={text => setReachValue(text.replace(',', '.'))}
                    containerStyle={[
                        styles.inputContainer,
                        {flex: 1, marginRight: 10},
                    ]}
                    keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                />
            ) : (
                <>
                    <FloatingLabelInput
                        label="Feet"
                        value={reachFeet}
                        onChangeText={text =>
                            setReachFeet(text.replace(',', '.').replace('.', ''))
                        }
                        containerStyle={[
                            styles.inputContainer,
                            {flex: 0.5, marginRight: 10},
                        ]}
                        keyboardType="numeric"
                    />
                    <FloatingLabelInput
                        label="Inches"
                        value={reachInches}
                        onChangeText={text => setReachInches(text.replace(',', '.'))}
                        containerStyle={[
                            styles.inputContainer,
                            {flex: 0.5, marginRight: 10},
                        ]}
                        keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                    />
                </>
            )}

            <View style={styles.unitContainerAligned}>
                <TouchableOpacity
                    style={[
                        styles.unitButton,
                        reachUnit === 'cm' && styles.unitButtonActive,
                    ]}
                    onPress={() => setReachUnit('cm')}>
                    <Text
                        style={[
                            styles.unitButtonText,
                            reachUnit === 'cm' && styles.unitButtonTextActive,
                        ]}>
                        cm
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.unitButton,
                        reachUnit === 'inch' && styles.unitButtonActive,
                    ]}
                    onPress={() => setReachUnit('inch')}>
                    <Text
                        style={[
                            styles.unitButtonText,
                            reachUnit === 'inch' && styles.unitButtonTextActive,
                        ]}>
                        inch
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 0,
    },
    unitContainerAligned: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    unitButton: {
        borderWidth: 1,
        borderColor: colors.gray,
        backgroundColor: colors.white,
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginRight: 5,
        height: 56,
        justifyContent: 'center',
    },
    unitButtonActive: {
        backgroundColor: colors.secondaryBlack,
        borderColor: colors.secondaryBlack,
    },
    unitButtonText: {
        color: colors.primaryBlack,
        fontSize: 14,
    },
    unitButtonTextActive: {
        color: colors.white,
        fontWeight: '600',
    },
});