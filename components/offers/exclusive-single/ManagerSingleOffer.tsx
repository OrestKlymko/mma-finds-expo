import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View,} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {Benefit, ExclusiveOfferInfo, ShortInfoFighter, SubmittedInformationOffer} from "@/service/response";
import {getExclusiveOfferInfoById} from "@/service/service";
import {EventPosterImage} from "@/components/offers/public/EventPosterImage";
import {TitleWithAction} from "@/components/offers/public/TitleWithAction";
import {ExclusiveOfferState} from "@/components/offers/exclusive-multi/ExclusiveOfferState";
import {LocationAndDateEvent} from "@/components/offers/public/LocationAndDateEvent";
import ContentLoader from "@/components/ContentLoader";
import OpponentDetailsSection from "@/components/offers/public/OpponentDetailsSection";
import OfferExtendedDetailsInfo from "@/components/offers/public/OfferExtendedDetailsInfo";
import EventDescription from "@/components/EventDescription";
import colors from "@/styles/colors";
import {
    SubmittedFighterPrivateOfferSection
} from "@/components/offers/exclusive-single/SubmittedFighterPrivateOfferSection";
import {
    PrivatePromotionTailoringProcess
} from "@/components/offers/exclusive-single/PrivatePromotionTailoringProcess";
import {PrivateManagerTailoringProcess} from "@/components/offers/exclusive-single/PrivateManagerTailoringProcess";

export const ManagerSingleOffer = () => {
    const insets = useSafeAreaInsets();
    const [submittedFighters, setSubmittedFighters] = useState<ShortInfoFighter[]>([]);
    const [fightersChosen, setFightersChosen] = useState<ShortInfoFighter | null>(null);
    const [offer, setOffer] = useState<ExclusiveOfferInfo | null>(null);
    const {id} = useLocalSearchParams<{ id: string }>()
    const [benefits, setBenefits] = useState<Benefit | null>(null);
    const [contentLoading, setContentLoading] = useState(false);
    const [submittedInformation, setSubmittedInformation] = useState<
        SubmittedInformationOffer | undefined
    >();
    const [previousInfo, setPreviousInfo] = useState<
        SubmittedInformationOffer | undefined
    >();

    useFocusEffect(
        React.useCallback(() => {
            if (!id) return;
            getData();
        }, [id])
    );

    const getData = () => {
        setContentLoading(true);
        getExclusiveOfferInfoById(id, null)
            .then(res => {
                setOffer(res.offer);
                setFightersChosen(res.chosenFighter)
                setSubmittedFighters(res.submittedFighters)
                setBenefits(res.benefit);
                setSubmittedInformation(res?.submittedInformation);
                setPreviousInfo(res?.previousOfferPrice);
            })
            .finally(() => setContentLoading(false));
    }
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
                {offer?.isFightTitled && (
                    <View style={styles.titleFightTag}>
                        <Text style={styles.titleFightText}>Title Fight</Text>
                    </View>
                )}
                <TitleWithAction title={offer?.eventName || 'Event Name'}/>
                <ExclusiveOfferState offer={offer}/>
                {offer&&<LocationAndDateEvent offer={offer}/>}
                {offer?.eventDescription && (
                    <EventDescription eventDescription={offer.eventDescription}/>
                )}
                <OfferExtendedDetailsInfo offer={offer} benefits={benefits}/>
                <OpponentDetailsSection offer={offer}/>

                <PrivateManagerTailoringProcess offer={offer} submittedFighters={submittedFighters}
                                                  onRefresh={getData} chosenFighter={fightersChosen}
                                                  submittedInformation={submittedInformation}
                                                  previousInfo={previousInfo}/>
                {/*<ExclusiveMyFighterList offerType={'Exclusive Offer'} fighter={fighters} offerId={offer?.offerId}/>*/}
            </View>
        </ScrollView>
    );
};

export default ManagerSingleOffer;

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
    titleFightTag: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.yellow,
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderTopRightRadius: 10,
        zIndex: 1,
    },
    titleFightText: {
        fontSize: 12,
        fontWeight: '500',
    },
    createProfileButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },
    createProfileButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
        paddingVertical: 4,
    },
});

