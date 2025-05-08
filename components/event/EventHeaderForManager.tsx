import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {OfferDto} from "@/models/tailoring-model";
import {Offer} from "@/models/model";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "@/styles/colors";


type EventHeaderForManagerProps = {
    offer: OfferDto | null;
    isFavorite: boolean;
    setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EventHeaderForManager = (
    {offer, isFavorite, setIsFavorite}: EventHeaderForManagerProps,
) => {

    const toggleFavorite = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favoriteOffers');
            let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

            if (!offer) return;

            const existingIndex = favorites.findIndex(
                (fav: Offer) => fav.offerId === offer.offerId,
            );

            if (existingIndex !== -1) {
                favorites.splice(existingIndex, 1);
                setIsFavorite(false);
            } else {
                favorites.push(offer);
                setIsFavorite(true);
            }

            await AsyncStorage.setItem('favoriteOffers', JSON.stringify(favorites));
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };
    return <>
        {offer?.isFightTitled && (
            <View style={styles.titleFightTag}>
                <Text style={styles.titleFightText}>Title Fight</Text>
            </View>
        )}

        {/* Event Title + Heart Icon */}
        <View style={styles.eventTitleRow}>
            <Text style={styles.eventTitle}>
                {offer?.eventName || 'Event Name'}
            </Text>
            <TouchableOpacity onPress={toggleFavorite}>
                <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={30}
                    color={isFavorite ? colors.darkError : colors.darkError}
                />
            </TouchableOpacity>
        </View>
    </>;
};
const styles = StyleSheet.create({
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
    eventTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 20,
        marginTop: 20,
        color: colors.primaryGreen,
    },
})