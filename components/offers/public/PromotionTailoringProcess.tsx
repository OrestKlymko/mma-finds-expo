import React, {useEffect} from 'react';
import {getAllRequiredDocumentsForPublicOffer} from '@/service/service';
import {PromotionTailoringSubmittedFighters} from './PromotionTailoringSubmittedFighters';
import {PromotionTailoringCandidates} from './PromotionTailoringCandidates';
import {PublicOfferInfo, ShortInfoFighter, SubmittedInformationOffer} from '@/service/response';
import {PromotionTailoringTabs} from "@/components/offers/PromotionTailoringTabs";

interface OfferDetailFooterProps {
    fighters: ShortInfoFighter[];
    offer: PublicOfferInfo;
    chosenFighter: ShortInfoFighter | undefined;
    submittedInformation?: SubmittedInformationOffer;
    previousInfo?: SubmittedInformationOffer;
}

export const PromotionTailoringProcess = ({
                                              fighters,
                                              offer,
                                              submittedInformation,
                                              previousInfo,
                                                chosenFighter
                                          }: OfferDetailFooterProps) => {
    const [selectedTab, setSelectedTab] = React.useState<
        'Preselected Fighter' | 'Submitted Fighters' | 'Selected Fighter'
    >('Preselected Fighter');

    const [docs, setDocs] = React.useState<any[]>([]);
    useEffect(() => {
        if (submittedInformation?.statusResponded === 'ACCEPTED') {
            setSelectedTab('Selected Fighter');
            if (!offer) return;
            getAllRequiredDocumentsForPublicOffer(offer.offerId).then(
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
    return submittedInformation ? (
        <>
            <PromotionTailoringTabs
                submittedInformation={submittedInformation}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            <PromotionTailoringCandidates
                chosenFighter={chosenFighter}
                fighters={fighters}
                offer={offer}
                selectedTab={selectedTab}
                docs={docs}
                submittedInformation={submittedInformation}
                previousInfo={previousInfo}
            />
        </>
    ) : (
        <>
            <PromotionTailoringSubmittedFighters
                submittedFighters={fighters}
                offer={offer}
                submittedInformation={submittedInformation}
            />
        </>
    );
};
