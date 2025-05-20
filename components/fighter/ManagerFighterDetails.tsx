import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from 'react-native'
import React, {useCallback, useState} from 'react'
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {FighterInfoResponse} from '@/service/response';
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {getFullInfoAboutFighter} from '@/service/service';
import ContentLoader from '../ContentLoader';
import colors from "@/styles/colors";
import GoBackButton from '../GoBackButton';
import {FighterDescription} from './FighterDescription';
import {FighterCharacters} from "@/components/fighter/FighterCharacters";
import {ManageFighterHeaderAndButtons} from "@/components/fighter/ManageFighterHeaderAndButtons";
import {ViewSubmissionButton} from "@/components/fighter/ViewSubmissionButton";
import {SwitchLookingFight} from "@/components/fighter/SwitchLookingFight";
import {FighterSportScores} from "@/components/fighter/FighterSportScores";

const ManagerFighterDetails = () => {
    const insets = useSafeAreaInsets();
    const [fighter, setFighter] = useState<FighterInfoResponse | null>(null);
    const {id} = useLocalSearchParams<{ id: string }>()
    const [isFighterLookingFight, setIsFighterLookingFight] = useState(false);
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setContentLoading(true);
            getFullInfoAboutFighter(id)
                .then(res => {
                    setIsFighterLookingFight(res.lookingForOpponent);
                    setFighter(res);
                })
                .finally(() => {
                    setContentLoading(false);
                });
        }, [id]),
    );

    if (contentLoading) {
        return <ContentLoader/>;
    }
    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.background}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <GoBackButton/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <ManageFighterHeaderAndButtons fighter={fighter}/>
                <ViewSubmissionButton fighterId={id}/>
                <SwitchLookingFight
                    fighterId={id}
                    isFighterLookingFight={isFighterLookingFight}
                    setIsFighterLookingFight={setIsFighterLookingFight}
                />
                <FighterDescription description={fighter?.description}/>
                <FighterCharacters fighter={fighter}/>
                <FighterSportScores sportScore={fighter?.sportScore}/>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
export default ManagerFighterDetails

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
});
