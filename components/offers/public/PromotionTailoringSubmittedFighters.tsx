import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {useSubmittedFilterFighter} from '@/context/SubmittedFilterFighterContext';
import {ExclusiveOfferInfo, PublicOfferInfo, ShortInfoFighter, SubmittedInformationOffer} from '@/service/response';
import {SubmittedFighterList} from "@/components/offers/public/SubmittedFighterList";
import {useRouter} from "expo-router";
import {OfferTypeEnum} from "@/models/model";

type PromotionTailoringSubmittedFightersProps = {
    submittedFighters: ShortInfoFighter[];
    offer: PublicOfferInfo | ExclusiveOfferInfo;
    submittedInformation?: SubmittedInformationOffer;
    offerType?: OfferTypeEnum;
};

export const PromotionTailoringSubmittedFighters = ({
                                                        submittedFighters,
                                                        offer,
                                                        submittedInformation,
                                                        offerType
                                                    }: PromotionTailoringSubmittedFightersProps) => {
    const {setAvailableFilters} = useSubmittedFilterFighter();
    const router = useRouter();
    return (
        <>
            <Text style={styles.eventTitle}>Submitted Fighters</Text>
            <SubmittedFighterList
                fighters={submittedFighters
                    .filter(f => f.id !== offer.chooseFighterId)
                    .slice(0, 3)}
                scrollEnabled={false}
                onSelectFighter={item => {
                    if (submittedInformation?.statusResponded === 'REJECTED') {
                        router.push({
                            pathname: `/manager/fighter/${item.id}/offer/select`,
                            params: {
                                offerId: offer.offerId,
                                currency: offer?.currency,
                                eligibleToSelect: (!(
                                    offer?.closedReason && offer?.closedReason !== ''
                                )).toString(),
                                offerType: JSON.stringify(offerType),
                            },
                        })
                    } else {
                        router.push({
                            pathname: `/manager/fighter/${item.id}/offer/select`,
                            params: {
                                offerId: offer.offerId,
                                currency: offer?.currency
                            },
                        })
                    }
                }}
            />
            <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => {
                    setAvailableFilters(prev => ({
                        ...prev,
                        offerId: offer?.offerId,
                    }));
                    router.push({
                        pathname: `/public/${offer.offerId}/fighter`,
                        params: {
                            currency: offer?.currency ?? undefined,
                            excludeFighterId: offer?.chooseFighterId ?? undefined,
                            eligibleToSelect: (
                                !(offer?.closedReason && offer?.closedReason !== '')
                            ).toString(),
                            offerType: JSON.stringify(offerType),
                        },
                    })
                }}>
                <Text style={styles.ctaButtonText}>See the List</Text>
            </TouchableOpacity>
        </>
    );
};
const styles = StyleSheet.create({
    ctaButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 12,
        height: 56,
        justifyContent: 'center',
        marginBottom: 16,
    },
    ctaButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 24,
        marginTop: 10,
        color: colors.primaryGreen,
        position: 'relative',
    },
});
