import {
    FlatList,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PublicOfferInfo, PublicOfferShortInfo} from '@/service/response';
import {Offer} from "@/models/model";
import {OfferCard} from "@/components/offers/OfferCard";

// TODO: replace public offer info with publicoffershortinfo
interface OfferListProps {
    offers?: PublicOfferInfo[];
    horizontal?: boolean;
    isFavorite?: boolean;
    refreshFavorites?: () => void;
}



export const OfferListForFighter = (({
                                                   offers,
                                                   horizontal,
                                                   isFavorite,
                                                   refreshFavorites,
                                               }: OfferListProps) => {



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





    const renderContentWithVerificationState = (item: PublicOfferInfo) => {
        return <OfferCard item={item} isFavorite={isFavorite} removeFavorite={removeFavorite} />;
    };

    return (
        <FlatList
            data={offers}
            horizontal={horizontal}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.offerId}
            renderItem={({item}) =>
                renderContentWithVerificationState(item)
            }
        />
    );
});

export default OfferListForFighter;
