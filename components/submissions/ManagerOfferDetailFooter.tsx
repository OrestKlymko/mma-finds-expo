import {StyleSheet, Text} from 'react-native';
import React, {useEffect} from 'react';
import colors from "@/styles/colors";
import {PublicOfferInfo, ShortInfoFighter, SubmittedInformationOffer} from "@/service/response";
import {ManagerTailoringContent} from "@/components/submissions/ManagerTailoringContent";
import {ManagerSubmittedFighterList} from "@/components/submissions/ManagerSubmittedFighterList";

interface OfferDetailFooterProps {
    fighters: ShortInfoFighter[];
    offer: PublicOfferInfo | null | undefined;
    chosenFighter: ShortInfoFighter | undefined;
    submittedInformation?: SubmittedInformationOffer;
    previousInfo?: SubmittedInformationOffer | null;
    onRefreshFighterList: () => void;
}

export const ManagerOfferDetailFooter = ({
                                             fighters,
                                             offer,
                                             submittedInformation,
                                             previousInfo,
                                             chosenFighter,
                                             onRefreshFighterList,
                                         }: OfferDetailFooterProps) => {
    const [selectedTab, setSelectedTab] = React.useState<
        'Preselected Fighter' | 'Submitted Fighters' | 'Selected Fighter'
    >('Preselected Fighter');
    useEffect(() => {
        if (submittedInformation?.statusResponded === 'ACCEPTED') {
            setSelectedTab('Selected Fighter');
        }
    }, [submittedInformation]);
    return submittedInformation ? (
        <ManagerTailoringContent
            fighters={fighters}
            offer={offer}
            chosenFighter={chosenFighter}
            onRefreshFighterList={onRefreshFighterList}
            selectedTab={selectedTab}
            previousInfo={previousInfo}
            submittedInformation={submittedInformation}
        />
    ) : (
        <>
            <ManagerSubmittedFighterList
                fighters={fighters}
                offer={offer}
                onRefreshFighterList={onRefreshFighterList}
            />
        </>
    );
};

const styles = StyleSheet.create({
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 24,
        marginTop: 10,
        color: colors.primaryGreen,
        position: 'relative',
    },
});
