import {
    Alert,
    FlatList, View,
} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PublicOfferInfo, PublicOfferShortInfo} from '@/service/response';
import {Offer, OfferTypeEnum} from "@/models/model";
import {OfferCard} from "@/components/offers/OfferCard";
import {useRouter} from 'expo-router';
import {getShortInfoManager} from "@/service/service";
import {useAuth} from "@/context/AuthContext";

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
    const {role, entityId} = useAuth();
    const [verificationStatus, setVerificationStatus] = React.useState<boolean>(false);

    useEffect(() => {
        getVerificationStatus()
    }, [role, entityId]);
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

    const getVerificationStatus = () => {
        if (role === 'MANAGER' && entityId) {
            getShortInfoManager(entityId).then(res => {
                setVerificationStatus(res.isVerified)
            })
        }
    }

    const handleOfferClick = (offerId: string) => {
        if (role === 'MANAGER' && !verificationStatus) {
            Alert.alert(
                'Verification Required',
                'We need to verify your manager account before you can view offers. Please complete the verification process.',
                [
                    {
                        text: 'Go to Verification',
                        onPress: () => router.push('/profile/settings/account/account-info/verification', {
                            routeToMain: 'true',
                        }),
                        isPreferred: true
                    },
                    {
                        text: 'Cancel',
                        style: 'destructive',
                    },
                ],
                {cancelable: false},
            );
            return;
        }
        if (offerType === OfferTypeEnum.PRIVATE) {
            router.push(`/offers/private/${offerId}`);
        } else {
            router.push(`/offers/public/${offerId}`)
        }

    }
    //TODO MAKE VERIFICATION CHECK BEFORE CLICKING ON OFFER


    return (
        <FlatList
            data={offers}
            horizontal={horizontal}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={!horizontal ? () => <View style={{height: 15}}/> : () => <></>}
            keyExtractor={item => item.offerId}
            renderItem={({item}) =>
                (<OfferCard onClick={(offerId) => {
                    handleOfferClick(offerId);
                }} item={item} isFavorite={isFavorite} removeFavorite={removeFavorite}/>)}
        />
    );
});

export default OfferListForFighter;
