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
import {useSubmittedFighter} from "@/context/SubmittedFighterContext";

const PromotionFighterDetailsWithSelectFighterScreen = () => {
    const insets = useSafeAreaInsets();
    const [fighter, setFighter] = useState<FighterInfoResponse | null>(null);
    const params = useLocalSearchParams();
    const {id} = params as { id: string };
    const {store}=useSubmittedFighter();
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
                    offerId={store.offerId}
                    fighterId={id}
                    currency={store.currency}
                    eligibleToSelect={store.eligibleToSelect === 'true'}
                    offerType={store.offerType}
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
