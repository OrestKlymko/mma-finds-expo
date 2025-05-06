import React from 'react';
import {MultiContractFullInfo, ShortInfoFighter, SubmittedInformationOffer,} from '@/service/response';
import FighterCard from "@/components/FighterCard";
import {ChatOfferComponent} from "@/components/offers/ChatOfferComponent";
import {useRouter} from "expo-router";
import {
    MultiFightPromotionTailoringStatus
} from "@/components/offers/exclusive-multi/MultiFightPromotionTailoringStatus";
import {ChooseAnotherFighterButton} from "@/components/offers/exclusive-multi/ChooseAnotherFighterButton";


type ExclusiveOfferTailoringCandidates = {
    fighter: ShortInfoFighter;
    offer: MultiContractFullInfo;
    docs: Document[];
    submittedInformation?: SubmittedInformationOffer[];
    previousInfo?: SubmittedInformationOffer[];
};

export const MultiFightOfferTailoringCandidates = ({
                                                       fighter,
                                                       offer,
                                                       docs,
                                                       submittedInformation,
                                                       previousInfo,
                                                   }: ExclusiveOfferTailoringCandidates) => {
    const router = useRouter();
    return fighter ? (
        <>
            <FighterCard
                fighter={fighter}
                onPress={item => {
                    router.push(`/(app)/manager/fighter/${item.id}/offer`)
                }}
            />
            <ChatOfferComponent
                offer={offer}
                avatar={offer.managerAvatar}
                receiverUserId={offer.managerId}
                senderName={offer.managerName}
                typeOffer={'Multi-fight contract'}
            />
            <MultiFightPromotionTailoringStatus
                offer={offer}
                docs={docs}
                submittedInformation={submittedInformation}
                previousInfo={previousInfo}
            />
        </>
    ) : (
        <ChooseAnotherFighterButton type={'Multi-fight'}/>
    );
};
