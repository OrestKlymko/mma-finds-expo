import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';

import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import FilterIcon from '@/assets/filter.svg';
import React, {useEffect} from 'react';
import colors from '@/styles/colors';
import {useFilter} from '@/context/FilterContext';
import {PublicOfferInfo} from '@/service/response';
import {useRouter} from "expo-router";
import {Filter} from "@/context/model/model";

interface SearchAndFilterOfferBarProps {
    offers: PublicOfferInfo[];
    getFilteredOffers: (offers: PublicOfferInfo[]) => void;
}

export function SearchAndFilterPublicOfferBar({
                                                  offers,
                                                  getFilteredOffers,
                                              }: SearchAndFilterOfferBarProps) {
    const {selectedFilters, setSelectedFilters} = useFilter();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');

    useEffect(() => {
        filteredOffers();
    }, [selectedFilters, searchQuery]);

    const filteredOffers = () => {
        if (selectedFilters.activeTab === 'Public') {
            const result = offers.filter(offer => {
                const matchesPlace =
                    selectedFilters.eventPlace.length === 0 ||
                    selectedFilters.eventPlace.some(place =>
                        offer.country.includes(place),
                    );

                const matchesEventName =
                    selectedFilters.eventName.length === 0 ||
                    selectedFilters.eventName.includes(offer.eventName);

                const matchesWeight =
                    selectedFilters.weightClass.length === 0 ||
                    selectedFilters.weightClass.includes(offer.weightClass);

                const matchesRules =
                    selectedFilters.rules.length === 0 ||
                    selectedFilters.rules.includes(
                        offer.isFightTitled ? 'Professional' : 'Ammateur',
                    );

                const matchesSearch =
                    searchQuery.length === 0 ||
                    offer.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    offer.weightClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    offer.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    offer?.opponentName?.toLowerCase()?.includes(searchQuery.toLowerCase());

                return (
                    matchesPlace &&
                    matchesEventName &&
                    matchesWeight &&
                    matchesRules &&
                    matchesSearch
                );
            });

            getFilteredOffers(result);
        }
    };

    const removeFilter = (category: keyof Filter, value: string) => {
        setSelectedFilters(prev => {
            const current = prev[category];
            if (Array.isArray(current)) {
                return {
                    ...prev,
                    [category]: current.filter(item => item !== value),
                };
            }
            return prev;
        });
    };

    const renderFilters = () => {
        const filters = [
            ...selectedFilters.eventPlace.map(f => ({
                category: 'eventPlace',
                value: f,
            })),
            ...selectedFilters.eventName.map(f => ({
                category: 'eventName',
                value: f,
            })),
            ...selectedFilters.weightClass.map(f => ({
                category: 'weightClass',
                value: f,
            })),
            ...selectedFilters.rules.map(f => ({category: 'rules', value: f})),
        ];

        if (filters.length === 0) return null;

        return (
            <ScrollView
                horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}>
                {filters.map((filter, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.filterChip}
                        onPress={() =>
                            removeFilter(filter.category as keyof Filter, filter.value)
                        }>
                        <Text style={styles.filterText}>{filter.value.split(',')[0]}</Text>
                        <Icon name="close" size={14} color={colors.white} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    return (
        <View style={styles.searchBar}>
            <View style={styles.searchContainerCommon}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search an offer..."
                        placeholderTextColor={colors.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity>
                        <Icon name="magnify" size={24} color={colors.primaryBlack} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        router.push('/(filter)/public-offer');
                    }}
                    style={styles.filterButton}>
                    <FilterIcon width={16} height={16} color={colors.primaryBlack} />
                </TouchableOpacity>
            </View>
            {renderFilters()}
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        marginRight: 10,
    },
    filterButton: {
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: colors.primaryGreen,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
    },
    filterContainer: {
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
    filterText: {
        fontSize: 14,
        color: colors.white,
    },
    searchContainerCommon: {
        flexDirection: 'row',
        gap: 10,
    },
    searchBar: {
        marginBottom: 10,
    },
});
