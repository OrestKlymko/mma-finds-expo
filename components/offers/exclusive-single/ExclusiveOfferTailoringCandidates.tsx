import React from 'react';
import {ExclusiveOfferInfo, ShortInfoFighter, SubmittedInformationOffer,} from '@/service/response';
import {ChatOfferComponent} from '../ChatOfferComponent';
import FighterCard from "@/components/FighterCard";
import {ChooseAnotherFighterButton} from "@/components/offers/exclusive-multi/ChooseAnotherFighterButton";
import {useRouter} from "expo-router";
import {
    ExclusivePromotionTailoringStatus
} from "@/components/offers/exclusive-single/ExclusivePromotionTailoringStatus";

type ExclusiveOfferTailoringCandidates = {
    fighter: ShortInfoFighter;
    offer: ExclusiveOfferInfo;
    docs: Document[];
    submittedInformation?: SubmittedInformationOffer;
    previousInfo?: SubmittedInformationOffer;
};

export const ExclusiveOfferTailoringCandidates = ({
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
                onPress={item =>
                    router.push(`/(app)/manager/fighter/${item.id}/offer`)
                }
            />
            <ChatOfferComponent
                offer={offer}
                avatar={offer.managerAvatar}
                receiverUserId={offer.managerId}
                senderName={offer.managerName}
                typeOffer={'Exclusive'}
            />
            <ExclusivePromotionTailoringStatus
                offer={offer}
                docs={docs}
                submittedInformation={submittedInformation}
                previousInfo={previousInfo}
            />
        </>
    ) : (
        <ChooseAnotherFighterButton type={'Exclusive'}/>
    );
};
