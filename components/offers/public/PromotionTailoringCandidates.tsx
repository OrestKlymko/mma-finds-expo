import React from 'react';
import {PromotionTailoringSubmittedFighters} from './PromotionTailoringSubmittedFighters';
import {PublicOfferInfo, SubmittedInformationOffer} from '@/service/response';
import {useRouter} from "expo-router";
import {SubmittedFighterList} from "@/components/offers/public/SubmittedFighterList";
import {ChatOfferComponent} from "@/components/offers/ChatOfferComponent";
import {PromotionTailoringStatus} from "@/components/offers/public/PromotionTailoringStatus";

type TailoringCandidatesProps = {
    fighters: any[];
    offer: PublicOfferInfo;
    selectedTab: string;
    docs: Document[];
    submittedInformation?: SubmittedInformationOffer;
    previousInfo?: SubmittedInformationOffer;
};

export const PromotionTailoringCandidates = ({
                                                 fighters,
                                                 offer,
                                                 selectedTab,
                                                 docs,
                                                 submittedInformation,
                                                 previousInfo,
                                             }: TailoringCandidatesProps) => {
    const router = useRouter();

    switch (selectedTab) {
        case 'Preselected Fighter':
            return (
                <>
                    <SubmittedFighterList
                        fighters={fighters.filter(
                            fighter => fighter.id === offer.chooseFighterId,
                        )}
                        scrollEnabled={false}
                        onSelectFighter={item => {
                            router.push(`/(app)/manager/fighter/${item.id}/offer`)
                        }}
                    />
                    <ChatOfferComponent
                        offer={offer}
                        avatar={
                            fighters.filter(f => f.id === offer.chooseFighterId)[0]
                                .managerAvatar
                        }
                        receiverUserId={
                            fighters.filter(f => f.id === offer.chooseFighterId)[0].managerId
                        }
                        senderName={
                            fighters.filter(f => f.id === offer.chooseFighterId)[0]
                                .managerName
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
                        fighters={fighters.filter(
                            fighter => fighter.id === offer.chooseFighterId,
                        )}
                        scrollEnabled={false}
                        onSelectFighter={item => {
                            router.push(`/(app)/manager/fighter/${item.id}/offer`)
                        }}
                    />
                    <ChatOfferComponent
                        offer={offer}
                        avatar={
                            fighters.filter(f => f.id === offer.chooseFighterId)[0]
                                .managerAvatar
                        }
                        receiverUserId={
                            fighters.filter(f => f.id === offer.chooseFighterId)[0].managerId
                        }
                        senderName={
                            fighters.filter(f => f.id === offer.chooseFighterId)[0]
                                .managerName
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
                    fighters={fighters}
                    offer={offer}
                />
            );
        default:
            return null;
    }
};
