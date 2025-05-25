import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View,} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {setFighterId} from '@/store/createExclusiveOfferSlice';
import {useFocusEffect, useLocalSearchParams, useRouter} from "expo-router";
import {Benefit, ExclusiveOfferInfo, ShortInfoFighter, SubmittedInformationOffer} from "@/service/response";
import {chooseFighterForExclusiveOffer, getExclusiveOfferInfoById} from "@/service/service";
import {EventPosterImage} from "@/components/offers/public/EventPosterImage";
import {TitleWithAction} from "@/components/offers/public/TitleWithAction";
import {ShareOffer} from "@/components/offers/public/ShareOffer";
import {ExclusiveOfferState} from "@/components/offers/exclusive-multi/ExclusiveOfferState";
import {LocationAndDateEvent} from "@/components/offers/public/LocationAndDateEvent";
import ContentLoader from "@/components/ContentLoader";
import OpponentDetailsSection from "@/components/offers/public/OpponentDetailsSection";
import OfferExtendedDetailsInfo from "@/components/offers/public/OfferExtendedDetailsInfo";
import EventDescription from "@/components/EventDescription";
import colors from "@/styles/colors";
import {
    ExclusivePromotionTailoringProcess
} from "@/components/offers/exclusive-single/ExclusivePromotionTailoringProcess";

export const PromotionSingleOffer = () => {
    const insets = useSafeAreaInsets();
    const {fighterId} = useSelector(
        (state: RootState) => state.createExclusiveOffer,
    );

    const router = useRouter();
    const dispatch = useDispatch();
    const [fighters, setFighters] = useState<ShortInfoFighter>(
        {} as ShortInfoFighter,
    );
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
            setContentLoading(true);
            getExclusiveOfferInfoById(id)
                .then(res => {
                    console.log(res.fighter);
                    setOffer(res.offer);
                    setFighters(res.fighter);
                    setBenefits(res.benefit);
                    setSubmittedInformation(res?.submittedInformation);
                    setPreviousInfo(res?.previousOfferPrice);
                })
                .finally(() => setContentLoading(false));

            if (fighterId) {
                setContentLoading(true);
                chooseAnotherFighter();
            }
        }, [fighterId, id]),
    );

    const chooseAnotherFighter = () => {
        if (!fighterId) {
            return;
        }
        chooseFighterForExclusiveOffer(fighterId, id)
            .then(() => {
                dispatch(setFighterId(''));
                router.back();
            })
            .catch(() => {
                Alert.alert('Error', 'Something went wrong. Please try again.');
            })
            .finally(() => {
                setContentLoading(false);
            });
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
                {offer?.isFightTitled && (
                    <View style={styles.titleFightTag}>
                        <Text style={styles.titleFightText}>Title Fight</Text>
                    </View>
                )}
                <TitleWithAction title={offer?.eventName || 'Event Name'}/>
                <ExclusiveOfferState offer={offer}/>
                <LocationAndDateEvent offer={offer}/>
                {offer?.eventDescription && (
                    <EventDescription eventDescription={offer.eventDescription}/>
                )}
                <OfferExtendedDetailsInfo offer={offer} benefits={benefits}/>
                <OpponentDetailsSection offer={offer}/>
                {offer && (
                    <ExclusivePromotionTailoringProcess
                        fighter={fighters}
                        offer={offer}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
                )}
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

