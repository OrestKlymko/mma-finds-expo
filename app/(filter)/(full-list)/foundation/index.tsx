import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {getFoundationStyles} from '@/service/service';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFilterFighter} from '@/context/FilterFighterContext';
import {FoundationStyleResponse} from '@/service/response';


const FilterFullListFoundationStyle = () => {
    const insets = useSafeAreaInsets();
    const {selectedFilters, setSelectedFilters} = useFilterFighter();
    const [search, setSearch] = useState('');
    const [foundationStyles, setFoundationStyles] = useState<FoundationStyleResponse[]>([]);

    useEffect(() => {
        getFoundationStyles().then(setFoundationStyles);
    }, []);

    const toggleFoundationStyle = (style: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            foundationStyle: prev.foundationStyle.includes(style)
                ? prev.foundationStyle.filter(s => s !== style)
                : [...prev.foundationStyle, style],
        }));
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                {/* Заголовок */}
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Foundation Styles</Text>
                    <TouchableOpacity
                        onPress={() => setSelectedFilters(prev => ({...prev, foundationStyle: []}))}
                        style={styles.clearButton}>
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
                    {foundationStyles
                        .filter(style => style.name.toLowerCase().includes(search.toLowerCase()))
                        .map((style, index) => {
                            const isSelected = selectedFilters.foundationStyle.includes(style.name);
                            const backgroundColor = index % 2 === 0 ? '#F2F2F2' : colors.white;

                            return (
                                <TouchableOpacity
                                    key={style.id}
                                    style={[styles.styleItem, {backgroundColor}]}
                                    onPress={() => toggleFoundationStyle(style.name)}>
                                    <Text style={styles.styleText}>{style.name}</Text>
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
        </View>
    );
};

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
    styleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 7,
        marginBottom: 5,
    },
    styleText: {
        fontSize: 14,
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

export default FilterFullListFoundationStyle;
