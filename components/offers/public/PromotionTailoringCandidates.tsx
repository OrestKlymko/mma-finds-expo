import React from 'react';
import {PromotionTailoringSubmittedFighters} from './PromotionTailoringSubmittedFighters';
import {PublicOfferInfo, ShortInfoFighter, SubmittedInformationOffer} from '@/service/response';
import {useRouter} from "expo-router";
import {SubmittedFighterList} from "@/components/offers/public/SubmittedFighterList";
import {ChatOfferComponent} from "@/components/offers/ChatOfferComponent";
import {PromotionTailoringStatus} from "@/components/offers/public/PromotionTailoringStatus";

type TailoringCandidatesProps = {
    fighters: ShortInfoFighter[];
    offer: PublicOfferInfo;
    selectedTab: string;
    docs: Document[];
    submittedInformation?: SubmittedInformationOffer;
    previousInfo?: SubmittedInformationOffer;
    chosenFighter: ShortInfoFighter | undefined;
};

export const PromotionTailoringCandidates = ({
                                                 fighters,
                                                 offer,
                                                 selectedTab,
                                                 docs,
                                                 submittedInformation,
                                                 chosenFighter,
                                                 previousInfo,
                                             }: TailoringCandidatesProps) => {
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
                    <ChatOfferComponent
                        offer={offer}
                        avatar={
                            chosenFighter?.managerAvatar
                        }
                        receiverUserId={
                            chosenFighter?.managerId
                        }
                        senderName={
                            chosenFighter?.managerName
                        }
                        typeOffer={'Public'}
                    />
                    <PromotionTailoringStatus
                        offer={offer}
                        docs={docs}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
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
                    <ChatOfferComponent
                        offer={offer}
                        avatar={
                            chosenFighter?.managerAvatar
                        }
                        receiverUserId={
                            chosenFighter?.managerId
                        }
                        senderName={
                            chosenFighter?.managerName
                        }
                        typeOffer={'Public'}
                    />
                    <PromotionTailoringStatus
                        offer={offer}
                        docs={docs}
                        submittedInformation={submittedInformation}
                        previousInfo={previousInfo}
                    />
                </>
            );
        case 'Submitted Fighters':
            return (
                <PromotionTailoringSubmittedFighters
                    submittedFighters={fighters}
                    offer={offer}
                />
            );
        default:
            return null;
    }
};
