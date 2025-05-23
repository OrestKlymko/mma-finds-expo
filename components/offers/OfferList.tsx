import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PublicOfferInfo} from "@/service/response";
import {OfferCard} from "@/components/offers/OfferCard";


type OfferListProps = {
    offers?: PublicOfferInfo[];
    horizontal?: boolean;
    blockScroll?: boolean;
    isFavorite?: boolean;
    refreshFavorites?: () => void;
    footerButton?: React.ReactNode;
    onClick?: (offerId: string) => void | undefined;
};

export const OfferList =
    ({
         offers,
         horizontal,
         isFavorite,
         refreshFavorites,
         blockScroll,
         footerButton,
         onClick
     }: OfferListProps) => {
        const removeFavorite = useCallback(
            async (offer: PublicOfferInfo) => {
                try {
                    const storedFavorites = await AsyncStorage.getItem('favoriteOffers');
                    let favorites: PublicOfferInfo[] = storedFavorites
                        ? JSON.parse(storedFavorites)
                        : [];
                    favorites = favorites.filter(fav => fav.offerId !== offer.offerId);
                    await AsyncStorage.setItem(
                        'favoriteOffers',
                        JSON.stringify(favorites),
                    );
                    refreshFavorites?.();
                } catch (error) {
                    console.error('Error removing favorite:', error);
                }
            },
            [refreshFavorites],
        );

        const renderItem = useCallback(
            ({item}: {item: PublicOfferInfo}) => {
                return (
                    <OfferCard
                        item={item}
                        isFavorite={isFavorite}
                        removeFavorite={removeFavorite}
                        horizontal={horizontal}
                        onClick={() => onClick?.(item.offerId)}
                    />
                );
            },
            [horizontal, isFavorite, removeFavorite, onClick],
        );

        return (
            <FlatList
                data={offers}
                horizontal={horizontal}
                keyExtractor={item => item.offerId}
                renderItem={renderItem}
                scrollEnabled={!blockScroll}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={!horizontal ? {paddingBottom: 150} : {}}
                ItemSeparatorComponent={!horizontal ? () => <View style={{ height: 15 }} /> : () => <></>}
                ListFooterComponent={
                    footerButton ? (
                        <View style={{marginTop: 15}}>{footerButton}</View>
                    ) : null
                }
            />
        );
    };
