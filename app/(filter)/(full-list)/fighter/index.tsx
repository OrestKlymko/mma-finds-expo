import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';

import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {getFilterForExclusiveOffers} from '@/service/service';
import {useExclusiveOfferFilter} from '@/context/ExclusiveOfferFilterContext';
import ContentLoader from '@/components/ContentLoader';

const FilterFullListPromotionScreen = () => {
    const insets = useSafeAreaInsets();
    const [fighters, setFighters] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [contentLoading, setContentLoading] = useState(false);
    const {selectedExOfferFilters, setSelectedExOfferFilters} =
        useExclusiveOfferFilter();

    useEffect(() => {
        setContentLoading(true);
        getFilterForExclusiveOffers()
            .then(res => {
                setFighters(res.fighterNames);
            })
            .finally(() => {
                setContentLoading(false);
            });
    }, []);

    const togglePromotionSelection = (fighterName: string) => {
        setSelectedExOfferFilters(prev => ({
            ...prev,
            fighterName: prev.fighterName.includes(fighterName)
                ? prev.fighterName.filter(item => item !== fighterName)
                : [...prev.fighterName, fighterName],
        }));
    };

    const clearAll = () => {
        setSelectedExOfferFilters(prev => ({
            ...prev,
            fighterName: [],
        }));
    };

    const filteredPromotions = fighters.filter(p =>
        p.toLowerCase().includes(search.toLowerCase()),
    );

    if (contentLoading) {
        return <ContentLoader />;
    }
    return (
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            <GoBackButton />

            <View style={styles.headerContainer}>
                <Text style={styles.title}>Fighters</Text>
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
                {filteredPromotions.map((item, index) => {
                    const isSelected = selectedExOfferFilters.fighterName.includes(item);
                    const rowBackground = index % 2 === 0 ? '#F2F2F2' : colors.white;

                    return (
                        <TouchableOpacity
                            key={item}
                            style={[styles.itemRow, {backgroundColor: rowBackground}]}
                            onPress={() => togglePromotionSelection(item)}>
                            <Text style={styles.itemText}>{item}</Text>
                            <View style={styles.checkbox}>
                                {isSelected && (
                                    <Icon name="check" size={14} color={colors.primaryGreen} />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default FilterFullListPromotionScreen;

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
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 7,
    },
    itemText: {
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
