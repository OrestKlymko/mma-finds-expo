import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFilter} from '@/context/FilterContext';
import {getFilterForPublicOffers, getFilterForPublicOffersManager} from '@/service/service';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useAuth} from "@/context/AuthContext";


const FilterFullListEventNameScreen = () => {
    const insets = useSafeAreaInsets();
    const {role} = useAuth();
    const [allEvents, setAllEvents] = useState<string[]>(
        [],
    );
    const [search, setSearch] = useState('');

    const {selectedFilters, setSelectedFilters} = useFilter();

    useEffect(() => {
        if (role === 'MANAGER') {
            getFilterForPublicOffersManager().then(res => {
                setAllEvents(res.eventNames);
            });
        } else {
            getFilterForPublicOffers().then(res => {
                setAllEvents(res.eventNames);
            });
        }
    }, [role]);

    const toggleEventSelection = (eventName: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            eventName: prev.eventName?.includes(eventName)
                ? prev.eventName?.filter(item => item !== eventName)
                : [...prev.eventName, eventName],
        }));
    };

    const clearAll = () => {
        setSelectedFilters(prev => ({
            ...prev,
            eventName: [],
        }));
    };

    const filteredEvents = allEvents.filter(e =>
        e?.toLowerCase()?.includes(search?.toLowerCase()),
    );

    return (
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            <GoBackButton />

            <View style={styles.headerContainer}>
                <Text style={styles.title}>Event Name</Text>
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
                {filteredEvents.map((item, index) => {
                    const isSelected = selectedFilters.eventName.includes(item);
                    const rowBackground = index % 2 === 0 ? '#F2F2F2' : colors.white;

                    return (
                        <TouchableOpacity
                            key={item}
                            style={[styles.itemRow, {backgroundColor: rowBackground}]}
                            onPress={() => toggleEventSelection(item)}>
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

export default FilterFullListEventNameScreen;

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
