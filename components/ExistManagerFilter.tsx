import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import React from 'react';
import {useFilterFighter} from '@/context/FilterFighterContext';
import {FilterFighter} from "@/context/model/model";



type RenderedFilter = {
    category: keyof FilterFighter;
    label: string;
    value: string;
};

export const ExistManagerFilter = () => {
    const {selectedFilters, setSelectedFilters} = useFilterFighter();

    const filters: RenderedFilter[] = [];


    if (selectedFilters.managerLocation?.length) {
        selectedFilters.managerLocation.forEach(val => {
            if (val) {
                filters.push({
                    category: 'managerLocation',
                    label: val,
                    value: val,
                });
            }
        });
    }

    if (filters.length === 0) return null;

    const handleRemoveFilter = (category: keyof FilterFighter, value: string) => {
        setSelectedFilters(prev => {
            const currentValues = prev[category];

            if (Array.isArray(currentValues)) {
                return {
                    ...prev,
                    [category]: currentValues.filter(item => item !== value),
                };
            }

            return prev;
        });
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedFiltersContainer}>
            {filters.map((filter, index) => (
                <TouchableOpacity
                    key={`${filter.category}-${index}`}
                    style={styles.filterChip}
                    onPress={() => handleRemoveFilter(filter.category, filter.value)}>
                    <Text style={styles.filterChipText}>{filter.label}</Text>
                    <Icon
                        name="close"
                        size={16}
                        color={colors.white}
                        style={{marginLeft: 4}}
                    />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    selectedFiltersContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },

    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primaryGreen,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
        marginRight: 5,
        height: 56,
    },
    filterChipText: {
        color: colors.white,
        fontSize: 14,
    },
});
