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

type PrivateOfferManagerCandidates = {
    submittedFighters: ShortInfoFighter[];
    chosenFighter: ShortInfoFighter | null | undefined;
    offer: ExclusiveOfferInfo | null;
    docs: Document[];
    selectedTab: string;
    submittedInformation?: SubmittedInformationOffer;
    previousInfo?: SubmittedInformationOffer;
};

export const PrivateOfferManagerCandidates = ({
                                                  submittedFighters,
                                                  offer,
                                                  docs,
                                                  chosenFighter,
                                                  selectedTab,
                                                  submittedInformation,
                                                  previousInfo,
                                              }: PrivateOfferManagerCandidates) => {
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
                    {chosenFighter && submittedInformation?.statusResponded !== 'REJECTED' && <ChatOfferComponent
                        offer={offer}
                        avatar={chosenFighter?.managerAvatar}
                        receiverUserId={chosenFighter?.managerId}
                        senderName={chosenFighter.managerName}
                        typeOffer={'Public'}
                    />}
                    <ManagerTailoringStatus offer={offer} typeOffer={'Exclusive'}
                                            submittedInformation={submittedInformation} previousInfo={previousInfo}/>
                </>
            );
        case 'Selected Fighter':
            return (
                <>
                    <SubmittedFighterList
                        fighters={submittedFighters.filter(
                            fighter => fighter.id === offer?.chooseFighterId,
                        )}
                        scrollEnabled={false}
                        onSelectFighter={item => {
                            router.push(`/(app)/manager/fighter/${item.id}/offer`)
                        }}
                    />
                    {/*//TODO Зробити так, щоб якщо обраний боєць вже є то показувати кінцеву сторінку інакше показувати*/}
                    {/*селект файтерс*/}
                    {chosenFighter && submittedInformation?.statusResponded !== 'REJECTED' && <ChatOfferComponent
                        offer={offer}
                        avatar={chosenFighter?.managerAvatar}
                        receiverUserId={chosenFighter?.managerId}
                        senderName={chosenFighter.managerName}
                        typeOffer={'Public'}
                    />}
                    <ManagerTailoringStatus offer={offer} typeOffer={'Exclusive'}
                                            submittedInformation={submittedInformation} previousInfo={previousInfo}/>
                    <DocumentTailoring kind={'exclusive'} offer={offer}/>
                </>
            );
        case 'Submitted Fighters':
            return (
                <SubmittedFighterPrivateOfferSection
                    submittedFighters={submittedFighters}
                    submittedInformation={submittedInformation}
                    offer={offer}
                    onRefresh={() => {
                        router.reload();
                    }}
                />
            );
        default:
            return null;
    }

};
