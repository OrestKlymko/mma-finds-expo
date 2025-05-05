import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFilter} from '@/context/FilterContext';
import {getAllPromotionName} from '@/service/service';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {PromotionNameResponse} from '@/service/response';

const FilterFullListPromotionScreen = () => {
    const insets = useSafeAreaInsets();

    const [allPromotions, setAllPromotions] = useState<PromotionNameResponse[]>(
        [],
    );
    const [search, setSearch] = useState('');

    const {selectedFilters, setSelectedFilters} = useFilter();

    useEffect(() => {
        getAllPromotionName().then(res => {
            setAllPromotions(res);
        });
    }, []);

    const togglePromotionSelection = (promoName: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            promotion: prev.promotion.includes(promoName)
                ? prev.promotion.filter(item => item !== promoName)
                : [...prev.promotion, promoName],
        }));
    };

    const clearAll = () => {
        setSelectedFilters(prev => ({
            ...prev,
            promotion: [],
        }));
    };

    const filteredPromotions = allPromotions.filter(p =>
        p.promotionName.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            <GoBackButton />

            <View style={styles.headerContainer}>
                <Text style={styles.title}>Promotions</Text>
                <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
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
                    const isSelected = selectedFilters.promotion.includes(
                        item.promotionName,
                    );
                    const rowBackground = index % 2 === 0 ? '#F2F2F2' : colors.white;

                    return (
                        <TouchableOpacity
                            key={item.promotionName}
                            style={[styles.itemRow, {backgroundColor: rowBackground}]}
                            onPress={() => togglePromotionSelection(item.promotionName)}>
                            <Text style={styles.itemText}>{item.promotionName}</Text>
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
