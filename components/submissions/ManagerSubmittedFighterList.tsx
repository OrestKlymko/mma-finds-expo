import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {PublicOfferInfo, ShortInfoFighter} from '@/service/response';
import {SubmittedInformationPublicOffer} from "@/models/tailoring-model";
import {useRouter} from "expo-router";
import {SubmittedFighterList} from "@/components/offers/public/SubmittedFighterList";
import colors from "@/styles/colors";
import {FeatureFighterBottomSheet} from "@/components/submissions/FeaturedFighterBottomSheet";


interface OfferDetailFooterProps {
    fighters: ShortInfoFighter[];
    offer?: PublicOfferInfo | null | undefined;
    submittedInformation?: SubmittedInformationPublicOffer;
    previousInfo?: SubmittedInformationPublicOffer;
    onRefreshFighterList: () => void;
}

export const ManagerSubmittedFighterList = ({
                                                fighters,
                                                offer,
                                                onRefreshFighterList,
                                            }: OfferDetailFooterProps) => {
    const router = useRouter();
    const [showFeatureModal, setShowFeatureModal] = useState(false);

    const handleOnCloseModalFeature = () => {
        setShowFeatureModal(false);
    };
    const [chooseFighter, setChooseFighter] = useState<any>();
    return (
        <>
            <Text style={styles.eventTitle}>Submitted Fighters</Text>
            {fighters && fighters.length > 0 && (
                <SubmittedFighterList
                    scrollEnabled={false}
                    fighters={fighters}
                    onSelectFighter={item => {
                        setChooseFighter(item);
                        setShowFeatureModal(true);
                    }}
                />
            )}
            <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                    if (!offer) return;
                    // router.navigate('SubmitFighterOfferScreen', {
                    //     offer,
                    //     submittedFighters: fighters,
                    // }); TODO REWORK
                }}>
                <Text style={styles.submitText}>Submit Fighter</Text>
            </TouchableOpacity>
            <FeatureFighterBottomSheet
                onRefreshFighterList={onRefreshFighterList}
                visible={showFeatureModal}
                onClose={handleOnCloseModalFeature}
                offerId={offer?.offerId}
                fighterId={chooseFighter?.id}
                eventImage={offer?.eventImageLink}
                isFeatured={chooseFighter?.isFeatured}
            />
        </>
    );
};

const styles = StyleSheet.create({
    submitButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },
    submitText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 20,
        marginTop: 20,
        color: colors.primaryGreen,
    },
});
