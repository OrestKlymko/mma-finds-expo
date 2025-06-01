import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {Filter} from "@/models/model";

type OfferTabProps = {
    selectedTab: 'Public' | 'Private';
    setSelectedTab: (tab: 'Public' | 'Private') => void;
    setSelectedFilters: React.Dispatch<React.SetStateAction<any>>;
};

export const OfferTab: React.FC<OfferTabProps> = ({
                                                      selectedTab,
                                                      setSelectedTab,
                                                      setSelectedFilters,
                                                  }) => {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tab, selectedTab === 'Public' && styles.tabActive]}
                onPress={() => {
                    setSelectedTab('Public');
                    setSelectedFilters((prev: Filter) => ({
                        ...prev,
                        activeTab: 'Public',
                    }));
                }}>
                <Text
                    style={[
                        styles.tabText,
                        selectedTab === 'Public' && styles.tabTextActive,
                    ]}>
                    Public
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, selectedTab === 'Private' && styles.tabActive]}
                onPress={() => {
                    setSelectedTab('Private');
                    setSelectedFilters((prev: Filter) => ({
                        ...prev,
                        activeTab: 'Private',
                    }));
                }}>
                <Text
                    style={[
                        styles.tabText,
                        selectedTab === 'Private' && styles.tabTextActive,
                    ]}>
                    Private
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 17,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        marginHorizontal: 4,
    },
    tabActive: {
        backgroundColor: colors.primaryGreen,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    tabTextActive: {
        color: colors.white,
    },
});
