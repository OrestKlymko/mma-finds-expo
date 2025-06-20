import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useAuth} from "@/context/AuthContext";
import React, {useCallback, useState} from "react";
import {PublicOfferInfo} from "@/service/response";
import {useFocusEffect} from "@react-navigation/native";
import {getAllPublicOffers} from "@/service/service";
import {Alert, StyleSheet, Text, View} from "react-native";
import ContentLoader from "@/components/ContentLoader";
import colors from "@/styles/colors";
import GoBackButton from "@/components/GoBackButton";
import {SearchAndFilterPublicOfferBar} from "@/components/offers/SearchAndFilterPublicOfferBar";
import {OfferList} from "@/components/offers/OfferList";
import {CreateOfferButton} from "@/components/offers/CreateOfferButton";
import {useRouter} from "expo-router";


const PromotionMyOfferListForFeature = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const {entityId} = useAuth();
    const [publicOffers, setPublicOffers] = useState<PublicOfferInfo[]>([]);
    const [filteredOffers, setFilteredOffers] = useState<any[]>([]);
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const loadData = async () => {
                setContentLoading(true);
                try {
                    const [publicOffers] =
                        await Promise.all([
                            getAllPublicOffers(entityId, null),
                        ]);

                    if (isActive) {
                        setPublicOffers(publicOffers);
                        setFilteredOffers(publicOffers);
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
        return <ContentLoader/>;
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton/>
            <View style={[styles.container, {marginBottom: insets.bottom + 200}]}>
                <Text style={styles.title}>My Offers</Text>
                <Text style={styles.subtitle}>
                    Choose an offer to feature.
                </Text>
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
                            footerButton={<CreateOfferButton selectedTab={'Public'}/>}
                        />
                    ) : (
                        <CreateOfferButton selectedTab={'Public'}/>
                    )}
                </View>
            </View>
        </View>
    );
};

export default PromotionMyOfferListForFeature;

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