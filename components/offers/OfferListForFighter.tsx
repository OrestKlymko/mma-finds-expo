import {
    FlatList,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PublicOfferInfo, PublicOfferShortInfo} from '@/service/response';
import {Offer, OfferTypeEnum} from "@/models/model";
import {OfferCard} from "@/components/offers/OfferCard";
import {useRouter} from 'expo-router';

// TODO: replace public offer info with publicoffershortinfo
interface OfferListProps {
    offers?: PublicOfferInfo[];
    horizontal?: boolean;
    isFavorite?: boolean;
    refreshFavorites?: () => void;
    offerType?: OfferTypeEnum
}

export const OfferListForFighter = (({
                                         offers,
                                         horizontal,
                                         isFavorite,
                                         refreshFavorites,
                                         offerType,
                                     }: OfferListProps) => {
    const router = useRouter();
    const removeFavorite = React.useCallback(async (offer: PublicOfferInfo) => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favoriteOffers');
            let favorites: Offer[] = storedFavorites ? JSON.parse(storedFavorites) : [];
            favorites = favorites.filter(fav => fav.offerId !== offer.offerId);
            await AsyncStorage.setItem('favoriteOffers', JSON.stringify(favorites));
            if (refreshFavorites) refreshFavorites();
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    }, [refreshFavorites]);


    return (
        <FlatList
            data={offers}
            horizontal={horizontal}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.offerId}
            renderItem={({item}) =>
                (<OfferCard onClick={(offerId) => {
                    if (offerType === OfferTypeEnum.EXCLUSIVE) {
                        router.push(`/offer/exclusive/single/${offerId}`);
                    } else {
                        router.push(`/offer/public/${item.offerId}`)
                    }
                }} item={item} isFavorite={isFavorite} removeFavorite={removeFavorite}/>)}
        />
    );
});

export default OfferListForFighter;
