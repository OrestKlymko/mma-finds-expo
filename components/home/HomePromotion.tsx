import React, {useCallback, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {
    getAllPublicOffers,
    getEvents,
    getFeatures,
} from '@/service/service';
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
import {useAuth} from "@/context/AuthContext";

const HomeScreen = () => {
    const [publicOffers, setPublicOffers] = useState<PublicOfferInfo[]>([]);
    const {entityId}=useAuth();
    const router =useRouter();
    const insets = useSafeAreaInsets();
    const [newFeatures, setNewFeatures] = useState<FeatureResponse[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [newNotification, setNewNotification] = useState(0);
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            if(!entityId) {
                return;
            }
            const loadData = async () => {
                setContentLoading(true);
                try {
                    const [storedValue, features, offers, events] = await Promise.all([
                        AsyncStorage.getItem('newNotification'),
                        getFeatures(),
                        getAllPublicOffers(entityId,null),
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
        }, [entityId]),
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
                <HomeBanner
                    title="Invite & Earn"
                    image={require('@/assets/InviteFriends.png')}
                    mainText="Share & get up to €100 off"
                    description="Bring in new members and earn rewards!"
                    buttonText="Invite & Earn"
                    onPress={() => {
                        router.push('/profile/invite-friends');
                    }}
                />

                <MyOfferSection offers={publicOffers} />
                <HomeBanner
                    title="Feature Your Offer"
                    image={require('@/assets/Featuredoffers.png')}
                    mainText="Get More Visibility"
                    description="Use the feature option to enhance the visibility of your fight offers!"
                    buttonText="Feature Your Offer"
                    onPress={() => {
                        router.push('/profile/featured-offers');
                    }}
                />

                <MessageSection />
                <NewFeatureSection newFeatures={newFeatures} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        paddingLeft: 20,
        display: "flex",
        flexDirection: "column",
        rowGap: 10
    },
    section: {
        marginBottom: 10,
    },
});
