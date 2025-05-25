import React, {useEffect, useState} from 'react';
import {Alert, Keyboard, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import colors from '@/styles/colors';
import Filter from '@/assets/filter.svg';
import {useFilterFighter} from '@/context/FilterFighterContext';
import {getAllManagers} from '@/service/service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentLoader from '@/components/ContentLoader';
import {useRouter} from "expo-router";
import {SearchInput} from "@/components/SearchInput";
import {RecentSearch} from "@/components/offers/RecentSearch";
import {ExistFilter} from "@/components/ExistFilter";
import ManagerList from "@/components/fighter/ManagerList";

export function SearchForManagerFlow() {
    const [searchQuery, setSearchQuery] = useState('');
    const [fighters, setFighters] = useState<any[]>([]);
    const [filteredFighters, setFilteredFighters] = useState<any[]>([]);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [contentLoading, setContentLoading] = useState(false);

    const {selectedFilters} = useFilterFighter();
    const router = useRouter();

    useEffect(() => {
        setContentLoading(true);
        getAllManagers()
            .then(res => {
                setFighters(res);
                setFilteredFighters(res);
            })
            .finally(() => {
                setContentLoading(false);
            });
    }, []);

    useEffect(() => {
        const filtered = fighters.filter(fighter => {
            const locationMatch =
                selectedFilters.managerLocation.length === 0 ||
                selectedFilters.managerLocation.some(location =>
                    fighter.countryName
                        ?.toLowerCase()
                        .includes(location.toLowerCase().trim()),
                );
            return (
                locationMatch &&
                fighter.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredFighters(filtered);
    }, [fighters, searchQuery, selectedFilters]);

    useEffect(() => {
        loadSearchHistory();
    }, []);

    const loadSearchHistory = async () => {
        try {
            const history = await AsyncStorage.getItem('searchHistoryManager');
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

    const handleRemoveFromHistory = (updatedHistory: string[]) => {
        setSearchHistory(updatedHistory);
    };

    const onSearchPress = () => {
        if (!searchQuery.trim()) {
            Alert.alert('Please enter a search query');
            return;
        }
        Keyboard.dismiss();
    };

    const onClearPress = () => {
        setSearchQuery('');
    };

    const handleHistoryClick = (query: string) => {
        setSearchQuery(query);
        Keyboard.dismiss();
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
                        onSearch={onSearchPress}
                        onClear={onClearPress}
                        setSearchHistory={setSearchHistory}
                        searchAudience={'manager'}
                        asyncKey={'searchHistoryManager'}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            router.push('/(filter)/manager')
                        }}
                        style={styles.filterButton}>
                        <Filter width={16} height={16} color={colors.white}/>
                    </TouchableOpacity>
                </View>

                <ExistFilter/>
            </View>

            <RecentSearch
                searchHistory={searchHistory}
                historyClick={handleHistoryClick}
                clearHistory={handleClearHistory}
                removeFromHistory={handleRemoveFromHistory}
                asyncKey='searchHistoryManager'
            />

            {filteredFighters.length === 0 ? (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No managers found.</Text>
                </View>
            ) : (
                <ManagerList
                    fighters={filteredFighters}
                    handleChooseFighter={item => {
                        console.log(item);
                        router.push(`/(app)/manager/${item.managerId}`)
                    }}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
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
