import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {getCountriesFighter, getFoundationStylesFilter,} from '@/service/service';
import {useFilterFighter} from '@/context/FilterFighterContext';
import ContentLoader from '@/components/ContentLoader';
import {CountryResponse, FoundationStyleResponse} from '@/service/response';
import {FilterFighter} from "@/context/model/model";
import {useRouter} from "expo-router";


const FilterFighterScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const {selectedFilters, setSelectedFilters} = useFilterFighter();
    const [cities, setCities] = useState<CountryResponse[]>([]);
    const [foundationStyles, setFoundationStyles] = useState<FoundationStyleResponse[]>([]);
    const [contentLoading, setContentLoading] = useState(true);

    useEffect(() => {
        Promise.all([getFoundationStylesFilter(), getCountriesFighter()])
            .then(([styles, countries]) => {
                setFoundationStyles(styles);
                setCities(countries);
            })
            .finally(() => {
                setContentLoading(false);
            });
    }, []);

    const handleMorePress = (category: string) => {
        if (category === 'fighterLocation') {
            router.push('/(filter)/(full-list)/fighter/location');
        } else {
            router.push('/(filter)/(full-list)/foundation');
        }
    };

    function toggleFilter<K extends keyof FilterFighter>(
        category: K,
        value: FilterFighter[K] extends (infer U)[] ? U : never,
    ) {
        setSelectedFilters(prev => {
            const current = prev[category];
            if (Array.isArray(current)) {
                const arr = current as unknown[];
                const index = arr.indexOf(value as unknown);

                let updated;
                if (index !== -1) {
                    updated = arr.filter(item => item !== value) as typeof current;
                } else {
                    updated = [...arr, value] as typeof current;
                }

                return {
                    ...prev,
                    [category]: updated,
                };
            }
            return prev;
        });
    }

    const clearAllFilters = () => {
        setSelectedFilters(prev => ({
            ...prev,
            fighterLocation: [],
            foundationStyle: [],
            amateurFights: [],
            fightCountRange: [],
            wins: [],
            losses: [],
            promotion: [],
            withTapology: false,
        }));
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
                    {/* 1. Локація */}
                    <Text style={styles.sectionTitle}>Fighter Location</Text>
                    <View style={styles.filterContainer}>
                        {cities.slice(0, 5).map(place => (
                            <FilterButton
                                key={place.id}
                                label={place.country.split(',')[0]}
                                selected={selectedFilters?.fighterLocation?.includes(
                                    place.country,
                                )}
                                onPress={() => toggleFilter('fighterLocation', place.country)}
                            />
                        ))}
                        {cities.length > 5 && (
                            <TouchableOpacity
                                onPress={() => handleMorePress('fighterLocation')}
                                style={styles.moreButton}>
                                <Text style={styles.moreButtonText}>
                                    + {cities.length - 5} more
                                </Text>
                                <Icon
                                    name={'chevron-right'}
                                    size={20}
                                    style={styles.moreButtonText}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 2. Foundation Styles */}
                    <Text style={styles.sectionTitle}>Foundation Style</Text>
                    <View style={styles.filterContainer}>
                        {foundationStyles.slice(0, 5).map(style => (
                            <FilterButton
                                key={style.id}
                                label={style.name}
                                selected={selectedFilters?.foundationStyle?.includes(
                                    style.name,
                                )}
                                onPress={() => toggleFilter('foundationStyle', style.name)}
                            />
                        ))}
                        {foundationStyles.length > 5 && (
                            <TouchableOpacity
                                onPress={() => handleMorePress('foundationStyle')}
                                style={styles.moreButton}>
                                <Text style={styles.moreButtonText}>
                                    + {foundationStyles.length - 5} more
                                </Text>
                                <Icon
                                    name={'chevron-right'}
                                    size={20}
                                    style={styles.moreButtonText}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 3. Tapology Link */}
                    <Text style={styles.sectionTitle}>Tapology</Text>
                    <View style={styles.matchTypeContainer}>
                        <TouchableOpacity
                            style={[
                                styles.matchTypeButton,
                                selectedFilters?.withTapology === false &&
                                styles.matchTypeButtonActive,
                            ]}
                            onPress={() =>
                                setSelectedFilters(prev => ({
                                    ...prev,
                                    withTapology: false,
                                }))
                            }>
                            <Text
                                style={[
                                    styles.matchTypeText,
                                    selectedFilters?.withTapology === false &&
                                    styles.matchTypeTextActive,
                                ]}>
                                All Fighters
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.matchTypeButton,
                                selectedFilters?.withTapology === true &&
                                styles.matchTypeButtonActive,
                            ]}
                            onPress={() =>
                                setSelectedFilters(prev => ({
                                    ...prev,
                                    withTapology: true,
                                }))
                            }>
                            <Text
                                style={[
                                    styles.matchTypeText,
                                    selectedFilters?.withTapology === true &&
                                    styles.matchTypeTextActive,
                                ]}>
                                Only with Tapology Link
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={styles.showResultsButton}
                    onPress={() => router.push('/search')}>
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
    clearButton: {
        position: 'absolute',
        right: 0,
    },
    clearText: {
        color: colors.primaryGreen,
        fontSize: 16,
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
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
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
    inputRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    input: {
        height: 56,
        borderColor: colors.gray,
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    rangeSeparator: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginHorizontal: 10,
    },
    sliderLabel: {
        fontSize: 14,
        color: colors.primaryBlack,
        marginBottom: 5,
    },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreButtonText: {
        color: colors.primaryGreen,
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
    },
    showResultsButton: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
        height: 56,
        justifyContent: 'center',
        marginBottom: 10,
    },
    showResultsText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
    // Стилі для групи кнопок типу боїв
    matchTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    matchTypeButton: {
        flex: 1,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },
    matchTypeButtonActive: {
        backgroundColor: colors.primaryGreen,
        borderColor: colors.primaryGreen,
    },
    matchTypeText: {
        fontSize: 12,
        color: colors.primaryBlack,
    },
    matchTypeTextActive: {
        color: colors.white,
        fontWeight: '600',
    },
});

export default FilterFighterScreen;
