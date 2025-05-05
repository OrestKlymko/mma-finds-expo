import React, {useRef} from 'react';
import {Alert, Keyboard, StyleSheet, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SearchInputProps = {
    value: string;
    onChangeValue: (text: string) => void;
    onSearch?: () => void;
    onClear?: () => void;
    setSearchHistory: (history: string[]) => void;
    asyncKey: string;
    searchAudience: string;
};

export const SearchInput: React.FC<SearchInputProps> = ({
                                                            value,
                                                            onChangeValue,
                                                            onSearch,
                                                            onClear,
                                                            setSearchHistory,
                                                            asyncKey,
                                                            searchAudience
                                                        }) => {
    const searchInputRef = useRef<TextInput>(null);

    const handleSearch = () => {
        if (!value.trim()) {
            Alert.alert('Please enter a search query');
            return;
        }
        Keyboard.dismiss();
        onSearch?.();
    };

    const handleClear = () => {
        onChangeValue('');
        onClear?.();
    };

    const handleBlurLocal = () => {
        if (value.trim()) {
            saveToSearchHistory(value.trim());
        }
    };

    const saveToSearchHistory = async (query: string) => {
        if (!query.trim()) return;
        try {
            const storedHistory = await AsyncStorage.getItem(asyncKey);
            let updatedHistory = [...JSON.parse(storedHistory || '[]')];
            if (!updatedHistory.includes(query)) {
                updatedHistory = [query, ...updatedHistory].slice(0, 10);
                await AsyncStorage.setItem(
                    asyncKey,
                    JSON.stringify(updatedHistory),
                );
                setSearchHistory(updatedHistory);
            }
        } catch (error) {
            console.error('Failed to save search history:', error);
        }
    };

    return (
        <View style={styles.searchContainer}>
            <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder={`Search for a ${searchAudience}...`}
                placeholderTextColor={colors.gray}
                value={value}
                onChangeText={onChangeValue}
                onBlur={handleBlurLocal}
            />
            {value ? (
                <TouchableOpacity
                    onPress={handleClear}
                    style={styles.searchIconContainer}>
                    <Icon name="close" size={20} color={colors.primaryBlack} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={handleSearch}
                    style={styles.searchIconContainer}>
                    <Icon name="magnify" size={20} color={colors.primaryBlack} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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
});
