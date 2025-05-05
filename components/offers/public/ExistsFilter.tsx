import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import React from 'react';
import {useSubmittedFilterFighter} from '@/context/SubmittedFilterFighterContext';
import {SubmittedFilterFighter} from "@/context/model/model";

type Filter = {
    category: FilterCategory;
    label: string;
    value: string;
};
type FilterCategory = keyof SubmittedFilterFighter;


export const ExistsFilter = () => {
    const filters: Filter[] = [];

    const {availableFilters, setAvailableFilters} = useSubmittedFilterFighter();

    const handleRemoveFilter = (category: FilterCategory, value: string) => {
        setAvailableFilters(prev => {
            const currentValues = prev[category] ?? [];
            if (!Array.isArray(currentValues)) {
                return prev;
            }
            const updated = currentValues.filter(item => item !== value);
            return {
                ...prev,
                [category]: updated,
            };
        });
    };

    if (availableFilters.locations?.length) {
        availableFilters.locations.forEach(val => {
            if (val) {
                filters.push({
                    category: 'locations',
                    label: `${val}`,
                    value: val,
                });
            }
        });
    }

    if (availableFilters.foundationStyle?.length) {
        availableFilters.foundationStyle.forEach(val => {
            if (val) {
                filters.push({
                    category: 'foundationStyle',
                    label: `${val}`,
                    value: val,
                });
            }
        });
    }

    if (filters.length === 0) return null;

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
})
