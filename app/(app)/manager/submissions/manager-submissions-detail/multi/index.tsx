import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getMultiFightOfferById} from '@/service/service';
import colors from '@/styles/colors';
import ContentLoader from '@/components/ContentLoader';
import {
    MultiContractFullInfo,
    ShortInfoFighter,
    SubmittedInformationOffer,
} from '@/service/response';
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {EventPosterImage} from "@/components/offers/public/EventPosterImage";
import {TitleWithAction} from "@/components/offers/public/TitleWithAction";
import {MainOfferDetails} from "@/components/offers/exclusive-multi/MainOfferDetails";
import {MultiFightOfferManagerTailoringCandidates} from "@/components/offers/MultiFightOfferManagerTailoringCandidates";


export const ManagerMultiFightOfferDetailsScreen = () => {
    const insets = useSafeAreaInsets();

    const [offer, setOffer] = useState<MultiContractFullInfo | null>(null);
    const [fighter, setFighter] = useState<ShortInfoFighter | null>(null);
    const [contentLoader, setContentLoader] = useState(false);
    const [submissionInformations, setSubmissionInformations] = useState<
        SubmittedInformationOffer[]
    >([]);
    const [previousSubmission, setPreviousSubmission] = useState<
        SubmittedInformationOffer[]
    >([]);
    const {offerId}=useLocalSearchParams<{offerId:string}>();

    useFocusEffect(
        React.useCallback(() => {
            if (!offerId) return;
            getMultiFightOffer();
        }, [offerId]),
    );

    const getMultiFightOffer = () => {
        setContentLoader(true);
        getMultiFightOfferById(offerId)
            .then(res => {
                setOffer(res.offer);
                setFighter(res.fighter);
                setSubmissionInformations(res.submittedInformation);
                setPreviousSubmission(res.previousOfferPrice);
            })
            .finally(() => setContentLoader(false));
    };

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
                    <MainOfferDetails offer={offer} />
                    {fighter && offer && submissionInformations && (
                        <MultiFightOfferManagerTailoringCandidates
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
        marginTop: -50,
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
        marginTop: 20,
        zIndex: 10,
    },
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryGreen,
    },
});

export default ManagerMultiFightOfferDetailsScreen;
