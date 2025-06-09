import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

import React from "react";
import colors from "@/styles/colors";
import {OfferList} from "@/components/offers/OfferList";
import {useRouter} from "expo-router";
import {PublicOfferInfo} from "@/service/response";


type RecentlySavedSectionProps = {
    favoriteOffers: PublicOfferInfo[];
    refreshFavorites: () => void;
}

export const RecentlySavedSection = (
    {favoriteOffers, refreshFavorites}: RecentlySavedSectionProps
) => {
    const router =  useRouter();

    return <>
        {favoriteOffers.length > 0 && (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recently Saved</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(app)/offer/recently-saved')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <OfferList
                    offers={favoriteOffers}
                    isFavorite={true}
                    horizontal
                    refreshFavorites={refreshFavorites}
                    onClick={offerId =>
                        router.push(`/offers/public/${offerId}`)
                    }
                />
            </View>
        )}</>;
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    seeAll: {
        fontSize: 17,
        fontWeight: '500',
        color: colors.primaryGreen,
        paddingRight: 20,
    },
});
