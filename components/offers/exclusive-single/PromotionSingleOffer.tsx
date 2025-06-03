import React, {useEffect, useState} from 'react';
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
import {SubmittedFightersSection} from "@/components/offers/public/SubmittedFightersSection";
import {OfferTypeEnum} from "@/models/model";
import {
    PrivatePromotionTailoringProcess
} from "@/components/offers/exclusive-single/PrivatePromotionTailoringProcess";

export const PromotionSingleOffer = () => {
    const insets = useSafeAreaInsets();

    const [fighters, setFighters] = useState<ShortInfoFighter[]>([]);
    const [chosenFighter, setChosenFighter] = useState<ShortInfoFighter | null>(null);
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

            if (!id) {
                return;
            }
            getData();
        }, [id]),
    );
    const getData = () => {
        setContentLoading(true);
        getExclusiveOfferInfoById(id, null)
            .then(res => {
                setOffer(res.offer);
                setFighters(res.submittedFighters);
                setBenefits(res.benefit);
                setChosenFighter(res.chosenFighter);
                setSubmittedInformation(res?.submittedInformation);
                setPreviousInfo(res?.previousOfferPrice);
            })
            .finally(() => setContentLoading(false));
    }

    const renderFooter = () => {
        if (fighters &&
            offer &&
            submittedInformation &&
            submittedInformation?.statusResponded !== 'REJECTED') {
            return <PrivatePromotionTailoringProcess
                submittedFighters={fighters}
                chosenFighter={chosenFighter}
                offer={offer}
                submittedInformation={submittedInformation}
                previousInfo={previousInfo}
                onRefresh={getData}
            />
        }
        return <SubmittedFightersSection offer={offer} fighters={fighters} offerType={OfferTypeEnum.PRIVATE}/>
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
                <ExclusiveOfferState offer={offer} offerType={OfferTypeEnum.PRIVATE}/>
                {offer&&<LocationAndDateEvent offer={offer}/>}
                {offer?.eventDescription && (
                    <EventDescription eventDescription={offer.eventDescription}/>
                )}
                <OfferExtendedDetailsInfo offer={offer} benefits={benefits}/>
                <OpponentDetailsSection offer={offer}/>
                {renderFooter()}
            </View>
        </ScrollView>
    );
};

export default PromotionSingleOffer;

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

