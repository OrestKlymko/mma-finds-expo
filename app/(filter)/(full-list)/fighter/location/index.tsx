import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';

import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {getCountries} from '@/service/service';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useFilterFighter} from '@/context/FilterFighterContext';
import ContentLoader from '@/components/ContentLoader';
import {CountryResponse} from '@/service/response';


type RegionGroup = {
    title: string;
    countries: CountryResponse[];
};

const FullListScreen = () => {
    const insets = useSafeAreaInsets();
    const {selectedFilters, setSelectedFilters} = useFilterFighter();

    const [search, setSearch] = useState('');
    const [regions, setRegions] = useState<RegionGroup[]>([]);
    const [contentLoading, setContentLoading] = useState(false);
    useEffect(() => {
        setContentLoading(true);
        getCountries()
            .then((res: CountryResponse[]) => {
                const grouped: Record<string, CountryResponse[]> = {};

                res.forEach(item => {
                    const groupName = item.continent ? item.continent : 'Other';

                    if (!grouped[groupName]) {
                        grouped[groupName] = [];
                    }
                    grouped[groupName].push(item);
                });

                const regionGroups: RegionGroup[] = Object.keys(grouped).map(cont => ({
                    title: cont,
                    countries: grouped[cont],
                }));

                setRegions(regionGroups);
            })
            .finally(() => {
                setContentLoading(false);
            });
    }, []);

    const toggleCountrySelection = (countryName: string) => {
        setSelectedFilters(prev => {
            const currentlySelected = prev.fighterLocation || [];
            if (currentlySelected.includes(countryName)) {
                return {
                    ...prev,
                    fighterLocation: currentlySelected.filter(c => c !== countryName),
                };
            }
            // otherwise -> add
            return {
                ...prev,
                fighterLocation: [...currentlySelected, countryName],
            };
        });
    };

    const toggleRegionSelection = (region: RegionGroup) => {
        const regionAllCountries = region.countries.map(c => c.country);
        const allSelected = regionAllCountries.every(c =>
            selectedFilters.fighterLocation.includes(c),
        );

        setSelectedFilters(prev => {
            const currentList = prev.fighterLocation || [];

            if (allSelected) {
                const newList = currentList.filter(
                    c => !regionAllCountries.includes(c),
                );
                return {...prev, fighterLocation: newList};
            } else {
                const merged = new Set([...currentList, ...regionAllCountries]);
                return {...prev, fighterLocation: Array.from(merged)};
            }
        });
    };

    const clearAll = () => {
        setSelectedFilters(prev => ({
            ...prev,
            fighterLocation: [],
        }));
    };

    if (contentLoading) {
        return <ContentLoader />;
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Location</Text>
                    <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor={colors.gray}
                        style={styles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                    />
                    <Icon name="magnify" size={20} color={colors.gray} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {regions.map(region => {
                        const regionAllCountries = region.countries.map(c => c.country);
                        const isRegionSelected = regionAllCountries.every(c =>
                            selectedFilters.fighterLocation.includes(c),
                        );
                        const filteredCountries = region.countries.filter(c =>
                            c.country.toLowerCase().includes(search.toLowerCase()),
                        );

                        if (filteredCountries.length === 0) return null;

                        return (
                            <View key={region.title}>
                                <TouchableOpacity
                                    style={styles.regionHeader}
                                    onPress={() => toggleRegionSelection(region)}>
                                    <Text style={styles.regionTitle}>{region.title}</Text>
                                    <View style={styles.checkbox}>
                                        {isRegionSelected && (
                                            <Icon
                                                name="check"
                                                size={14}
                                                color={colors.primaryGreen}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>

                                {filteredCountries.map((countryItem, index) => {
                                    const isSelected = selectedFilters.fighterLocation.includes(
                                        countryItem.country,
                                    );
                                    const backgroundColor =
                                        index % 2 === 0 ? '#F2F2F2' : colors.white;

                                    return (
                                        <TouchableOpacity
                                            key={countryItem.id}
                                            style={[styles.countryItem, {backgroundColor}]}
                                            onPress={() =>
                                                toggleCountrySelection(countryItem.country)
                                            }>
                                            <Text style={styles.countryText}>
                                                {countryItem.country}
                                            </Text>
                                            <View style={styles.checkbox}>
                                                {isSelected && (
                                                    <Icon
                                                        name="check"
                                                        size={14}
                                                        color={colors.primaryGreen}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

export default FullListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 20,
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        height: 56,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
    },
    regionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 6,
        paddingVertical: 6,
    },
    regionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryGreen,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 6,
        borderRadius: 7,
    },
    countryText: {
        fontSize: 11,
        fontWeight: '400',
        color: colors.primaryBlack,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
