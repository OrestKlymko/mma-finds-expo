import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getMultiFightOfferById} from '@/service/service';
import colors from '@/styles/colors';
import ContentLoader from '@/components/ContentLoader';
import {MultiContractFullInfo, ShortInfoFighter, SubmittedInformationOffer,} from '@/service/response';
import {EventPosterImage} from "@/components/offers/public/EventPosterImage";
import {TitleWithAction} from "@/components/offers/public/TitleWithAction";
import {MainOfferDetails} from "@/components/offers/exclusive-multi/MainOfferDetails";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {MultiFightPurseGrid} from "@/components/offers/exclusive-multi/MultiFightPurseGrid";
import ExclusiveMyFighterList from "@/components/offers/ExclusiveMyFighterList";
import {MultiFightOfferManagerTailoringCandidates} from "@/components/offers/MultiFightOfferManagerTailoringCandidates";

export const ManagerMultiFightOffer = () => {
    const insets = useSafeAreaInsets();
    const [offer, setOffer] = useState<MultiContractFullInfo | null>(null);
    const [fighter, setFighter] = useState<ShortInfoFighter | null>(null);
    const [submissionInformations, setSubmissionInformations] = useState<
        SubmittedInformationOffer[]
    >([]);
    const [previousInfo, setPreviousInfo] = useState<SubmittedInformationOffer[]>();
    const [contentLoader, setContentLoader] = useState(false);

    const {id} = useLocalSearchParams<{ id: string }>();

    useFocusEffect(
        React.useCallback(() => {
            if (!id) return;
            setContentLoader(true);
            getMultiFightOfferById(id, null)
                .then(res => {
                    setPreviousInfo(res.previousOfferPrice);
                    setOffer(res.offer);
                    setFighter(res.fighter);
                    setSubmissionInformations(res.submittedInformation);
                })
                .finally(() => setContentLoader(false));
        }, [id]),
    );

    if (contentLoader) {
        return <ContentLoader/>;
    }


    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.background}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <EventPosterImage eventImageLink={offer?.promotionAvatar}/>

                <View style={styles.eventDetailsContainer}>
                    <TitleWithAction title={'Multi-Fight Offer'}/>
                    <MainOfferDetails offer={offer}/>
                    <MultiFightPurseGrid submittedInformation={submissionInformations}/>
                    {(offer && fighter) ? <MultiFightOfferManagerTailoringCandidates offer={offer} fighter={fighter}
                                                                                     submittedInformation={submissionInformations}
                                                                                     previousInfo={previousInfo}/> :
                        <ExclusiveMyFighterList offerType={'Multi-Fight Offer'} fighter={fighter}
                                                offerId={offer?.offerId}/>}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
    },
    eventDetailsContainer: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        marginTop: -50
    },
});
