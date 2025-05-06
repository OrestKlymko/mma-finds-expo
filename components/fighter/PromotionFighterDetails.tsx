import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet,} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {getFullInfoAboutFighter} from '@/service/service';
import ContentLoader from '@/components/ContentLoader';
import {FighterInfoResponse} from '@/service/response';
import {FighterHeaderAndManagerInfo} from "@/components/fighter/FighterHeaderAndManagerInfo";
import {FighterManageButtonWithSendExclusiveOffer} from "@/components/fighter/FighterManageButtonWithSendExclusiveOffer";
import {FighterLookingState} from "@/components/fighter/FighterLookingState";
import {FighterCharacters} from "@/components/fighter/FighterCharacters";
import {FighterDescription} from "@/components/fighter/FighterDescription";

const PromotionFighterDetails = () => {
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [fighter, setFighter] = useState<FighterInfoResponse | null>(null);
    const {fighterId} = route.params as {fighterId: string};
    const [contentLoading, setContentLoading] = useState(false);
    useEffect(() => {
        setContentLoading(true);
        getFullInfoAboutFighter(fighterId)
            .then(res => {
                setFighter(res);
            })
            .finally(() => {
                setContentLoading(false);
            });
    }, []);

    if (contentLoading) {
        return <ContentLoader />;
    }
    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.white}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <FighterHeaderAndManagerInfo fighter={fighter} />
                <FighterManageButtonWithSendExclusiveOffer fighterId={fighterId} fighter={fighter} />
                <FighterLookingState
                    lookingForOpponent={fighter?.lookingForOpponent ?? true}
                />
                <FighterDescription description={fighter?.description} />
                <FighterCharacters fighter={fighter} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
});

export default PromotionFighterDetails;
