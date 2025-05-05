import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {SearchForSubmittedFighterListFlow} from "@/components/offers/public/SearchForSubmittedFighterListFlow";
import {useLocalSearchParams} from "expo-router";

const MyListSubmittedFighterScreen = () => {
    const insets = useSafeAreaInsets();
    const route = useRoute();

    const params = useLocalSearchParams();
    const offerId = params.offerId as string;
    const currency = params.currency as string;
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
