import React from 'react';
import {View} from 'react-native';
import {SearchAndFilterPublicOfferBar} from './SearchAndFilterPublicOfferBar';
import {CreateOfferButton} from './CreateOfferButton';
import {OfferList} from "./OfferList";
import {ExclusiveOfferInfo, PublicOfferInfo} from '@/service/response';
import {ExclusiveOfferList} from "@/components/offers/ExclusiveOfferList";
import {SearchAndFilterExclusiveOfferBar} from "@/components/offers/SearchAndFilterExclusiveOfferBar";
import { useRouter } from 'expo-router';

interface Props {
    selectedTab: 'Public' | 'Private';
    publicOffers: PublicOfferInfo[];
    filteredOffers: PublicOfferInfo[];
    setFilteredOffers: (offers: PublicOfferInfo[]) => void;
    exclusiveOffers: ExclusiveOfferInfo[];
    filteredExclusiveOffers: ExclusiveOfferInfo[];
    setFilteredExclusiveOffers: (offers: ExclusiveOfferInfo[]) => void;
    multiContractOffers: any[];
    filteredMultiContractOffers: any[];
    setFilteredMultiContractOffers: (offers: any[]) => void;
}

export const OfferContent: React.FC<Props> = ({
                                                  selectedTab,
                                                  publicOffers,
                                                  filteredOffers,
                                                  setFilteredOffers,
                                                  exclusiveOffers,
                                                  filteredExclusiveOffers,
                                                  setFilteredExclusiveOffers,
                                                  multiContractOffers,
                                                  filteredMultiContractOffers,
                                                  setFilteredMultiContractOffers,
                                              }) => {
    const router = useRouter();
    if (selectedTab === 'Public') {
        return (
            <View>
                <SearchAndFilterPublicOfferBar
                    offers={publicOffers}
                    getFilteredOffers={setFilteredOffers}
                />
                {publicOffers.length > 0 ? (
                    <OfferList
                        offers={filteredOffers}
                        onClick={(offerId) => {
                            router.push(`/offers/public/${offerId}`)
                        }}
                        footerButton={<CreateOfferButton selectedTab={selectedTab} />}
                    />
                ) : (
                    <CreateOfferButton selectedTab={selectedTab} />
                )}
            </View>
        );
    }

    if (selectedTab === 'Private') {
        return (
            <View>
                <SearchAndFilterExclusiveOfferBar
                    offers={exclusiveOffers}
                    getFilteredOffers={setFilteredExclusiveOffers}
                    multiContractOffers={multiContractOffers}
                    getFilteredMultiContractOffers={setFilteredMultiContractOffers}
                />
                {exclusiveOffers.length > 0 || multiContractOffers.length > 0 ? (
                    <ExclusiveOfferList
                        offers={filteredExclusiveOffers}
                        multiContractOffers={filteredMultiContractOffers}
                        footerButton={<CreateOfferButton selectedTab={selectedTab} />}
                    />
                ) : (
                    <CreateOfferButton selectedTab={selectedTab} />
                )}
            </View>
        );
    }

    return null;
};

