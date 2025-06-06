import React from 'react';
import {ExclusiveOfferInfo, ShortInfoFighter, SubmittedInformationOffer,} from '@/service/response';
import {ChatOfferComponent} from '../ChatOfferComponent';
import {useRouter} from "expo-router";
import {SubmittedFighterList} from "@/components/offers/public/SubmittedFighterList";
import {ManagerTailoringStatus} from "@/components/submissions/ManagerTailoringStatus";
import {
    SubmittedFighterPrivateOfferSection
} from "@/components/offers/exclusive-single/SubmittedFighterPrivateOfferSection";
import {DocumentTailoring} from "@/components/DocumentTailoring";
import {PromotionTailoringStatus} from "@/components/offers/public/PromotionTailoringStatus";
import {SubmittedFightersSection} from "@/components/offers/public/SubmittedFightersSection";
import {OfferTypeEnum} from "@/models/model";

type ExclusiveOfferTailoringCandidates = {
    submittedFighters: ShortInfoFighter[];
    chosenFighter: ShortInfoFighter | null | undefined;
    offer: ExclusiveOfferInfo | null;
    docs: Document[];
    selectedTab: string;
    submittedInformation?: SubmittedInformationOffer;
    previousInfo?: SubmittedInformationOffer;
};

export const PrivateOfferPromotionCandidates = ({
                                                    submittedFighters,
                                                    offer,
                                                    docs,
                                                    chosenFighter,
                                                    selectedTab,
                                                    submittedInformation,
                                                    previousInfo,
                                                }: ExclusiveOfferTailoringCandidates) => {
    const router = useRouter();

    switch (selectedTab) {
        case 'Preselected Fighter':
            return (
                <>
                    <SubmittedFighterList
                        fighters={[chosenFighter]}
                        scrollEnabled={false}
                        onSelectFighter={item => {
                            router.push(`/(app)/manager/fighter/${item.id}/offer`)
                        }}
                    />
                    {chosenFighter && <ChatOfferComponent
                        offer={offer}
                        avatar={chosenFighter?.managerAvatar}
                        receiverUserId={chosenFighter?.managerId}
                        senderName={chosenFighter.managerName}
                        typeOffer={'Public'}
                    />}
                    <PromotionTailoringStatus offer={offer} typeOffer={'Exclusive'}
                                              docs={docs}
                                              submittedInformation={submittedInformation} previousInfo={previousInfo}/>
                </>
            );
        case 'Selected Fighter':
            return (
                <>
                    <SubmittedFighterList
                        fighters={[chosenFighter]}
                        scrollEnabled={false}
                        onSelectFighter={item => {
                            router.push(`/(app)/manager/fighter/${item.id}/offer`)
                        }}
                    />
                    {chosenFighter && <ChatOfferComponent
                        offer={offer}
                        avatar={chosenFighter?.managerAvatar}
                        receiverUserId={chosenFighter?.managerId}
                        senderName={chosenFighter.managerName}
                        typeOffer={'Public'}
                    />}
                    <PromotionTailoringStatus docs={docs} offer={offer} previousInfo={previousInfo}
                                              submittedInformation={submittedInformation} typeOffer={'Exclusive'}/>
                </>
            );
        case 'Submitted Fighters':
            return (
                <SubmittedFightersSection
                    fighters={submittedFighters}
                    offer={offer}
                    offerType={OfferTypeEnum.PRIVATE}
                    chosenFighter={chosenFighter}
                />
            );
        default:
            return null;
    }

};
