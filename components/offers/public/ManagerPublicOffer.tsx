import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PublicOfferInfo, ShortInfoFighter, SubmittedInformationOffer} from "@/service/response";
import {Benefit, Offer} from '@/models/model';
import {getBenefitsInPublicOffer, getPublicOfferInfoById} from '@/service/service';
import {useLocalSearchParams} from "expo-router";
import ContentLoader from '@/components/ContentLoader';
import {EventPosterImage} from "@/components/offers/public/EventPosterImage";
import {EventHeaderForManager} from "@/components/event/EventHeaderForManager";
import {OfferState} from "@/components/offers/public/OfferState";
import {LocationAndDateEvent} from "@/components/offers/public/LocationAndDateEvent";
import EventDescription from "@/components/EventDescription";
import OfferExtendedDetailsInfo from './OfferExtendedDetailsInfo';
import OpponentDetailsSection from './OpponentDetailsSection';
import colors from "@/styles/colors";
import {LogInAndSubmitFighterButton} from "@/components/offers/LogInAndSubmitFighterButton";
import {useAuth} from "@/context/AuthContext";
import SuccessFeePaymentSection from "@/components/offers/SuccessFeePaymentSection";
import {RejectedReasonSection} from "@/components/submissions/RejectedReasonSection";
import {ManagerOfferDetailFooter} from "@/components/submissions/ManagerOfferDetailFooter";


export const ManagerOfferDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const [fighters, setFighters] = useState<ShortInfoFighter[]>([]);
    const [offer, setOffer] = useState<PublicOfferInfo | null>(null);
    const [benefits, setBenefits] = useState<Benefit | null>(null);
    const {role} = useAuth();
    const [chosenFighter, setChosenFighter] = useState<ShortInfoFighter | undefined>(undefined);
    const [isFavorite, setIsFavorite] = useState(false);
    const {id} = useLocalSearchParams<{ id: string }>();
    const [contentLoading, setContentLoading] = useState(false);
    const [submittedInformation, setSubmittedInformation] =
        useState<SubmittedInformationOffer>();
    const [previousInfo, setPreviousInfo] =
        useState<SubmittedInformationOffer>();
    useEffect(() => {
        setContentLoading(true);
        if (id) {
            loadData();
        }
    }, [id])

    const loadData = async () => {
        try {
            if (!id) return;
            const [benefitsResponse, offerResponse] = await Promise.all([
                getBenefitsInPublicOffer(id),
                getPublicOfferInfoById(id, null),
            ]);
            setBenefits(benefitsResponse);
            setOffer(offerResponse.offer);
            setChosenFighter(offerResponse?.chosenFighter);
            setFighters(offerResponse.fighters);
            setSubmittedInformation(offerResponse?.submittedInformation);
            setPreviousInfo(offerResponse?.previousOfferPrice);
            const storedFavorites = await AsyncStorage.getItem('favoriteOffers');
            const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            const isFavorited = favorites.some(
                (fav: Offer) => fav.offerId === offerResponse.offer.offerId,
            );
            setIsFavorite(isFavorited);
        } catch (error) {
            console.error('Error loading offer data:', error);
        } finally {
            setContentLoading(false);
        }
    };

    const renderFooter = () => {
        if (submittedInformation && submittedInformation.statusResponded === 'ACCEPTED' && !submittedInformation.feePayment) {
            return <SuccessFeePaymentSection offerId={id} submittedInformation={submittedInformation}/>
        }

        if (submittedInformation?.statusResponded === 'REJECTED' || fighters[0]?.contractStatus === 'REJECTED') {
            return <RejectedReasonSection rejectionReason={fighters[0]?.rejectedReason}/>
        }
        return <ManagerOfferDetailFooter
            chosenFighter={chosenFighter}
            submittedInformation={submittedInformation}
            previousInfo={previousInfo}
            fighters={fighters}
            offer={offer}
            onRefreshFighterList={loadData}
        />
    }

    if (contentLoading) {
        return <ContentLoader/>;
    }
    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                    <EventHeaderForManager
                        isFavorite={isFavorite}
                        setIsFavorite={setIsFavorite}
                        offer={offer}
                    />
                    <View style={styles.eventSummaryContainer}>
                        <OfferState offer={offer} fightersLength={fighters.length}/>
                    </View>
                    {offer && <LocationAndDateEvent offer={offer}/>}
                    <EventDescription eventDescription={offer?.eventDescription}/>
                    <OfferExtendedDetailsInfo offer={offer} benefits={benefits}/>
                    <OpponentDetailsSection offer={offer}/>

                    {(!role || role === 'ANONYMOUS') ? <LogInAndSubmitFighterButton/>
                        : renderFooter()}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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

    eventSummaryContainer: {
        borderRadius: 8,
        alignItems: 'center',
    },
});
