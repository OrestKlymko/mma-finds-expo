import React, {useEffect, useRef, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import {getWeightClasses} from '@/service/service';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import {WeightClassResponse} from '@/service/response';

interface WeightClassComponentProps {
    onSelect: (selectedWeightClasses: WeightClassResponse[]) => void;
    hasError?: boolean;
    selectedWeightClasses?: WeightClassResponse[] | null;
}

export const MultiWeightClassComponent: React.FC<WeightClassComponentProps> = ({
                                                                                   onSelect,
                                                                                   hasError,
                                                                                   selectedWeightClasses: selectedWeightClassesProp,
                                                                               }) => {
    const [weightClasses, setWeightClasses] = useState<WeightClassResponse[]>([]);
    // Масив для збереження вибраних вагових категорій
    const [selectedWeightClasses, setSelectedWeightClasses] = useState<WeightClassResponse[]>(
        selectedWeightClassesProp ? selectedWeightClassesProp : []
    );
    // Для діапазону Catchweight
    const [fromWeight, setFromWeight] = useState('');
    const [toWeight, setToWeight] = useState('');
    const [showWeightClassList, setShowWeightClassList] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const catchweightRef = useRef<View>(null);

    useEffect(() => {
        if (selectedWeightClassesProp && selectedWeightClassesProp.length > 0) {
            setSelectedWeightClasses(selectedWeightClassesProp);
            // Якщо серед вибраних є Catchweight – заповнюємо діапазон
            const catchweight = selectedWeightClassesProp.find(wc => wc.name === 'Catchweight');
            if (
                catchweight &&
                catchweight.minCatchWeight !== undefined &&
                catchweight.maxCatchWeight !== undefined
            ) {
                setFromWeight(String(catchweight.minCatchWeight));
                setToWeight(String(catchweight.maxCatchWeight));
            }
        }
    }, [selectedWeightClassesProp]);

    useEffect(() => {
        getWeightClasses()
            .then(res => setWeightClasses(res))
            .catch(err => console.error('Failed to fetch weight classes:', err));
    }, []);

    // Перемикаємо вибір – додаємо або видаляємо категорію
    const toggleWeightClass = (wc: WeightClassResponse) => {
        const alreadySelected = selectedWeightClasses.some(item => item.id === wc.id);
        let updatedSelected: WeightClassResponse[];
        if (alreadySelected) {
            updatedSelected = selectedWeightClasses.filter(item => item.id !== wc.id);
        } else {
            updatedSelected = [...selectedWeightClasses, wc];
        }
        setSelectedWeightClasses(updatedSelected);
        onSelect(updatedSelected);
    };

    // Обновлюємо дані для Catchweight (якщо він вибраний)
    const handleApplyRange = () => {
        const catchweightIndex = selectedWeightClasses.findIndex(wc => wc.name === 'Catchweight');
        if (catchweightIndex !== -1) {
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
            const updatedCatchweight: WeightClassResponse = {
                ...selectedWeightClasses[catchweightIndex],
                minCatchWeight: fromVal,
                maxCatchWeight: toVal,
                name: `Catchweight (${fromVal} - ${toVal} kg)`,
            };
            const updatedSelected = [...selectedWeightClasses];
            updatedSelected[catchweightIndex] = updatedCatchweight;
            setSelectedWeightClasses(updatedSelected);
            onSelect(updatedSelected);
            setShowWeightClassList(false);
        }
    };

    const convertKgToLb = (weight: number) => {
        return (weight * 2.20462).toFixed(1);
    };

    const formattedWeightClassLabel = (wc: WeightClassResponse): string => {
        if (wc.name === 'Catchweight') {
            if (wc.minCatchWeight !== undefined && wc.maxCatchWeight !== undefined) {
                return `Catchweight (${wc.minCatchWeight}kg - ${wc.maxCatchWeight}kg)`;
            }
            return 'Custom range';
        }
        if (wc.maximumWeight) {
            return `-${wc.maximumWeight} kg (${convertKgToLb(wc.maximumWeight)} lb)`;
        }
        return wc.name;
    };

    // Текст кнопки-випадайки
    const dropdownButtonText = () => {
        if (selectedWeightClasses.length === 0) {
            return 'Weight Class*';
        }
        return selectedWeightClasses.map(wc => wc.name).join(', ');
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {/* Кнопка-випадайка */}
            <TouchableOpacity
                style={[styles.dropdownButton, hasError && {borderColor: colors.error}]}
                onPress={() => setShowWeightClassList(!showWeightClassList)}>
                <Text
                    style={[styles.dropdownButtonText, hasError && {color: colors.error}]}>
                    {dropdownButtonText()}
                </Text>
                <Icon
                    name={showWeightClassList ? 'chevron-up' : 'chevron-right'}
                    size={24}
                    color={colors.gray}
                />
            </TouchableOpacity>

            {/* Список вагових категорій */}
            {showWeightClassList && (
                <View style={styles.dropdownList}>
                    {weightClasses.map(wc => {
                        const isSelected = selectedWeightClasses.some(item => item.id === wc.id);
                        return (
                            <TouchableOpacity
                                key={wc.id}
                                style={[
                                    styles.dropdownItemContainer,
                                    isSelected && styles.selectedItemContainer,
                                ]}
                                onPress={() => toggleWeightClass(wc)}>
                                <View style={styles.weightClassRow}>
                                    <Text style={styles.dropdownItem}>{wc.name}</Text>
                                    <Text style={styles.dropdownWeight}>
                                        {formattedWeightClassLabel(wc)}
                                    </Text>
                                    {isSelected && (
                                        <Icon name="check" size={20} color={colors.primaryGreen} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            {/* Якщо серед вибраних є Catchweight, показуємо поля для вводу діапазону */}
            {selectedWeightClasses.some(wc => wc.name === 'Catchweight') && (
                <View style={styles.catchWeightBlock} ref={catchweightRef}>
                    <Text style={styles.subLabel}>
                        {convertKgToLb(
                            parseFloat(fromWeight.trim() === '' ? '0' : fromWeight)
                        )}{' '}
                        lb -{' '}
                        {convertKgToLb(
                            parseFloat(toWeight.trim() === '' ? '0' : toWeight)
                        )}{' '}
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
        </ScrollView>
    );
};

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
        padding: 12,
    },
    selectedItemContainer: {
        backgroundColor: colors.grayBackground,
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
