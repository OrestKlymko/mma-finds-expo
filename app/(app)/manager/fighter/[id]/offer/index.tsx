import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {getFullInfoAboutFighter} from '@/service/service';
import ContentLoader from '@/components/ContentLoader';
import {FighterInfoResponse} from '@/service/response';
import {FighterCharacters} from "@/components/fighter/FighterCharacters";
import {useLocalSearchParams} from "expo-router";
import {FighterDescription} from "@/components/fighter/FighterDescription";
import {FighterAndManagerClickHeader} from "@/components/fighter/FighterAndManagerClickHeader";

const PromotionFighterDetailOfferScreen = () => {
    const insets = useSafeAreaInsets();
    const [fighter, setFighter] = useState<FighterInfoResponse | null>(null);
    const {id} = useLocalSearchParams<{ id: string }>();
    const [contentLoading, setContentLoading] = useState(false);
    useEffect(() => {
        setContentLoading(true);
        getFullInfoAboutFighter(id)
            .then(res => {
                setFighter(res);
            })
            .finally(() => {
                setContentLoading(false);
            });
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
    }
});

export default PromotionFighterDetailOfferScreen;
