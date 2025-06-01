import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SearchForSubmittedFighterListFlow} from "@/components/offers/public/SearchForSubmittedFighterListFlow";
import {useLocalSearchParams} from "expo-router";
import {OfferTypeEnum} from "@/models/model";

const MyListSubmittedFighterScreen = () => {
    const insets = useSafeAreaInsets();

    const params = useLocalSearchParams();
    const offerId = params.id as string;
    const currency = params.currency as string;
    const offerType = JSON.parse(params.offerType as string) as OfferTypeEnum
    const excludeFighterId = params.excludeFighterId as string;
    const eligibleToSelect = params.eligibleToSelect as string;

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                {/* Title */}
                <Text style={styles.title}>Submitted Fighters</Text>

                <SearchForSubmittedFighterListFlow
                    offerId={offerId}
                    currency={currency}
                    excludeFighterId={excludeFighterId}
                    eligibleToSelect={eligibleToSelect==='true'}
                    offerType={offerType}
                />
            </View>
        </View>
    );
};

export default MyListSubmittedFighterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 20,
    },
});
