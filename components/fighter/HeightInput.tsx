import React from 'react';
import {
    Platform,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import FloatingLabelInput from "@/components/FloatingLabelInput";
import colors from "@/styles/colors";

interface HeightInputProps {
    heightValue: string;
    setHeightValue: (val: string) => void;
    heightFeet: string;
    setHeightFeet: (val: string) => void;
    heightInches: string;
    setHeightInches: (val: string) => void;
    heightUnit: 'cm' | 'inch';
    setHeightUnit: (val: 'cm' | 'inch') => void;
}

export const HeightInput = ({
                                heightValue,
                                setHeightValue,
                                heightFeet,
                                setHeightFeet,
                                heightInches,
                                setHeightInches,
                                heightUnit,
                                setHeightUnit,
                            }: HeightInputProps) => {
    return (
        <View style={styles.rowContainer}>
            {heightUnit === 'cm' ? (
                <FloatingLabelInput
                    label="Height"
                    value={heightValue}
                    onChangeText={text => setHeightValue(text.replace(',', '.'))}
                    containerStyle={[styles.inputContainer, {flex: 1, marginRight: 10}]}
                    keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                />
            ) : (
                <>
                    <FloatingLabelInput
                        label="Feet"
                        value={heightFeet}
                        onChangeText={text =>
                            setHeightFeet(text.replace(',', '.').replace('.', ''))
                        }
                        containerStyle={[styles.inputContainer, {flex: 0.5, marginRight: 10}]}
                        keyboardType="numeric"
                    />
                    <FloatingLabelInput
                        label="Inches"
                        value={heightInches}
                        onChangeText={text => setHeightInches(text.replace(',', '.'))}
                        containerStyle={[styles.inputContainer, {flex: 0.5, marginRight: 10}]}
                        keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                    />
                </>
            )}

            <View style={styles.unitContainerAligned}>
                <TouchableOpacity
                    style={[
                        styles.unitButton,
                        heightUnit === 'cm' && styles.unitButtonActive,
                    ]}
                    onPress={() => setHeightUnit('cm')}>
                    <Text
                        style={[
                            styles.unitButtonText,
                            heightUnit === 'cm' && styles.unitButtonTextActive,
                        ]}>
                        cm
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.unitButton,
                        heightUnit === 'inch' && styles.unitButtonActive,
                    ]}
                    onPress={() => setHeightUnit('inch')}>
                    <Text
                        style={[
                            styles.unitButtonText,
                            heightUnit === 'inch' && styles.unitButtonTextActive,
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