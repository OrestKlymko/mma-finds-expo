import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PublicOfferInfo, ShortInfoFighter} from '@/service/response';
import {SubmittedInformationPublicOffer} from '@/models/tailoring-model';
import {getBenefitsInPublicOffer, getPublicOfferInfoByIdForManagerByFighter} from "@/service/service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Benefit, Offer} from "@/models/model";
import ContentLoader from "@/components/ContentLoader";
import {EventPosterImage} from '@/components/offers/public/EventPosterImage';
import {OfferState} from "@/components/offers/public/OfferState";
import {EventHeaderForManager} from '@/components/event/EventHeaderForManager';
import {LocationAndDateEvent} from "@/components/offers/public/LocationAndDateEvent";
import EventDescription from "@/components/EventDescription";
import OfferExtendedDetailsInfo from "@/components/offers/public/OfferExtendedDetailsInfo";
import OpponentDetailsSection from "@/components/offers/public/OpponentDetailsSection";
import colors from "@/styles/colors";
import {ManagerOfferDetailFooter} from "@/components/submissions/ManagerOfferDetailFooter";
import {useLocalSearchParams} from "expo-router";
import {SuccessFeePaymentSection} from "@/components/offers/SuccessFeePaymentSection";
import {RejectedReasonSection} from "@/components/submissions/RejectedReasonSection";


export const ManagerSubmissionDetailScreen = () => {

    const insets = useSafeAreaInsets();
    const [fighters, setFighters] = useState<ShortInfoFighter[]>([]);
    const [offer, setOffer] = useState<PublicOfferInfo | null>(null);
    const [benefits, setBenefits] = useState<Benefit | null>(null);
    const [submittedInformation, setSubmittedInformation] =
        useState<SubmittedInformationPublicOffer>();
    const [previousInfo, setPreviousInfo] =
        useState<SubmittedInformationPublicOffer>();
    const [contentLoading, setContentLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const {offerId, fighterId} = useLocalSearchParams<{
        offerId: string;
        fighterId: string;
    }>();

    useEffect(() => {
        setContentLoading(true);
        if (offerId && fighterId) {
            loadData();
        }
    }, [offerId, fighterId])

    const loadData = async () => {
        try {
            if (!offerId) return;
            const [benefitsResponse, offerResponse] = await Promise.all([
                getBenefitsInPublicOffer(offerId),
                getPublicOfferInfoByIdForManagerByFighter(offerId, fighterId),
            ]);
            setBenefits(benefitsResponse);
            setOffer(offerResponse.offer);
            setFighters(offerResponse.fighters);
            setSubmittedInformation(offerResponse.submittedInformation);
            setPreviousInfo(offerResponse.previousOfferPrice);
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
            return <SuccessFeePaymentSection offerId={offerId} submittedInformation={submittedInformation}/>
        }

        if (submittedInformation?.statusResponded === 'REJECTED' || fighters[0]?.contractStatus === 'REJECTED') {
            console.log(submittedInformation?.statusResponded);
            return <RejectedReasonSection rejectionReason={fighters[0]?.rejectedReason}/>
        }
        return <ManagerOfferDetailFooter
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
                {/* Event Image */}
                <EventPosterImage eventImageLink={offer?.eventImageLink}/>
                {/* Event Details */}
                <View style={styles.eventDetailsContainer}>
                    <EventHeaderForManager
                        isFavorite={isFavorite}
                        setIsFavorite={setIsFavorite}
                        offer={offer}
                    />

                    <View style={styles.eventSummaryContainer}>
                        <OfferState offer={offer} fightersLength={fighters.length}/>
                    </View>

                    <LocationAndDateEvent offer={offer}/>
                    <EventDescription eventDescription={offer?.eventDescription}/>
                    <OfferExtendedDetailsInfo offer={offer} benefits={benefits}/>
                    <OpponentDetailsSection offer={offer}/>
                    {renderFooter()}
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
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 20,
        marginTop: 20,
        color: colors.primaryGreen,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 24,
        marginBottom: 12,
        color: colors.primaryBlack,
    },
    eventSummaryContainer: {
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
});

export default ManagerSubmissionDetailScreen;
