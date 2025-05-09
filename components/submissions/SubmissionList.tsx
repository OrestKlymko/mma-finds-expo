import {
    FlatList,
    Text
} from 'react-native';
import React from 'react';
import {OfferSubmissionResponse} from "@/service/request";
import {SubmissionCard} from "@/components/submissions/SubmissionCard";


// import {SubmissionCard} from "./SubmissionCard.tsx";



interface SubmissionListProps {
    fighterId?: any;
    filteredSubmission?: OfferSubmissionResponse[];
    horizontal?: boolean;
}

export function SubmissionList({
                                   fighterId,
                                   filteredSubmission,
                                   horizontal,
                               }: SubmissionListProps) {


    return (
        <FlatList
            data={filteredSubmission}
            horizontal={horizontal}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item,index}) => {
                return <SubmissionCard item={item} horizontal={horizontal} fighterId={fighterId} />;
            }}
        />
    );
}
