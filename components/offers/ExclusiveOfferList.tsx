import React, {useCallback, useMemo} from 'react';
import {FlatList, View} from 'react-native';
import {ExclusiveCardOffer} from './ExclusiveCardOffer';
import {ExclusiveOfferInfo, MultiContractShortInfo} from '@/service/response';
export type MultiContractOffer = {
    eventId: string;
    eventName: string;
    fighterName: string;
    fighterNickName: string;
    contractStartDate: string;
    contractEndDate: string;
    numberOfFights: number;
    closedReason?: string;
    verifiedState?: string;
    typeOffer?: 'MULTI';
};
export type OfferType = ExclusiveOfferInfo | MultiContractShortInfo;

interface OfferListProps {
    offers?: ExclusiveOfferInfo[];
    horizontal?: boolean;
    multiContractOffers?: MultiContractShortInfo[];
    footerButton?: React.ReactNode;
}


export const ExclusiveOfferList: React.FC<OfferListProps> =
    ({offers = [], horizontal, multiContractOffers = [], footerButton}) => {
        const combinedOffers: OfferType[] = useMemo(() => {
            const exclusiveWithType = offers.map(o => ({
                ...o,
                typeOffer: 'PRIVATE' as const,
            }));
            const multiWithType = multiContractOffers.map(o => ({
                ...o,
                typeOffer: 'MULTI' as const,
            }));
            return [...exclusiveWithType, ...multiWithType];
        }, [offers, multiContractOffers]);

        const renderItem = useCallback(({item}: {item: any}) => {
            return <ExclusiveCardOffer item={item}/>;
        }, []);

        return (
            <FlatList
                data={combinedOffers}
                horizontal={horizontal}
                keyExtractor={(item, index) => `${index}`}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={!horizontal ? {paddingBottom: 150} : {}}
                ItemSeparatorComponent={!horizontal ? () => <View style={{ height: 15 }} /> : () => <></>}
                ListFooterComponent={
                    footerButton ? (
                        <View style={{marginTop: 15}}>{footerButton}</View>
                    ) : null
                }
            />
        );
    }
