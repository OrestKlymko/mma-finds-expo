import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import {getWeightClasses} from '@/service/service';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import {WeightClassResponse} from '@/service/response';

interface WeightClassComponentProps {
    onSelect: (weightClassChoosen: WeightClassResponse) => void;
    hasError?: boolean;
    selectedWeightClass?: WeightClassResponse | null;
}

export const WeightClassComponent: React.FC<WeightClassComponentProps> = ({
                                                                              onSelect,
                                                                              hasError,
                                                                              selectedWeightClass,
                                                                          }) => {
    const [weightClasses, setWeightClasses] = useState<WeightClassResponse[]>([]);
    const [weightClass, setWeightClass] = useState<WeightClassResponse | null>(
        selectedWeightClass || null,
    );

    const [fromWeight, setFromWeight] = useState('');
    const [toWeight, setToWeight] = useState('');

    const [showWeightClassList, setShowWeightClassList] = useState(false);
    const catchweightRef = useRef<View>(null);

    useEffect(() => {
        if (selectedWeightClass) {
            setWeightClass(selectedWeightClass);

            if (
                selectedWeightClass.name.startsWith('Catchweight') &&
                selectedWeightClass.minCatchWeight !== undefined &&
                selectedWeightClass.maxCatchWeight !== undefined
            ) {
                setFromWeight(String(selectedWeightClass.minCatchWeight));
                setToWeight(String(selectedWeightClass.maxCatchWeight));
            }
        }
    }, [selectedWeightClass]);

    useEffect(() => {
        getWeightClasses()
            .then(res => setWeightClasses(res))
            .catch(err => console.error('Failed to fetch weight classes:', err));
    }, []);

    const handleSelectWeightClass = (wc: WeightClassResponse) => {
        setWeightClass(wc);
        setShowWeightClassList(false);
        onSelect(wc);
    };

    const handleApplyRange = () => {
        if (weightClass?.name === 'Catchweight') {
            const fromVal = parseFloat(fromWeight);
            const toVal = parseFloat(toWeight);

            if (
                isNaN(fromVal) ||
                isNaN(toVal) ||
                fromVal < 0 ||
                toVal < 0 ||
                fromVal >= toVal
            ) {
                Alert.alert('Invalid range', 'Please check your input values.');
                return;
            }

            const updatedCatchWeight: WeightClassResponse = {
                ...weightClass,
                minCatchWeight: fromVal,
                maxCatchWeight: toVal,
                name: `Catchweight (${fromVal} - ${toVal} kg)`,
            };
            setWeightClass(updatedCatchWeight);
            setShowWeightClassList(false);
            onSelect(updatedCatchWeight);
        }
    };

    const convertKgToLb = (weight: number) => {
        return (weight * 2.20462).toFixed(1);
    };

    const formattedWeightClassLabel = (wc: WeightClassResponse): string => {

        if (wc.name === 'Catchweight') {
            return 'Custom range';
        }
        if (wc.maximumWeight) {
            return `-${wc.maximumWeight} kg (${convertKgToLb(wc.maximumWeight)} lb)`;
        }
        return wc.name;
    };

    return (
        <View>
            <TouchableOpacity
                style={[styles.dropdownButton, hasError && {borderColor: colors.error}]}
                onPress={() => setShowWeightClassList(!showWeightClassList)}>
                <Text
                    style={[
                        styles.dropdownButtonText,
                        hasError && {color: colors.error},
                    ]}>
                    {weightClass?.name || 'Weight Class*'}
                </Text>
                <Icon
                    name={showWeightClassList ? 'chevron-up' : 'chevron-right'}
                    size={24}
                    color={colors.gray}
                />
            </TouchableOpacity>

            {showWeightClassList && (
                <View style={styles.dropdownList}>
                    {weightClasses.map(wc => (
                        <TouchableOpacity
                            key={wc.id}
                            style={styles.dropdownItemContainer}
                            onPress={() => handleSelectWeightClass(wc)}>
                            <View style={styles.weightClassRow}>
                                <Text style={styles.dropdownItem}>{wc.name}</Text>
                                <Text style={styles.dropdownWeight}>
                                    {formattedWeightClassLabel(wc)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {weightClass?.name === 'Catchweight' && (
                <View style={styles.catchWeightBlock} ref={catchweightRef}>
                    <Text style={styles.subLabel}>
                        {convertKgToLb(
                            parseFloat(fromWeight.trim() === '' ? '0' : fromWeight),
                        )}{' '}
                        lb -{' '}
                        {convertKgToLb(parseFloat(toWeight.trim() === '' ? '0' : toWeight))}{' '}
                        lb
                    </Text>

                    <FloatingLabelInput
                        label="From (kg)*"
                        keyboardType="numeric"
                        value={fromWeight}
                        onChangeText={setFromWeight}
                        containerStyle={styles.inputContainer}
                    />

                    <FloatingLabelInput
                        label="To (kg)*"
                        keyboardType="numeric"
                        value={toWeight}
                        onChangeText={setToWeight}
                        containerStyle={styles.inputContainer}
                    />

                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleApplyRange}>
                        <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// Стилі
const styles = StyleSheet.create({
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        height: 56,
        backgroundColor: colors.white,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        backgroundColor: colors.white,
        marginBottom: 15,
    },
    dropdownItemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    weightClassRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,
        paddingHorizontal: 15,
    },
    dropdownItem: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.primaryBlack,
    },
    dropdownWeight: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
    },

    catchWeightBlock: {
        backgroundColor: colors.white,
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    subLabel: {
        fontSize: 14,
        color: '#777',
        marginBottom: 15,
    },
    applyButton: {
        marginTop: 10,
        backgroundColor: colors.primaryGreen,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },
    applyButtonText: {
        fontSize: 16,
        color: colors.white,
        fontWeight: '600',
    },
});
