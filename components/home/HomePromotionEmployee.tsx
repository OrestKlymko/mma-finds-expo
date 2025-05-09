import React, {useCallback, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {getEvents, getFeatures, getPublicOffers,} from '@/service/service';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentLoader from '@/components/ContentLoader';
import {FeatureResponse, PublicOfferInfo} from '@/service/response';
import {useFocusEffect, useRouter} from "expo-router";
import {NotificationBell} from "@/components/home/NotificationBell";
import {SearchFighterSection} from "@/components/home/SearchFighterSection";
import {EventSection} from "@/components/home/EventSection";
import {HomeBanner} from "@/components/home/HomeBanner";
import {MyOfferSection} from "@/components/home/MyOfferSection";
import {MessageSection} from "@/components/home/MessageSection";
import {NewFeatureSection} from "@/components/home/NewFeatureSection";

const HomePromotionEmployeeScreen = () => {
    const [publicOffers, setPublicOffers] = useState<PublicOfferInfo[]>([]);
    const router =useRouter();
    const insets = useSafeAreaInsets();
    const [newFeatures, setNewFeatures] = useState<FeatureResponse[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [newNotification, setNewNotification] = useState(0);
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const loadData = async () => {
                setContentLoading(true);
                try {
                    const [storedValue, features, offers, events] = await Promise.all([
                        AsyncStorage.getItem('newNotification'),
                        getFeatures(),
                        getPublicOffers(),
                        getEvents(),
                    ]);

                    if (isActive) {
                        if (storedValue) setNewNotification(parseInt(storedValue));
                        setNewFeatures(features);
                        setPublicOffers(offers);
                        setEvents(events);
                    }
                } catch (error) {
                    console.error('Error loading data:', error);
                    Alert.alert('Error', 'Failed to load data', [{text: 'OK'}]);
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
                    marginBottom: 65,
                },
            ]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}>
                <View style={[styles.section, {paddingRight: 20, marginTop: 20}]}>
                    <NotificationBell newNotification={newNotification} />
                    <SearchFighterSection />
                </View>
                <EventSection events={events} />

                <MyOfferSection offers={publicOffers} />
                <HomeBanner
                    title="Feature Your Offer"
                    image={require('@/assets/Featuredoffers.png')}
                    mainText="Get More Visibility"
                    description="Use the feature option to enhance the visibility of your fight offers!"
                    buttonText="Feature Your Offer"
                    onPress={() => {
                        //TODO: PUSH CORRECT
                        router.push('/profile/offer-documents');
                    }}
                />

                <MessageSection />
                <NewFeatureSection newFeatures={newFeatures} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomePromotionEmployeeScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        paddingLeft: 20,
    },
    section: {
        marginBottom: 10,
    },
});
