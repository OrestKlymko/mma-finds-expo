import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {PublicOfferInfo} from '@/service/response';
import {useRouter} from "expo-router";
import {OfferList} from "@/components/offers/OfferList";

interface MyOfferSectionProps {
    offers?: PublicOfferInfo[];
}

export const MyOfferSection = ({offers}: MyOfferSectionProps) => {
    const router = useRouter();
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Offers</Text>
                <TouchableOpacity
                    onPress={() => {
                        router.push('/offer')
                    }}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            <OfferList offers={offers} horizontal onClick={offerId => {
                console.log(offerId)
                router.push(`/offers/public/${offerId}`)
            }}/>
        </View>
    );
};
const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
