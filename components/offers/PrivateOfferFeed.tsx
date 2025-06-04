import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import colors from "@/styles/colors";
import React, {useCallback, useState} from "react";
import {ExclusiveOfferInfo, MultiContractShortInfo, PublicOfferInfo} from "@/service/response";
import {useRouter} from "expo-router";
import {useFilter} from "@/context/FilterContext";
import {useFocusEffect} from "@react-navigation/native";
import {getAllPrivateOffers, getMultiFightOffers} from "@/service/service";
import {Filter, OfferTypeEnum} from "@/models/model";
import ContentLoader from "@/components/ContentLoader";
import Ionicons from "@expo/vector-icons/Ionicons";
import OfferListForFighter from "@/components/offers/OfferListForFighter";
import FilterLogo from "@/assets/filter.svg";
import {ExclusiveOfferList} from "@/components/offers/ExclusiveOfferList";

interface PrivateOfferFeedProps {
    showMyOffers: boolean
}

export const PrivateOfferFeed = ({showMyOffers}: PrivateOfferFeedProps) => {
    const [privateOffers, setPrivateOffers] = useState<ExclusiveOfferInfo[]>([]);
    const [multiFightOffers, setMultiFightOffers] = useState<MultiContractShortInfo[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const {selectedFilters, setSelectedFilters} = useFilter();
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setContentLoading(true);

            if (!selectedFilters.offerType.includes('Multi-Fight') || selectedFilters.offerType.length === 0) {
                getMultiFightOffers()
                    .then(setMultiFightOffers)
                    .catch(() => setMultiFightOffers([]));
            }

            if (selectedFilters.offerType.includes('Single Bout') || selectedFilters.offerType.length === 0) {
                getAllPrivateOffers(null, null)
                    .then((res) => {
                        const filteredOffers = res.filter((offer: PublicOfferInfo | ExclusiveOfferInfo) => {
                            const bySubmission = showMyOffers ? offer.isSubmitted : true;

                            const placeOk =
                                selectedFilters.eventPlace.length === 0 ||
                                selectedFilters.eventPlace.some((place) =>
                                    offer.country.includes(place)
                                );

                            // 2.2) Фільтр за назвою події
                            const nameOk =
                                selectedFilters.eventName.length === 0 ||
                                selectedFilters.eventName.includes(offer.eventName);

                            // 2.3) Фільтр за промоушеном
                            const promoOk =
                                selectedFilters.promotion.length === 0 ||
                                selectedFilters.promotion.includes(offer.promotionName);

                            // 2.4) Фільтр за ваговою категорією
                            const weightOk =
                                selectedFilters.weightClass.length === 0 ||
                                selectedFilters.weightClass.includes(offer.weightClass);

                            // 2.5) Фільтр за правилами (Professional/Amateur)
                            const rulesOk =
                                selectedFilters.rules.length === 0 ||
                                selectedFilters.rules.includes(
                                    offer.isFightTitled ? "Professional" : "Ammateur"
                                );

                            return placeOk && nameOk && promoOk && weightOk && rulesOk && bySubmission;
                        });
                        setPrivateOffers(filteredOffers);
                    })
                    .catch(() => setPrivateOffers([]))
                    .finally(() => setContentLoading(false));
            }
        }, [selectedFilters, showMyOffers])
    );

    const removeFilter = (category: string, value: string) => {
        setSelectedFilters(prev => {
            const currentValues = prev[category as keyof Filter] ?? [];
            if (!Array.isArray(currentValues)) {
                return prev;
            }
            const updated = currentValues.filter(item => item !== value);
            return {
                ...prev,
                [category]: updated,
            };
        });
    };

    const renderFilters = () => {
        const filters = [
            ...selectedFilters.eventPlace.map(f => ({
                category: 'eventPlace',
                value: f,
            })),
            ...selectedFilters.weightClass.map(f => ({
                category: 'weightClass',
                value: f,
            })),
            ...selectedFilters.rules.map(f => ({category: 'rules', value: f})),
            ...selectedFilters.promotion.map(f => ({
                category: 'promotion',
                value: f,
            })),
            ...selectedFilters.eventName.map(f => ({
                category: 'eventName',
                value: f,
            })),
            ...selectedFilters.fighterName.map(f => ({
                category: 'fighterName',
                value: f,
            })),
            ...selectedFilters.offerType.map(f => ({
                category: 'offerType',
                value: f,
            })),

        ];

        if (filters.length === 0) return null;

        if (contentLoading) {
            return <ContentLoader/>;
        }
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}>
                {filters.map((filter, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.filterChip}
                        onPress={() => removeFilter(filter.category, filter.value)}>
                        <Text style={styles.filterText}>{filter.value.split(',')[0]}</Text>
                        <Ionicons name="close" size={14} color={colors.white}/>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };
    const renderContent = () => {
        return privateOffers.length > 0 ? (
            <ExclusiveOfferList offers={privateOffers} multiContractOffers={multiFightOffers}/>
        ) : (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.noOffersText}>No Public Offers Available</Text>
            </View>
        );
    };

    return <><View>
        <View style={styles.searchContainerCommon}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for an offer..."
                    placeholderTextColor={colors.gray}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color={colors.primaryBlack}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => router.push('/(filter)/exclusive-offer')}
                style={styles.filterButton}>
                <FilterLogo width={16} height={16} color={colors.primaryBlack}/>
            </TouchableOpacity>
        </View>
        {renderFilters()}
    </View>
        {renderContent()}</>
};

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
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        marginRight: 10,
    },

    searchContainerCommon: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    noOffersText: {
        textAlign: 'center',
        fontSize: 14,
        color: colors.gray,
    },
    createButton: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
        height: 56,
        justifyContent: 'center',
        marginBottom: 50,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
    filterButton: {
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: colors.primaryGreen,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primaryGreen,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
        marginRight: 5,
        height: 56,
    },
    filterText: {
        fontSize: 14,
        color: colors.white,
    },
});
