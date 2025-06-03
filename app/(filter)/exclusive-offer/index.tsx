import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {getFilterForExclusiveOffers} from '@/service/service';
import {useExclusiveOfferFilter} from '@/context/ExclusiveOfferFilterContext';
import ContentLoader from '@/components/ContentLoader';
import {useRouter} from "expo-router";
import {ExclusiveOfferFilter} from "@/context/model/model";

type FilterArrayKeys = Extract<
    keyof ExclusiveOfferFilter,
    'eventName' | 'fighterName' | 'offerType'
>;

const FilterExclusiveOfferScreen = () => {
    const router = useRouter();
    const [contentLoading, setContentLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const {selectedExOfferFilters, setSelectedExOfferFilters} =
        useExclusiveOfferFilter();

    const [filter, setFilter] = useState<ExclusiveOfferFilter>({
        activeTab: 'Private',
        eventName: [],
        fighterName: [],
        offerType: [],
    });

    useEffect(() => {
        setContentLoading(true);
        getFilterForExclusiveOffers()
            .then(res => {
                console.log(res);
                setFilter({
                    activeTab: 'Private',
                    eventName: res.eventNames,
                    fighterName: res.fighterNames,
                    offerType: [],
                });
            })
            .finally(() => setContentLoading(false));
    }, []);

    const handleMorePress = (category: string) => {
        if (category === 'eventName') {
            router.push('/(filter)/(full-list)/event')
        } else if (category === 'promotion') {
            router.push('/(filter)/(full-list)/promotion')
        } else if (category === 'fighterName') {
            router.push('/(filter)/(full-list)/fighter')
        }
    };

    const toggleFilter = (category: FilterArrayKeys, value: string) => {
        setSelectedExOfferFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter(item => item !== value)
                : [...prev[category], value],
        }));
    };

    const clearAllFilters = () => {
        setSelectedExOfferFilters({
            activeTab: 'Private',
            fighterName: [],
            offerType: [],
            eventName: [],
        });
    };

    if (contentLoading) {
        return <ContentLoader />;
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Filters</Text>
                    <TouchableOpacity
                        onPress={clearAllFilters}
                        style={styles.clearButton}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{marginTop: 20}}>
                    <Text style={styles.sectionTitle}>Offer Type</Text>
                    <View style={styles.filterContainer}>
                        {['Single Bout', 'Multi-Fight'].map(rule => (
                            <FilterButton
                                key={rule}
                                label={rule}
                                selected={selectedExOfferFilters.offerType.includes(rule)}
                                onPress={() => toggleFilter('offerType', rule)}
                            />
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Event Name</Text>
                    <View style={styles.filterContainer}>
                        {filter?.eventName?.map(place => (
                            <FilterButton
                                key={place}
                                label={place}
                                selected={selectedExOfferFilters.eventName.includes(place)}
                                onPress={() => toggleFilter('eventName', place)}
                            />
                        ))}
                        {filter?.eventName?.length > 5 && (
                            <TouchableOpacity
                                onPress={() => handleMorePress('eventName')}
                                style={styles.moreButton}>
                                <Text style={styles.moreButtonText}>
                                    + {filter.eventName.length - 5} more
                                </Text>
                                <Icon
                                    name={'chevron-right'}
                                    size={20}
                                    style={styles.moreButtonText}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={styles.sectionTitle}>Fighter</Text>
                    <View style={styles.filterContainer}>
                        {filter?.fighterName?.map(ws => (
                            <FilterButton
                                key={ws}
                                label={ws}
                                selected={selectedExOfferFilters.fighterName.includes(ws)}
                                onPress={() => toggleFilter('fighterName', ws)}
                            />
                        ))}
                        {filter?.fighterName?.length > 5 && (
                            <TouchableOpacity
                                onPress={() => handleMorePress('fighterName')}
                                style={styles.moreButton}>
                                <Text style={styles.moreButtonText}>
                                    + {filter?.fighterName?.length - 5} more
                                </Text>
                                <Icon
                                    name={'chevron-right'}
                                    size={20}
                                    style={styles.moreButtonText}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={styles.showResultsButton}
                    onPress={() => router.push('/feed')}>
                    <Text style={styles.showResultsText}>Show Results</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const FilterButton = ({
                          label,
                          selected,
                          onPress,
                      }: {
    label: string;
    selected: boolean;
    onPress: () => void;
}) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.filterButton, selected && styles.selectedFilter]}>
        <Text style={[styles.filterText, selected && styles.selectedFilterText]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    headerContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Roboto',
        marginBottom: 15,
    },
    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    filterButton: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
    },
    selectedFilter: {
        backgroundColor: colors.primaryGreen,
        borderColor: colors.primaryGreen,
    },
    filterText: {
        color: colors.primaryBlack,
        fontWeight: '400',
        fontSize: 11,
        lineHeight: 11,
        fontFamily: 'Roboto',
    },
    selectedFilterText: {
        color: colors.white,
    },
    showResultsButton: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
        height: 56,
        justifyContent: 'center',
        marginBottom: 50,
    },
    showResultsText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.primaryGreen,
    },
    moreButtonText: {
        color: colors.primaryGreen,
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
    },
    clearButton: {
        position: 'absolute',
        right: 0,
    },
    clearText: {
        color: colors.primaryGreen,
        fontSize: 16,
    },
});

export default FilterExclusiveOfferScreen;
