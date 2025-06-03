import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

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
import {FighterLookingState} from "@/components/fighter/FighterLookingState";
import {OfferTypeEnum} from "@/models/model";

const PromotionFighterDetailsWithSelectFighterScreen = () => {
    const insets = useSafeAreaInsets();
    const [fighter, setFighter] = useState<FighterInfoResponse | null>(null);
    const params = useLocalSearchParams();
    const {id} = params as { id: string };
    const {offerId} = params as { offerId: string };
    const {currency} = params as { currency: string };
    const {eligibleToSelect} = params as { eligibleToSelect: string };
    const offerType = JSON.parse(params.offerType as OfferTypeEnum || undefined);
    const [contentLoading, setContentLoading] = useState(false);
    useEffect(() => {
        setContentLoading(true);
        if (id) {
            getFullInfoAboutFighter(id)
                .then(res => {
                    setFighter(res);
                })
                .finally(() => {
                    setContentLoading(false);
                });
        }
    }, [id]);

    if (contentLoading) {
        return <ContentLoader/>;
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <FighterAndManagerClickHeader fighter={fighter}/>
                <FighterManagerButtonsWithSelect
                    fighter={fighter}
                    offerId={offerId}
                    fighterId={id}
                    currency={currency}
                    eligibleToSelect={eligibleToSelect === 'true'}
                    offerType={offerType}
                />
                <FighterLookingState
                    lookingForOpponent={fighter?.lookingForOpponent ?? true}
                />
                <FighterDescription description={fighter?.description}/>

                <FighterCharacters fighter={fighter}/>
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
