import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {useFocusEffect, useRoute,} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getMultiFightOfferById} from '@/service/service';
import colors from '@/styles/colors';
import ContentLoader from '@/components/ContentLoader';
import {MultiContractFullInfo, ShortInfoFighter, SubmittedInformationOffer,} from '@/service/response';
import {EventPosterImage} from "@/components/offers/public/EventPosterImage";
import {TitleWithAction} from "@/components/offers/public/TitleWithAction";
import {ShareOffer} from "@/components/offers/public/ShareOffer";
import {MainOfferDetails} from "@/components/offers/exclusive-multi/MainOfferDetails";
import {
    MultiFightPromotionTailoringProcess
} from "@/components/offers/exclusive-multi/MultiFightPromotionTailoringProcess";

export const PromotionMultiFightOffer = () => {
    const route = useRoute();
    const insets = useSafeAreaInsets();

    const [offer, setOffer] = useState<MultiContractFullInfo | null>(null);
    const [fighter, setFighter] = useState<ShortInfoFighter | null>(null);
    const [submissionInformations, setSubmissionInformations] = useState<
        SubmittedInformationOffer[]
    >([]);
    const [previousSubmission, setPreviousSubmission] = useState<
        SubmittedInformationOffer[]
    >([]);
    const [contentLoader, setContentLoader] = useState(false);

    const {offerId} = route.params as {offerId: string};

    useFocusEffect(
        React.useCallback(() => {
            if (!offerId) return;
            setContentLoader(true);
            getMultiFightOfferById(offerId)
                .then(res => {
                    setOffer(res.offer);
                    setFighter(res.fighter);
                    setSubmissionInformations(res.submittedInformation);
                    setPreviousSubmission(res.previousOfferPrice);
                })
                .finally(() => setContentLoader(false));
        }, [offerId]),
    );

    if (contentLoader) {
        return <ContentLoader />;
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
                <EventPosterImage eventImageLink={offer?.promotionAvatar} />

                <View style={styles.eventDetailsContainer}>
                    <TitleWithAction title={'Multi-Fight Offer'} />
                    <ShareOffer offer={offer} typeOffer={'Multi-fight contract'} fighter={fighter}/>
                    <MainOfferDetails offer={offer} />

                    {fighter &&
                        offer &&
                        submissionInformations && (
                            <MultiFightPromotionTailoringProcess
                                fighter={fighter}
                                offer={offer}
                                submittedInformation={submissionInformations}
                                previousInfo={previousSubmission}
                            />
                        )}
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
