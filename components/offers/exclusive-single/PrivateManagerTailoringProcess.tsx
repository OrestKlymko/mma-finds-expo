import React, {useEffect} from 'react';
import {ExclusiveOfferInfo, ShortInfoFighter, SubmittedInformationOffer,} from '@/service/response';
import {getAllRequiredDocumentsForExclusiveOffer} from '@/service/service';
import {PromotionTailoringTabs} from "@/components/offers/PromotionTailoringTabs";

import {
    SubmittedFighterPrivateOfferSection
} from "@/components/offers/exclusive-single/SubmittedFighterPrivateOfferSection";
import {PrivateOfferManagerCandidates} from "@/components/offers/exclusive-single/PrivateOfferManagerCandidates";
import {Text, TouchableOpacity} from "react-native";
import colors from "@/styles/colors";
import {useRouter} from "expo-router";
import {LogInAndSubmitFighterButton} from "@/components/offers/LogInAndSubmitFighterButton";

interface ExclusivePromotionTailoringProcessProps {
    submittedFighters: ShortInfoFighter[],
    chosenFighter?: ShortInfoFighter | null,
    offer: ExclusiveOfferInfo | null,
    submittedInformation?: SubmittedInformationOffer,
    previousInfo?: SubmittedInformationOffer,
    onRefresh: () => void,
    role?: "MANAGER" | "PROMOTION" | "PROMOTION_EMPLOYEE" | "ANONYMOUS" | null | undefined
}

export const PrivateManagerTailoringProcess = ({
                                                   submittedFighters,
                                                   chosenFighter,
                                                   offer,
                                                   submittedInformation,
                                                   previousInfo,
                                                   onRefresh,
                                                   role
                                               }: ExclusivePromotionTailoringProcessProps) => {
    const [docs, setDocs] = React.useState<any[]>([]);
    const router = useRouter();
    const [selectedTab, setSelectedTab] = React.useState<
        'Preselected Fighter' | 'Submitted Fighters' | 'Selected Fighter'
    >('Preselected Fighter');
    useEffect(() => {
        if (submittedInformation?.statusResponded === 'ACCEPTED') {
            if (!offer) return;
            getAllRequiredDocumentsForExclusiveOffer(offer.offerId).then(
                docsFromBackend => {
                    const mapped = docsFromBackend.map((doc: any) => ({
                        documentName: doc.documentName,
                        documentType: doc.documentType,
                        documentId: doc.documentId,
                        originalValue: doc.response || '',
                        response: doc.response || '',
                        fileUrl: doc.response || null,
                        isLoading: false,
                        hasSuccess: false,
                    }));
                    setDocs(mapped);
                },
            );
        }
    }, [offer, submittedInformation]);

    if (!role || role === 'ANONYMOUS') {
        return <LogInAndSubmitFighterButton/>
    }

    return chosenFighter ? (
        <>
            <PromotionTailoringTabs
                submittedInformation={submittedInformation}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            <PrivateOfferManagerCandidates
                submittedFighters={submittedFighters}
                chosenFighter={chosenFighter}
                offer={offer}
                selectedTab={selectedTab}
                docs={docs}
                submittedInformation={submittedInformation}
                previousInfo={previousInfo}
            />
        </>
    ) : (
        <SubmittedFighterPrivateOfferSection onRefresh={onRefresh} submittedFighters={submittedFighters} offer={offer}
                                             submittedInformation={submittedInformation}/>
    );
};
