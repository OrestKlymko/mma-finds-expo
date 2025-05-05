import {Alert, Keyboard, StyleSheet, TextInput, TouchableOpacity, View,} from 'react-native';
import colors from '@/styles/colors';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import Filter from '@/assets/filter.svg';
import React from 'react';
import {useRouter} from "expo-router";
type SearchSectionProps = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
};

export const SearchSection = ({
                                  searchQuery,
                                  setSearchQuery,
                              }: SearchSectionProps) => {
    const router = useRouter();

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            Alert.alert('Please enter a search query');
            return;
        }
        Keyboard.dismiss();
    };

    return (
        <View style={[styles.searchRow, {position: 'relative'}]}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={`Search for a fighter...`}
                    placeholderTextColor={colors.gray}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                    onPress={handleSearch}
                    style={styles.searchIconContainer}>
                    <Icon name="magnify" size={20} color={colors.primaryBlack} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => {
                    router.push('/(filter)/submitted-fighters')
                }}
                style={styles.filterButton}>
                <Filter width={16} height={16} color={colors.white} />
            </TouchableOpacity>
            <View />
        </View>
    );
};

const styles = StyleSheet.create({
    // Пошуковий рядок
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        // position: 'relative' -> додали inline
    },
    searchContainer: {
        flex: 1,
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        paddingVertical: 10,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIconContainer: {
        padding: 4,
    },
    filterButton: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: colors.primaryGreen,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
