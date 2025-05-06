import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {getFullInfoAboutFighter} from '@/service/service';
import ContentLoader from '@/components/ContentLoader';
import {FighterInfoResponse} from '@/service/response';
import {FighterDescription} from "@/components/fighter/FighterDescription";
import {FighterCharacters} from "@/components/fighter/FighterCharacters";
import {FighterAndManagerClickHeader} from "@/components/fighter/FighterAndManagerClickHeader";
import {FighterManagerButtonsWithSelect} from "@/components/fighter/FighterManagerButtonsWithSelect";
import {useLocalSearchParams} from "expo-router";

const PromotionFighterDetailsWithSelectFighterScreen = () => {
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [fighter, setFighter] = useState<FighterInfoResponse | null>(null);
    const params = useLocalSearchParams();
    const {fighterId} = params as {fighterId: string};
    const {offerId} = params as {offerId: string};
    const {currency} = params as {currency: string};
    const {eligibleToSelect} = params as {eligibleToSelect: string};

    const [contentLoading, setContentLoading] = useState(false);
    useEffect(() => {
        setContentLoading(true);
        if (fighterId) {
            getFullInfoAboutFighter(fighterId)
                .then(res => {
                    setFighter(res);
                })
                .finally(() => {
                    setContentLoading(false);
                });
        }
    }, [fighterId]);

    if (contentLoading) {
        return <ContentLoader />;
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <FighterAndManagerClickHeader fighter={fighter} />
                <FighterManagerButtonsWithSelect
                    fighter={fighter}
                    offerId={offerId}
                    fighterId={fighterId}
                    currency={currency}
                    eligibleToSelect={eligibleToSelect==='true'}
                />
                <FighterDescription description={fighter?.description} />

                <FighterCharacters fighter={fighter} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
});

export default PromotionFighterDetailsWithSelectFighterScreen;
