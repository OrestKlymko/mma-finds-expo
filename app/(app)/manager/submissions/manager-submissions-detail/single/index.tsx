import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getExclusiveOfferInfoById} from '@/service/service';
import colors from '@/styles/colors';

import {
    Benefit,
    ExclusiveOfferInfo,
    ShortInfoFighter,
    SubmittedInformationOffer,
} from '@/service/response';
import ContentLoader from "@/components/ContentLoader";
import {EventPosterImage} from "@/components/offers/public/EventPosterImage";
import {TitleWithAction} from "@/components/offers/public/TitleWithAction";
import {ExclusiveOfferState} from "@/components/offers/exclusive-multi/ExclusiveOfferState";
import {LocationAndDateEvent} from "@/components/offers/public/LocationAndDateEvent";
import EventDescription from "@/components/EventDescription";
import OfferExtendedDetailsInfo from "@/components/offers/public/OfferExtendedDetailsInfo";
import OpponentDetailsSection from "@/components/offers/public/OpponentDetailsSection";
import {ExclusiveManagerTailoringContent} from "@/components/offers/ExclusiveManagerTailoringContent";

export const ManagerExclusiveOfferDetailsScreen = () => {
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [fighter, setFighter] = useState<ShortInfoFighter>();
    const [offer, setOffer] = useState<ExclusiveOfferInfo | null>(null);
    const [submittedInformation, setSubmittedInformation] = useState<
        SubmittedInformationOffer | undefined
    >();
    const [previousInfo, setPreviousInfo] = useState<
        SubmittedInformationOffer | undefined
    >();
    const {offerId} = route.params as {
        offerId: string;
    };
    const [benefits, setBenefits] = useState<Benefit | null>(null);
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            if (!offerId) {
                return;
            }
            getExclusiveOfferInfo();
        }, [offerId]),
    );

    const getExclusiveOfferInfo = () => {
        setContentLoading(true);
        getExclusiveOfferInfoById(offerId)
            .then(res => {
                setOffer(res.offer);
                setFighter(res.fighter);
                setBenefits(res.benefit);
                setSubmittedInformation(res?.submittedInformation);
                setPreviousInfo(res?.previousOfferPrice);
            })
            .finally(() => setContentLoading(false));
    };

    if (contentLoading) {
        return <ContentLoader />;
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
            {/* Event Image */}
            <EventPosterImage eventImageLink={offer?.eventImageLink} />
            <View style={styles.eventDetailsContainer}>
                {offer?.isFightTitled && (
                    <View style={styles.titleFightTag}>
                        <Text style={styles.titleFightText}>Title Fight</Text>
                    </View>
                )}
                <TitleWithAction title={offer?.eventName || 'Event Name'} />

                <ExclusiveOfferState offer={offer} />
                <LocationAndDateEvent offer={offer} />
                <EventDescription eventDescription={offer?.eventDescription} />
                <OfferExtendedDetailsInfo offer={offer} benefits={benefits} />
                <OpponentDetailsSection offer={offer}/>
                {fighter && offer && submittedInformation && (
                    <ExclusiveManagerTailoringContent
                        fighters={fighter}
                        offer={offer}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
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
});

export default ManagerExclusiveOfferDetailsScreen;
