import {StyleSheet, Text, View} from "react-native";
import React from "react";
import colors from "@/styles/colors";
import {OfferCard} from "@/components/offers/OfferCard";

type OfferRelatedSectionProps = {
    offer: any;
    typeOffer: string;
}

export const OfferRelatedSection = (
    {offer, typeOffer}: OfferRelatedSectionProps
) => {
    const getRelationMessage = () => {
        switch (typeOffer) {
            case 'Exclusive':
                return <OfferCard item={offer} />;
            case 'Multi-fight Contract':
                return <Text style={styles.relationText}>Multi-fight contract</Text>;
            default:
                return <OfferCard item={offer} />;
        }
    };

    return <View style={styles.relatedContainer}>
        <Text style={styles.relatedText}>This message is related to:</Text>
        {getRelationMessage()}
    </View>
};
const styles = StyleSheet.create({

    relatedContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    relatedText: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.primaryBlack,
        lineHeight: 13,
        marginBottom: 8,
    },
    relationText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primaryGreen,
        lineHeight: 13,
        marginBottom: 8,
    }
});
