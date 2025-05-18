import React from 'react';
import {
    MultiContractFullInfo,
    ShortInfoFighter,
    SubmittedInformationOffer,
} from '@/service/response';
import {useAuth} from '@/context/AuthContext';
import FighterCard from "@/components/FighterCard";
import {ChatOfferComponent} from "@/components/offers/ChatOfferComponent";
import {useRouter} from "expo-router";
import {MultiFightManagerTailoringStatus} from "@/components/offers/MultiFightManagerTailoringStatus";

type ExclusiveOfferTailoringCandidates = {
    fighter: ShortInfoFighter;
    offer: MultiContractFullInfo;
    submittedInformation?: SubmittedInformationOffer[];
    previousInfo?: SubmittedInformationOffer[];
};

export const MultiFightOfferManagerTailoringCandidates = ({
                                                              fighter,
                                                              offer,
                                                              submittedInformation,
                                                              previousInfo,
                                                          }: ExclusiveOfferTailoringCandidates) => {
    const router = useRouter();
    return (
        <>
            <FighterCard
                fighter={fighter}
                onPress={item => {
                    router.push(`/(app)/manager/fighter/${item.id}/offer`)
                }
                }
            />
            {submittedInformation && submittedInformation[0].statusResponded === 'REJECTED' && <ChatOfferComponent
                offer={offer}
                avatar={offer.promotionAvatar}
                receiverUserId={offer.promotionId}
                senderName={offer.promotionName}
                typeOffer={'Multi-fight contract'}
            />}
            <MultiFightManagerTailoringStatus
                offer={offer}
                submittedInformation={submittedInformation}
                previousInfo={previousInfo}
            />
        </>
    );
};
