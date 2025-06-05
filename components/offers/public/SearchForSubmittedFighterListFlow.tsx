import {Alert, StyleSheet, Text, View} from 'react-native';
import colors from '@/styles/colors';
import React, {useEffect, useState} from 'react';
import {getExclusiveOfferInfoById, getPublicOfferInfoById} from '@/service/service';
import {useSubmittedFilterFighter} from '@/context/SubmittedFilterFighterContext';
import ContentLoader from '@/components/ContentLoader';
import {ShortInfoFighter} from '@/service/response';
import {ExistsFilter} from "@/components/offers/public/ExistsFilter";
import {SearchSection} from "@/components/offers/public/SearchSection";
import {useRouter} from "expo-router";
import {SubmittedFighterList} from "@/components/offers/public/SubmittedFighterList";
import {OfferTypeEnum} from "@/models/model";
import {useSubmittedFighter} from "@/context/SubmittedFighterContext";

interface SearchForSubmittedFighterListFlowProps {
    offerId?: string | null,
    currency?: string,
    excludeFighterId?: string,
    eligibleToSelect?: boolean | null,
    offerType?: OfferTypeEnum | null
}

export function SearchForSubmittedFighterListFlow({
                                                      offerId,
                                                      currency,
                                                      excludeFighterId,
                                                      eligibleToSelect,
                                                      offerType
                                                  }: SearchForSubmittedFighterListFlowProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [fighters, setFighters] = useState<ShortInfoFighter[]>([]);
    const [filteredFighters, setFilteredFighters] = useState<ShortInfoFighter[]>([]);
    const {availableFilters} = useSubmittedFilterFighter();
    const {store, setStore} = useSubmittedFighter();
    const router = useRouter();
    const [contentLoading, setContentLoading] = useState(false);
    useEffect(() => {
        setContentLoading(true);
        if (!availableFilters.offerId) return;
        if (offerType && offerType === OfferTypeEnum.PRIVATE) {
            getExclusiveOfferInfoById(availableFilters.offerId, null)
                .then(res => {
                    console.log(res);
                    if (excludeFighterId) {
                        setFighters(
                            res.submittedFighters.filter(
                                (fighter: ShortInfoFighter) => fighter.id !== excludeFighterId,
                            ),
                        );
                        setFilteredFighters(
                            res.submittedFighters.filter(
                                (fighter: ShortInfoFighter) => fighter.id !== excludeFighterId,
                            ),
                        );
                    } else {
                        setFighters(res.submittedFighters);
                        setFilteredFighters(res.submittedFighters);
                    }
                })
                .catch(error => {
                    console.error('Error loading offer content:', error);
                })
                .finally(() => {
                    setContentLoading(false);
                })
            return;
        }

        getPublicOfferInfoById(availableFilters.offerId, null)
            .then(res => {
                if (excludeFighterId) {
                    setFighters(
                        res.fighters.filter(
                            (fighter: ShortInfoFighter) => fighter.id !== excludeFighterId,
                        ),
                    );
                    setFilteredFighters(
                        res.fighters.filter(
                            (fighter: ShortInfoFighter) => fighter.id !== excludeFighterId,
                        ),
                    );
                } else {
                    setFighters(res.fighters);
                    setFilteredFighters(res.fighters);
                }
            })
            .finally(() => {
                setContentLoading(false);
            });
    }, [availableFilters, availableFilters.offerId, excludeFighterId]);

    useEffect(() => {
        const filtered = fighters.filter(fighter => {
            const locationMatch =
                availableFilters.locations.length === 0 ||
                availableFilters.locations.some(location => {
                    const fighterCountry = fighter.country
                        .split(',')[0]
                        .trim()
                        .toLowerCase();
                    return fighterCountry === location.toLowerCase().trim();
                });

            const styleMatch =
                availableFilters.foundationStyle.length === 0 ||
                availableFilters.foundationStyle.some(style =>
                    fighter.foundationStyle.toLowerCase().includes(style.toLowerCase()),
                );

            return (
                locationMatch &&
                styleMatch &&
                (availableFilters.withTapology ? fighter.hasTapologyLink : fighter) &&
                fighter.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredFighters(filtered);
    }, [fighters, searchQuery, availableFilters]);

    if (contentLoading) {
        return <ContentLoader/>;
    }

    return (
        <>
            <View>
                <SearchSection
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <ExistsFilter/>
            </View>

            {filteredFighters.length === 0 ? (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No fighters found</Text>
                </View>
            ) : (
                <SubmittedFighterList
                    onSelectFighter={(fighter: any) => {
                        setStore({
                            ...store,
                            offerId: offerId ?? null,
                            offerType: offerType,
                            eligibleToSelect: eligibleToSelect?.toString(),
                            currency: currency,
                            excludeFighterId: excludeFighterId
                        });
                        router.push(`/manager/fighter/${fighter.id}/offer/select`)
                    }}
                    fighters={filteredFighters}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        flex: 1,
    },

    noResultsContainer: {
        marginTop: 20,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    noResultsText: {
        fontSize: 16,
        color: colors.gray,
    },
});
