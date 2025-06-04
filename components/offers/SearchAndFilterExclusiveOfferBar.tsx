import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import Filter from '@/assets/filter.svg';
import React, {useEffect} from 'react';
import colors from '@/styles/colors';
import {useExclusiveOfferFilter} from '@/context/ExclusiveOfferFilterContext';
import {ExclusiveOfferInfo} from '@/service/response';
import {ActiveFilterList} from "@/components/ActiveFilterList";
import {useRouter} from "expo-router";

interface SearchAndFilterOfferBarProps {
    offers?: ExclusiveOfferInfo[];
    getFilteredOffers: (offers: ExclusiveOfferInfo[]) => void;
    multiContractOffers?: ExclusiveOfferInfo[];
    getFilteredMultiContractOffers?: (value: ExclusiveOfferInfo[]) => void;
}

export function SearchAndFilterExclusiveOfferBar({
                                                     offers,
                                                     getFilteredOffers,
                                                     multiContractOffers,
                                                     getFilteredMultiContractOffers,
                                                 }: SearchAndFilterOfferBarProps) {
    const {selectedExOfferFilters} = useExclusiveOfferFilter();
    const [searchQuery, setSearchQuery] = React.useState('');
    const router = useRouter();
    useEffect(() => {
        filteredOffers();
        filteredMultiOffers();
    }, [offers, multiContractOffers, searchQuery, selectedExOfferFilters]);

    const filteredOffers = () => {
        if (!offers) return;

        if (
            (selectedExOfferFilters.offerType.length !== 0 &&
                selectedExOfferFilters.offerType.includes('Single Bout')) ||
            selectedExOfferFilters.offerType.length === 0
        ) {
            const result = offers?.filter(offer => {
                const matchesEventName =
                    selectedExOfferFilters.eventName.length === 0 ||
                    selectedExOfferFilters.eventName.includes(offer?.eventName);
                const matchesFighterName =
                    searchQuery.length === 0 ||
                    offer?.opponentName?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    offer?.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    offer?.eventDate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    offer?.opponentName?.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesEventName && matchesFighterName;
            });
            getFilteredOffers(result);
        } else {
            getFilteredOffers([]);
        }
    };

    const filteredMultiOffers = () => {
        if (!multiContractOffers) return;
        if (
            (selectedExOfferFilters.offerType.length !== 0 &&
                selectedExOfferFilters.offerType.includes('Multi-Fight')) ||
            (selectedExOfferFilters.offerType.length === 0 &&
                selectedExOfferFilters.eventName.length === 0)
        ) {
            const multiResult = multiContractOffers.filter(
                offer =>
                    searchQuery.length === 0 ||
                    offer?.fighterName.toLowerCase().includes(searchQuery.toLowerCase()),
            );
            if (getFilteredMultiContractOffers) {
                getFilteredMultiContractOffers(multiResult);
            }
        } else if (getFilteredMultiContractOffers) {
            getFilteredMultiContractOffers([]);
        }
    };

    return (
        <View style={styles.searchBar}>
            <View style={styles.searchContainerCommon}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search an offer..."
                        placeholderTextColor={colors.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity>
                        <Icon name="magnify" size={24} color={colors.primaryBlack} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        router.push('/(filter)/exclusive-offer')
                    }}
                    style={styles.filterButton}>
                    <Filter width={16} height={16} color={colors.primaryBlack} />
                </TouchableOpacity>
            </View>
            <ActiveFilterList />
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        marginRight: 10,
    },
    filterButton: {
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: colors.primaryGreen,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
    },

    searchContainerCommon: {
        flexDirection: 'row',
        gap: 10,
    },
    searchBar: {
        marginBottom: 10,
    },
});
