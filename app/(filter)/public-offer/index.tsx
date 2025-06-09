import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useAuth} from '@/context/AuthContext';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {getFilterForPublicOffers, getFilterForPublicOffersManager,} from '@/service/service';
import {useFilter} from '@/context/FilterContext';
import ContentLoader from '@/components/ContentLoader';
import {Filter} from "@/context/model/model";
import {useRouter} from "expo-router";

const FilterPublicOfferScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const {role} = useAuth();
    const {selectedFilters, setSelectedFilters} = useFilter();
    const [promotions, setPromotions] = useState<string[]>([]);
    const [contentLoading, setContentLoading] = useState(false);
    const [filter, setFilter] = useState<Filter>({
        eventPlace: [],
        promotion: [],
        rules: [],
        weightClass: [],
        eventName: [],
        activeTab: 'Public',
        fighterName: [],
        offerType: [],
    });

    useEffect(() => {
        setContentLoading(true);
        if (role === 'MANAGER') {
            getFilterForPublicOffersManager()
                .then(res => {
                    setFilter({
                        eventName: res.eventNames,
                        fighterName: [],
                        weightClass: res.weightClasses,
                        eventPlace: [],
                        offerType: [],
                        rules: [],
                        activeTab: 'Public',
                        promotion: [],
                    });
                    setPromotions(res.promotions);
                })
                .finally(() => setContentLoading(false));
        } else {
            getFilterForPublicOffers()
                .then(res => {
                    setFilter({
                        eventName: res.eventNames,
                        fighterName: res.fighterNames,
                        weightClass: res.weightClasses,
                        eventPlace: [],
                        offerType: [],
                        rules: [],
                        activeTab: 'Public',
                        promotion: [],
                    });
                })
                .finally(() => setContentLoading(false));
        }
    }, [role]);

    const handleMorePress = (category: string) => {
        if (category === 'eventName') {
            router.push('/(filter)/(full-list)/event')
        } else if (category === 'promotion') {
            router.push('/(filter)/(full-list)/promotion')
        } else if (category === 'weightClass') {
            router.push('/(filter)/(full-list)/weight-class')
        }
    };

    const toggleFilter = (category: keyof Filter, value: string) => {
        setSelectedFilters(prev => {
            const current = prev[category];
            if (Array.isArray(current)) {
                return {
                    ...prev,
                    [category]: current.includes(value)
                        ? current.filter(item => item !== value)
                        : [...current, value],
                };
            }
            return prev;
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters({
            eventPlace: [],
            promotion: [],
            rules: [],
            weightClass: [],
            eventName: [],
            activeTab: 'Public',
            fighterName: [],
            offerType: [],
        });
    };

    if (contentLoading) {
        return <ContentLoader/>;
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton/>
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
                    <Text style={styles.sectionTitle}>Event Name</Text>
                    <View style={styles.filterContainer}>
                        {filter.eventName?.slice(0, 5).map(place => (
                            <FilterButton
                                key={place}
                                label={place}
                                selected={selectedFilters.eventName.includes(place)}
                                onPress={() => toggleFilter('eventName', place)}
                            />
                        ))}
                        {filter.eventName?.length > 5 && (
                            <TouchableOpacity
                                onPress={() => handleMorePress('eventName')}
                                style={styles.moreButton}>
                                <Text style={styles.moreButtonText}>
                                    + {filter.eventName?.length - 5} more
                                </Text>
                                <Icon
                                    name={'chevron-right'}
                                    size={24}
                                    style={styles.moreButtonText}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {role === 'MANAGER' && (
                        <>
                            <Text style={styles.sectionTitle}>Promotion</Text>
                            <View style={styles.filterContainer}>
                                {promotions &&
                                    promotions.length > 0 &&
                                    promotions
                                        .slice(0, 5)
                                        .map(promo => (
                                            <FilterButton
                                                key={promo}
                                                label={promo}
                                                selected={selectedFilters.promotion.includes(promo)}
                                                onPress={() => toggleFilter('promotion', promo)}
                                            />
                                        ))}
                                {promotions&&promotions.length > 5 && (
                                    <TouchableOpacity
                                        onPress={() => handleMorePress('promotion')}
                                        style={styles.moreButton}>
                                        <Text style={styles.moreButtonText}>
                                            + {promotions.length - 5} more
                                        </Text>
                                        <Icon
                                            name={'chevron-right'}
                                            size={24}
                                            style={styles.moreButtonText}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </>
                    )}
                    <Text style={styles.sectionTitle}>Rules</Text>
                    <View style={styles.filterContainer}>
                        {['Ammateur', 'Professional'].map(rule => (
                            <FilterButton
                                key={rule}
                                label={rule}
                                selected={selectedFilters.rules.includes(rule)}
                                onPress={() => toggleFilter('rules', rule)}
                            />
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Weight Class</Text>
                    <View style={styles.filterContainer}>
                        {filter.weightClass?.slice(0, 5).map(ws => (
                            <FilterButton
                                key={ws}
                                label={ws}
                                selected={selectedFilters.weightClass.includes(ws)}
                                onPress={() => toggleFilter('weightClass', ws)}
                            />
                        ))}
                        {filter.weightClass?.length > 5 && (
                            <TouchableOpacity
                                onPress={() => handleMorePress('weightClass')}
                                style={styles.moreButton}>
                                <Text style={styles.moreButtonText}>
                                    + {filter.weightClass?.length - 5} more
                                </Text>
                                <Icon
                                    name={'chevron-right'}
                                    size={24}
                                    style={styles.moreButtonText}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>

                {/*<TouchableOpacity*/}
                {/*    style={styles.showResultsButton}*/}
                {/*    onPress={() => {*/}
                {/*        router.push('/search')*/}
                {/*    }}>*/}
                {/*    <Text style={styles.showResultsText}>Show Results</Text>*/}
                {/*</TouchableOpacity>*/}
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

export default FilterPublicOfferScreen;
