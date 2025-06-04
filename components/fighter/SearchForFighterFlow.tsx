import {Alert, Keyboard, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import colors from '@/styles/colors';
import Filter from '@/assets/filter.svg';
import React, {useEffect, useState} from 'react';
import {useFilterFighter} from '@/context/FilterFighterContext';
import {getShortInfoFighters} from '@/service/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentLoader from '@/components/ContentLoader';
import {ShortInfoFighter} from '@/service/response';
import {useRouter} from "expo-router";
import FighterList from "@/app/(app)/manager/fighter";
import {RecentSearch} from "@/components/offers/RecentSearch";
import {ExistFighterFilter} from "@/components/ExistFighterFilter";
import {SearchInput} from "@/components/SearchInput";


interface SearchForFighterFlowProps {
    chooseFighter?: (fighterId: ShortInfoFighter) => void;
}

export function SearchForFighterFlow({
                                         chooseFighter,
                                     }: SearchForFighterFlowProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [fighters, setFighters] = useState<ShortInfoFighter[]>([]);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [filteredFighters, setFilteredFighters] = useState<ShortInfoFighter[]>([]);
    const {selectedFilters} = useFilterFighter();
    const router = useRouter();
    const [contentLoading, setContentLoading] = useState(false);

    useEffect(() => {
        setContentLoading(true);
        getShortInfoFighters()
            .then(res => {
                setFighters(res);
                setFilteredFighters(res);
            })
            .finally(() => setContentLoading(false));
    }, []);

    useEffect(() => {
        const filtered = fighters.filter(fighter => {
            const locationMatch =
                selectedFilters.fighterLocation.length === 0 ||
                selectedFilters.fighterLocation.some(location => {
                    const fighterCountry = fighter.country
                        .split(',')[0]
                        .trim()
                        .toLowerCase();
                    return fighterCountry === location.toLowerCase().trim();
                });

            const styleMatch =
                selectedFilters.foundationStyle.length === 0 ||
                selectedFilters.foundationStyle.some(style =>
                    fighter.foundationStyle.toLowerCase().includes(style.toLowerCase()),
                );
            return (
                locationMatch &&
                styleMatch &&
                (selectedFilters.withTapology ? fighter.hasTapologyLink : fighter) &&
                fighter.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredFighters(filtered);
    }, [fighters, searchQuery, selectedFilters]);

    useEffect(() => {
        loadSearchHistory();
    }, []);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const suggestionsMap = new Map<string, string>();

        fighters.forEach(fighter => {
            if (fighter.name.toLowerCase().includes(lowerQuery)) {
                suggestionsMap.set(fighter.name, 'Fighter Name');
            }
        });
    }, [searchQuery, fighters]);

    const loadSearchHistory = async () => {
        try {
            const history = await AsyncStorage.getItem('searchHistory');
            if (history) {
                setSearchHistory(JSON.parse(history));
            }
        } catch (error) {
            console.error('Failed to load search history:', error);
        }
    };

    const handleClearHistory = () => {
        setSearchHistory([]);
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            Alert.alert('Please enter a search query');
            return;
        }
        Keyboard.dismiss();
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleHistoryClick = (query: string) => {
        setSearchQuery(query);
        Keyboard.dismiss();
    };

    const handleRemoveFromHistory = (updatedHistory: string[]) => {
        setSearchHistory(updatedHistory);
    };

    const handleChooseFighter = (item: ShortInfoFighter) => {
        if (chooseFighter) {
            chooseFighter(item);
        } else {
            router.push(`/(app)/manager/fighter/${item.id}`);
        }
    };

    if (contentLoading) {
        return <ContentLoader/>;
    }
    return (
        <>
            <View>
                <View style={[styles.searchRow, {position: 'relative'}]}>
                    <SearchInput
                        value={searchQuery}
                        onChangeValue={setSearchQuery}
                        onSearch={handleSearch}
                        onClear={handleClearSearch}
                        setSearchHistory={setSearchHistory}
                        searchAudience={'fighter'}
                        asyncKey={'searchHistory'}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            router.push('/(filter)/all-fighter')
                        }}
                        style={styles.filterButton}>
                        <Filter width={16} height={16} color={colors.white}/>
                    </TouchableOpacity>
                </View>
                <ExistFighterFilter/>
            </View>

            <RecentSearch
                searchHistory={searchHistory}
                clearHistory={handleClearHistory}
                historyClick={handleHistoryClick}
                removeFromHistory={handleRemoveFromHistory}
                asyncKey="searchHistory"
            />
            {/* Якщо немає результатів */}
            {filteredFighters.length === 0 ? (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No fighters found.</Text>
                </View>
            ) : (
                // Якщо є — показуємо список
                <FighterList
                    fighters={filteredFighters}
                    handleChooseFighter={handleChooseFighter}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        flex: 1,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 10,
    },

    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },

    filterButton: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: colors.primaryGreen,
        justifyContent: 'center',
        alignItems: 'center',
    },

    noResultsContainer: {
        marginTop: 20,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    noResultsText: {
        fontSize: 16,
        color: colors.gray,
    },
});
