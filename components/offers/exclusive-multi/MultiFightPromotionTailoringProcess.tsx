import React, {useEffect} from 'react';
import {MultiContractFullInfo, ShortInfoFighter, SubmittedInformationOffer,} from '@/service/response';
import {MultiFightOfferTailoringCandidates} from './MultiFightOfferTailoringCandidates';
import {getAllRequiredDocumentsForMultiFightOffer} from '@/service/service';


interface ExclusivePromotionTailoringProcessProps {
    fighter?: ShortInfoFighter | null;
    offer: MultiContractFullInfo;
    submittedInformation?: SubmittedInformationOffer[];
    previousInfo?: SubmittedInformationOffer[];
}

export const MultiFightPromotionTailoringProcess = ({
                                                        fighter,
                                                        offer,
                                                        submittedInformation,
                                                        previousInfo,
                                                    }: ExclusivePromotionTailoringProcessProps) => {
    const [docs, setDocs] = React.useState<any[]>([]);
    useEffect(() => {
        if (submittedInformation?.[0].statusResponded === 'ACCEPTED') {
            if (!offer) return;
            getAllRequiredDocumentsForMultiFightOffer(offer.offerId).then(
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
        <MultiFightOfferTailoringCandidates
            fighter={fighter}
            offer={offer}
            docs={docs}
            submittedInformation={submittedInformation}
            previousInfo={previousInfo}
        />
    );
};
