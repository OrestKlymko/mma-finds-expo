import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {Filter} from "@/models/model";

type OfferTabProps = {
    selectedTab: 'Public' | 'Exclusive';
    setSelectedTab: (tab: 'Public' | 'Exclusive') => void;
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
                style={[styles.tab, selectedTab === 'Exclusive' && styles.tabActive]}
                onPress={() => {
                    setSelectedTab('Exclusive');
                    setSelectedFilters((prev: Filter) => ({
                        ...prev,
                        activeTab: 'Exclusive',
                    }));
                }}>
                <Text
                    style={[
                        styles.tabText,
                        selectedTab === 'Exclusive' && styles.tabTextActive,
                    ]}>
                    Exclusive
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
