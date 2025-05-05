import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import colors from '@/styles/colors';

import GoBackButton from '@/components/GoBackButton';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setFighterId, setFighterName,} from '@/store/createExclusiveOfferSlice';

import {
    setFighterId as setMultiFighterId,
    setFighterName as setMultiFighterName,
} from '@/store/createMultiContractOfferSlice';
import {SearchForFighterFlow} from "@/components/fighter/SearchForFighterFlow";
import {useLocalSearchParams} from "expo-router";

const PromotionAllFighterExclusiveTypeOffersListScreen = () => {
    const insets = useSafeAreaInsets();
    const {type} = useLocalSearchParams<{type: string}>();
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleChooseFighter = (fighter: any) => {

        if (type === 'Exclusive') {
            dispatch(setFighterId(fighter.id));
            dispatch(setFighterName(fighter.name));
        }
        if (type === 'Multi-Fight') {
            dispatch(setMultiFighterId(fighter.id));
            dispatch(setMultiFighterName(fighter.name));
        }
        navigation.goBack();
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                <View>
                    <Text style={styles.title}>Search Fighters</Text>
                    <Text style={styles.subtitle}>
                        Find fighters and explore their profiles to discover potential
                        matchups.
                    </Text>
                </View>
                <SearchForFighterFlow chooseFighter={handleChooseFighter} />
            </View>
        </View>
    );
};

export default PromotionAllFighterExclusiveTypeOffersListScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        flex: 1,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '400',
    },
});
