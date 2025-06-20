import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import colors from "@/styles/colors";
import React, {useCallback, useState} from "react";
import {ExclusiveOfferInfo, MultiContractShortInfo, PublicOfferInfo} from "@/service/response";
import {useRouter} from "expo-router";
import {useFocusEffect} from "@react-navigation/native";
import {getAllPrivateOffers, getMultiFightOffers} from "@/service/service";
import ContentLoader from "@/components/ContentLoader";
import Ionicons from "@expo/vector-icons/Ionicons";
import FilterLogo from "@/assets/filter.svg";
import {ExclusiveOfferList} from "@/components/offers/ExclusiveOfferList";
import {useExclusiveOfferFilter} from "@/context/ExclusiveOfferFilterContext";
import {ExclusiveOfferFilter} from "@/context/model/model";

interface PrivateOfferFeedProps {
    showMyOffers: boolean
}

export const PrivateOfferFeed = ({showMyOffers}: PrivateOfferFeedProps) => {
    const [privateOffers, setPrivateOffers] = useState<ExclusiveOfferInfo[]>([]);
    const [multiFightOffers, setMultiFightOffers] = useState<MultiContractShortInfo[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const {selectedExOfferFilters, setSelectedExOfferFilters} = useExclusiveOfferFilter();
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            setContentLoading(true);

            // Збираємо проміси у масив залежно від фільтрів
            const promises: Promise<void>[] = [];

            // Якщо потрібно отримувати Multi-Fight офери
            if (
                !selectedExOfferFilters.offerType.includes("Multi-Fight") ||
                selectedExOfferFilters.offerType.length === 0
            ) {
                const p1 = getMultiFightOffers()
                    .then((data) => {
                        if (!isActive) return;
                        setMultiFightOffers(data);
                    })
                    .catch(() => {
                        if (!isActive) return;
                        setMultiFightOffers([]);
                    });
                promises.push(p1);
            }

            // Якщо потрібно отримувати Single Bout (приватні) офери
            if (
                selectedExOfferFilters.offerType.includes("Single Bout") ||
                selectedExOfferFilters.offerType.length === 0
            ) {
                const p2 = getAllPrivateOffers(null, null)
                    .then((res) => {
                        if (!isActive) return;
                        const filteredOffers = res.filter(
                            (offer: PublicOfferInfo | ExclusiveOfferInfo) => {
                                const bySubmission = showMyOffers ? offer.isSubmitted : true;

                                // 2.2) Фільтр за назвою події
                                const nameOk =
                                    selectedExOfferFilters.eventName.length === 0 ||
                                    selectedExOfferFilters.eventName.includes(offer.eventName);

                                return nameOk && bySubmission;
                            }
                        );
                        setPrivateOffers(filteredOffers);
                    })
                    .catch(() => {
                        if (!isActive) return;
                        setPrivateOffers([]);
                    });
                promises.push(p2);
            }

            // Коли всі проміси виконаються (або хоча б один провалиться), виключаємо лоадер
            Promise.all(promises)
                .catch(() => {
                    // тут, при потребі, можна обробити глобальну помилку
                })
                .finally(() => {
                    if (isActive) setContentLoading(false);
                });

            return () => {
                // Якщо екран втратить фокус/відмонтований, ми не будемо оновлювати стейт
                isActive = false;
            };
        }, [selectedExOfferFilters, showMyOffers])
    );


    const removeFilter = (category: string, value: string) => {
        setSelectedExOfferFilters(prev => {
            const currentValues = prev[category as keyof ExclusiveOfferFilter] ?? [];
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
            ...selectedExOfferFilters.eventName.map(f => ({
                category: 'eventName',
                value: f,
            })),
            ...selectedExOfferFilters.fighterName.map(f => ({
                category: 'fighterName',
                value: f,
            })),
            ...selectedExOfferFilters.offerType.map(f => ({
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
                <Text style={styles.noOffersText}>No Private Offers Available</Text>
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
