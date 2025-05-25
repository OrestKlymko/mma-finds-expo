import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {getAllPublicOffers, getExclusiveOffers, getMultiFightOffers,} from '@/service/service';
import {useFilter} from '@/context/FilterContext';
import ContentLoader from '@/components/ContentLoader';
import {ExclusiveOfferInfo, MultiContractShortInfo, PublicOfferInfo} from '@/service/response';
import {OfferTab} from "@/components/offers/OfferTab";
import {OfferContent} from "@/components/offers/OfferContent";
import {useAuth} from "@/context/AuthContext";

const PromotionMyOfferList = () => {
    const insets = useSafeAreaInsets();
    const {setSelectedFilters} = useFilter();
    const {entityId} = useAuth();
    const [selectedTab, setSelectedTab] = useState<'Public' | 'Exclusive'>(
        'Public',
    );
    const [publicOffers, setPublicOffers] = useState<PublicOfferInfo[]>([]);
    const [exclusiveOffers, setExclusiveOffers] = useState<ExclusiveOfferInfo[]>([]);
    const [multiContractOffers, setMultiContractOffers] = useState<any[]>([]);
    const [filteredMultiContractOffers, setFilteredMultiContractOffers] =
        useState<MultiContractShortInfo[]>([]);
    const [filteredOffers, setFilteredOffers] = useState<any[]>([]);
    const [filteredExclusiveOffers, setFilteredExclusiveOffers] = useState<any[]>(
        [],
    );
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const loadData = async () => {
                setContentLoading(true);
                try {
                    const [publicOffers, exclusiveOffers, multiOffers] =
                        await Promise.all([
                            getAllPublicOffers(entityId, null),
                            getExclusiveOffers(),
                            getMultiFightOffers(),
                        ]);

                    if (isActive) {
                        setPublicOffers(publicOffers);
                        setFilteredOffers(publicOffers);

                        setExclusiveOffers(exclusiveOffers);
                        setFilteredExclusiveOffers(exclusiveOffers);

                        setMultiContractOffers(multiOffers);
                        setFilteredMultiContractOffers(multiOffers);
                    }
                } catch (error) {
                    Alert.alert(
                        'Error',
                        'Failed to load offers. Please try again later.',
                    );
                } finally {
                    if (isActive) setContentLoading(false);
                }
            };

            loadData();

            return () => {
                isActive = false;
            };
        }, []),
    );

    if (contentLoading) {
        return <ContentLoader />;
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton/>
            <View style={[styles.container, {marginBottom: insets.bottom + 200}]}>
                <Text style={styles.title}>My Offers</Text>
                <Text style={styles.subtitle}>
                    View all of your fight offers in one place.
                </Text>
                <OfferTab
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    setSelectedFilters={setSelectedFilters}
                />

                <OfferContent
                    selectedTab={selectedTab}
                    publicOffers={publicOffers}
                    filteredOffers={filteredOffers}
                    setFilteredOffers={setFilteredOffers}
                    exclusiveOffers={exclusiveOffers}
                    filteredExclusiveOffers={filteredExclusiveOffers}
                    setFilteredExclusiveOffers={setFilteredExclusiveOffers}
                    multiContractOffers={multiContractOffers}
                    filteredMultiContractOffers={filteredMultiContractOffers}
                    setFilteredMultiContractOffers={setFilteredMultiContractOffers}
                />
            </View>
        </View>
    );
};

export default PromotionMyOfferList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 10,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        color: colors.primaryBlack,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '400',
    },
});
