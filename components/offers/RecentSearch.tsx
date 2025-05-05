import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
    searchHistory: string[];
    clearHistory: () => void;
    historyClick: (query: string) => void;
    removeFromHistory: (updatedHistory: string[]) => void;
    asyncKey: string;
};
export const RecentSearch = ({
                                 searchHistory,
                                 clearHistory,
                                 historyClick,
                                 removeFromHistory,
                                 asyncKey,
                             }: Props) => {
    const handleClearHistory = async () => {
        try {
            await AsyncStorage.removeItem(asyncKey);
            clearHistory();
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    };

    const handleHistoryClick = (query: string) => {
        historyClick(query);
    };

    const handleRemoveFromHistory = (query: string) => {
        const updatedHistory = searchHistory.filter(item => item !== query);
        AsyncStorage.setItem(asyncKey, JSON.stringify(updatedHistory));
        removeFromHistory(updatedHistory);
    };

    if (!searchHistory.length) return null;
    return (
        <View style={styles.bottomHistoryContainer}>
            <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={handleClearHistory}>
                    <Text style={styles.clearHistoryText}>Clear History</Text>
                </TouchableOpacity>
            </View>

            {searchHistory.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.historyItem}
                    onPress={() => handleHistoryClick(item)}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon
                            name="history"
                            size={16}
                            color={colors.gray}
                            style={{marginRight: 8}}
                        />
                        <Text style={styles.historyText}>{item}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveFromHistory(item)}>
                        <Icon name="close" size={16} color={colors.gray} />
                    </TouchableOpacity>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    bottomHistoryContainer: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    clearHistoryText: {
        color: colors.primaryGreen,
        fontSize: 14,
    },
    historyItem: {
        paddingVertical: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    historyText: {
        fontSize: 14,
        color: colors.primaryBlack,
    },
});
