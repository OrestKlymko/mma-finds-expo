import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PublicOfferInfo, ShortInfoFighter} from "@/service/response";
import { Benefit } from '@/models/model';
import {getBenefitsInPublicOffer, getPublicInfoForManager} from '@/service/service';
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
import {ManagerSubmittedFighterList} from "@/components/submissions/ManagerSubmittedFighterList";


export const ManagerOfferDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const [fighters, setFighters] = useState<ShortInfoFighter[]>([]);
    const [offer, setOffer] = useState<PublicOfferInfo | null>(null);
    const [benefits, setBenefits] = useState<Benefit | null>(null);

    const [isFavorite, setIsFavorite] = useState(false);
    const {id} = useLocalSearchParams<{ id: string }>();
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const loadData = async () => {
                if (!id) return;

                try {
                    setContentLoading?.(true); // якщо ти маєш loading

                    const [offerInfo, benefitsBE] = await Promise.all([
                        getPublicInfoForManager(id),
                        getBenefitsInPublicOffer(id),
                    ]);

                    if (!isActive) return;

                    setOffer(offerInfo.offer);
                    setFighters(offerInfo.fighters);
                    setBenefits(benefitsBE);

                    const storedFavorites = await AsyncStorage.getItem('favoriteOffers');
                    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
                    const isFavorited = favorites.some(
                        (fav: PublicOfferInfo) => fav.offerId === offerInfo.offer.offerId,
                    );
                    setIsFavorite(isFavorited);
                } catch (error) {
                    console.error('Error loading offer info:', error);
                } finally {
                    if (isActive) setContentLoading?.(false);
                }
            };

            loadData();

            return () => {
                isActive = false;
            };
        }, [id]),
    );

    const getOfferInfo = async () => {
        getPublicInfoForManager(id).then(async res => {
            setOffer(res.offer);
            setFighters(res.fighters);

            const storedFavorites = await AsyncStorage.getItem('favoriteOffers');
            const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            const isFavorited = favorites.some(
                (fav: PublicOfferInfo) => fav.offerId === res.offer.offerId,
            );
            setIsFavorite(isFavorited);
        });
    };

    if (contentLoading) {
        return <ContentLoader />;
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
                <EventPosterImage eventImageLink={offer?.eventImageLink} />
                <View style={styles.eventDetailsContainer}>
                    <EventHeaderForManager
                        isFavorite={isFavorite}
                        setIsFavorite={setIsFavorite}
                        offer={offer}
                    />
                    <View style={styles.eventSummaryContainer}>
                        <OfferState offer={offer} fightersLength={fighters.length} />
                    </View>
                    <LocationAndDateEvent offer={offer} />
                    <EventDescription eventDescription={offer?.eventDescription} />
                    <OfferExtendedDetailsInfo offer={offer} benefits={benefits} />
                    <OpponentDetailsSection offer={offer}/>
                    <ManagerSubmittedFighterList
                        fighters={fighters}
                        offer={offer}
                        onRefreshFighterList={getOfferInfo}
                    />
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
