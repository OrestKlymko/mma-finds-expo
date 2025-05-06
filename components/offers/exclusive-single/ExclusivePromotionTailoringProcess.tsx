import React, {useEffect} from 'react';
import {ExclusiveOfferInfo, ShortInfoFighter, SubmittedInformationOffer,} from '@/service/response';
import {getAllRequiredDocumentsForExclusiveOffer} from '@/service/service';
import {ExclusiveOfferTailoringCandidates} from './ExclusiveOfferTailoringCandidates';

interface ExclusivePromotionTailoringProcessProps {
    fighter: ShortInfoFighter;
    offer: ExclusiveOfferInfo;
    submittedInformation?: SubmittedInformationOffer;
    previousInfo?: SubmittedInformationOffer;
}

export const ExclusivePromotionTailoringProcess = ({
                                                       fighter,
                                                       offer,
                                                       submittedInformation,
                                                       previousInfo,
                                                   }: ExclusivePromotionTailoringProcessProps) => {
    const [docs, setDocs] = React.useState<any[]>([]);
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

    return (
        <ExclusiveOfferTailoringCandidates
            fighter={fighter}
            offer={offer}
            docs={docs}
            submittedInformation={submittedInformation}
            previousInfo={previousInfo}
        />
    );
};
