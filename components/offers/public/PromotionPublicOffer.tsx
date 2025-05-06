import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import colors from '@/styles/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getBenefitsInPublicOffer, getPublicOfferInfoById,} from '@/service/service';
import ContentLoader from "@/components/ContentLoader";
import {Benefit, PublicOfferInfo, ShortInfoFighter} from "@/service/response";
import {EventPosterImage} from './EventPosterImage';
import {TitleWithAction} from "@/components/offers/public/TitleWithAction";
import {ShareOffer} from "@/components/offers/public/ShareOffer";
import {OfferState} from "@/components/offers/public/OfferState";
import {FeatureOffer} from "@/components/offers/public/FeatureOffer";
import {ManageOfferButton} from "@/components/offers/public/ManageOfferButton";
import {LocationAndDateEvent} from "@/components/offers/public/LocationAndDateEvent";
import EventDescription from "@/components/EventDescription";
import {SubmittedFightersSection} from "@/components/offers/public/SubmittedFightersSection";
import OfferExtendedDetailsInfo from "@/components/offers/public/OfferExtendedDetailsInfo";
import OpponentDetailsSection from "@/components/offers/public/OpponentDetailsSection";
import {PromotionTailoringProcess} from "@/components/offers/public/PromotionTailoringProcess";
import {useFocusEffect, useLocalSearchParams, useRouter} from "expo-router";


export const PromotionOfferDetailsScreen = () => {

    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [fighters, setFighters] = useState<ShortInfoFighter[]>([]);
    const [offer, setOffer] = useState<PublicOfferInfo | null>(null);
    const [previousInfo, setPreviousInfo] = useState<any>(null);
    const {id} = useLocalSearchParams<{ id: string }>();
    const [benefits, setBenefits] = useState<Benefit | null>(null);
    const [submittedInformation, setSubmittedInformation] = useState<any | null>(
        null,
    );
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            console.log(id);
            setContentLoading(true);
            if (id) {
                loadingContent(id);
            } else {
                router.back();
            }
        }, [id]),
    );

    const loadingContent = async (offerIdentifier: string) => {
        try {
            const [offerInfo, benefitFromBe] = await Promise.all([
                getPublicOfferInfoById(offerIdentifier),
                getBenefitsInPublicOffer(offerIdentifier),
            ]);
            setOffer(offerInfo.offer);
            setFighters(offerInfo.fighters);
            setSubmittedInformation(offerInfo.submittedInformation);
            setPreviousInfo(offerInfo.previousOfferPrice);
            setBenefits(benefitFromBe);
        } catch (error) {
            console.error('Error loading offer content:', error);
        } finally {
            setContentLoading(false);
        }
    };

    if (contentLoading) {
        return <ContentLoader/>;
    }
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
                styles.container,
                {paddingBottom: insets.bottom},
            ]}>
            <EventPosterImage eventImageLink={offer?.eventImageLink}/>
            <View style={styles.eventDetailsContainer}>
                <TitleWithAction title={offer?.eventName || 'Event Name'}/>
                <ShareOffer offer={offer} typeOffer={'Public'}/>
                <OfferState offer={offer} fightersLength={fighters.length}/>
                <FeatureOffer offer={offer}/>
                <ManageOfferButton
                    offerId={offer?.offerId}
                    closedReason={offer?.closedReason}
                    type="Public"
                />
                <LocationAndDateEvent offer={offer}/>
                {offer?.eventDescription && (
                    <EventDescription eventDescription={offer.eventDescription}/>
                )}
                <OfferExtendedDetailsInfo offer={offer} benefits={benefits}/>
                <OpponentDetailsSection offer={offer}/>
                {fighters &&
                offer &&
                submittedInformation &&
                submittedInformation?.statusResponded !== 'REJECTED' ? (
                    <PromotionTailoringProcess
                        fighters={fighters}
                        offer={offer}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
                ) : (
                    <SubmittedFightersSection offer={offer} fighters={fighters}/>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
    },
    eventDetailsContainer: {
        padding: 24,
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -50,
    },
    eventDescription: {
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'Roboto',
        color: colors.gray,
        lineHeight: 16,
        marginBottom: 16,
    },
});

export default PromotionOfferDetailsScreen;
