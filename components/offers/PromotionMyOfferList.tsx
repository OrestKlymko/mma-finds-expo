import React, {useCallback, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {getExclusiveOffers, getMultiFightOffers, getPublicOffers,} from '@/service/service';
import {useFilter} from '@/context/FilterContext';
import ContentLoader from '@/components/ContentLoader';
import {ExclusiveOfferInfo, MultiContractShortInfo, PublicOfferInfo} from '@/service/response';
import {OfferTab} from "@/components/offers/OfferTab";
import {OfferContent} from "@/components/offers/OfferContent";

const PromotionMyOfferList = () => {
    const insets = useSafeAreaInsets();
    const {setSelectedFilters} = useFilter();
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
                            getPublicOffers(),
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
        <SafeAreaView
            style={[
                styles.safeArea,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                },
            ]}>
        <ScrollView style={{flex: 1, backgroundColor: colors.white, marginBottom: insets.bottom}}>
            <GoBackButton/>
            <View style={[styles.container]}>
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
        </ScrollView>
        </SafeAreaView>
    );
};

export default PromotionMyOfferList;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
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
