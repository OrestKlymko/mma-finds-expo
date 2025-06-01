import React, {useEffect} from 'react';
import {ExclusiveOfferInfo, ShortInfoFighter, SubmittedInformationOffer,} from '@/service/response';
import {getAllRequiredDocumentsForExclusiveOffer} from '@/service/service';
import {PromotionTailoringTabs} from "@/components/offers/PromotionTailoringTabs";
import {
    SubmittedFighterPrivateOfferSection
} from "@/components/offers/exclusive-single/SubmittedFighterPrivateOfferSection";
import {PrivateOfferPromotionCandidates} from "@/components/offers/exclusive-single/PrivateOfferPromotionCandidates";

interface ExclusivePromotionTailoringProcessProps {
    submittedFighters: ShortInfoFighter[];
    chosenFighter?: ShortInfoFighter | null;
    offer: ExclusiveOfferInfo | null;
    submittedInformation?: SubmittedInformationOffer;
    previousInfo?: SubmittedInformationOffer;
    onRefresh: () => void;
}

export const PrivatePromotionTailoringProcess = ({
                                                     submittedFighters,
                                                     chosenFighter,
                                                     offer,
                                                     submittedInformation,
                                                     previousInfo,
                                                     onRefresh
                                                 }: ExclusivePromotionTailoringProcessProps) => {
    const [docs, setDocs] = React.useState<any[]>([]);
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

    return chosenFighter ? (
        <>
            <PromotionTailoringTabs
                submittedInformation={submittedInformation}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            <PrivateOfferPromotionCandidates
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
        <SubmittedFighterPrivateOfferSection onRefresh={onRefresh} submittedFighters={submittedFighters}
                                             submittedInformation={submittedInformation} offer={offer}/>
    );
};
