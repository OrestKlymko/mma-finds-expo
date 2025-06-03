import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SubmittedFighterList} from './SubmittedFighterList';
import React from 'react';
import colors from '@/styles/colors';
import {useSubmittedFilterFighter} from "@/context/SubmittedFilterFighterContext";
import {useRouter} from "expo-router";
import {OfferTypeEnum} from "@/models/model";
import {ShortInfoFighter} from "@/service/response";

type Props = {
    fighters: ShortInfoFighter[],
    offer: any,
    offerType?: OfferTypeEnum
};

export const SubmittedFightersSection = ({fighters, offer, offerType}: Props) => {
    const {setAvailableFilters} = useSubmittedFilterFighter();
    const router = useRouter();
    return (
        <>
            {offerType && offerType === OfferTypeEnum.PRIVATE && <View style={styles.submittedFightersContainer}>
                <Text style={styles.eventTitle}>Submitted Fighters</Text>
                <TouchableOpacity style={styles.addMoreFighters}
                                  onPress={() => router.push({
                                      pathname: '/offer/exclusive/create/fighter/add-more',
                                      params: {offerId: offer?.offerId ?? null}
                                  })}>
                    <Text style={styles.addMoreFightersText}>
                        Add More Fighters
                    </Text>
                </TouchableOpacity>
            </View>}
            <SubmittedFighterList
                fighters={fighters.slice(0, 3)}
                scrollEnabled={false}
                onSelectFighter={async (item) => {
                    router.push({
                        pathname: `/manager/fighter/${item.id}/offer/select`,
                        params: {
                            offerType: JSON.stringify(offerType),
                            offerId: offer?.offerId ?? null,
                            currency: offer?.currency,
                            eligibleToSelect: (
                                !(offer?.closedReason && offer?.closedReason !== '')
                            ).toString(),
                        },
                    })
                }}
            />
            <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => {
                    setAvailableFilters(prev => ({
                        ...prev,
                        offerId: offer?.offerId ?? null,
                    }));
                    router.push({
                        pathname: `/offer/public/${offer.offerId}/fighter`,
                        params: {
                            currency: offer?.currency,
                            eligibleToSelect: (
                                !(offer?.closedReason && offer?.closedReason !== '')
                            ).toString(),
                            offerType: JSON.stringify(offerType)
                        },
                    })
                }}>
                <Text style={styles.ctaButtonText}>See the List</Text>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryGreen,
        position: 'relative',
    },
    ctaButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 12,
        height: 56,
        justifyContent: 'center',
    },
    ctaButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    eventSummaryContainer: {
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 40,
    },
    submittedFightersContainer: {
        marginBottom: 24,
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addMoreFightersText: {
        fontSize: 10,
        fontWeight: '500',
        color: colors.white,
    },
    addMoreFighters: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
});
