import React, {useCallback, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from "expo-router";
import {CardInfoFighterResponse, FeatureResponse, PublicOfferInfo} from '@/service/response';
import {OfferSubmissionResponse } from '@/service/request';
import {getFeatures, getFighterByManagerId, getSubmissionManager} from '@/service/service';
import ContentLoader from "@/components/ContentLoader";
import { ManagerHomeHeaderSection } from './ManagerHomeHeaderSection';
import {ManagerMyFighterSection} from "@/components/home/ManagerMyFighterSection";
import {HomeBanner} from "@/components/home/HomeBanner";
import {MessageSection} from "@/components/home/MessageSection";
import {NewFeatureSection} from "@/components/home/NewFeatureSection";
import {MySubmissionSection} from "@/components/home/MySubmissionSection";
import {RecentlySavedSection} from "@/components/home/RecentlySavedSection";
import {useAuth} from "@/context/AuthContext";

const HomeManagerScreen = () => {
    const router = useRouter();
    const {entityId} =useAuth();
    const [fighters, setFighters] = useState<CardInfoFighterResponse[]>([]);
    const [favoriteOffers, setFavoriteOffers] = useState<PublicOfferInfo[]>([]);
    const insets = useSafeAreaInsets();
    const [submissions, setSubmissions] = useState<OfferSubmissionResponse[]>([]);
    const [newFeatures, setNewFeatures] = useState<FeatureResponse[]>([]);
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if(!entityId) {
                return;
            }
            let isActive = true;
            setContentLoading(true);

            Promise.all([
                getFeatures(),
                getFighterByManagerId(entityId),
                AsyncStorage.getItem('favoriteOffers'),
                getSubmissionManager(),
            ])
                .then(([features, fightersList, favs, subs]) => {
                    if (!isActive) return;
                    console.log(fightersList);
                    setNewFeatures(features);
                    setFighters(fightersList);
                    if (favs) {
                        try {
                            setFavoriteOffers(JSON.parse(favs));
                        } catch {
                            console.warn('Invalid JSON in favoriteOffers');
                        }
                    }
                    setSubmissions(subs);
                })
                .catch(err => {
                    console.error('Error loading data:', err);
                })
                .finally(() => {
                    if (isActive) setContentLoading(false);
                });

            return () => {
                isActive = false;
            };
        }, [entityId]),
    );

    const refreshFavorites = async () => {
        const storedFavorites = await AsyncStorage.getItem('favoriteOffers');
        if (storedFavorites) {
            setFavoriteOffers(JSON.parse(storedFavorites));
        }
    };

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
                <ManagerHomeHeaderSection />
                <ManagerMyFighterSection fighters={fighters} />

                <HomeBanner
                    title="Invite & Earn"
                    image={require('@/assets/InviteFriends.png')}
                    mainText="Share & get up to €100 off"
                    description="Bring in new members and earn rewards!"
                    buttonText="Invite & Earn"
                    onPress={() => router.push('/(app)/profile/invite-friends')}
                />
                <MySubmissionSection submissions={submissions} />
                <HomeBanner
                    title="Feature Your Fighter"
                    image={require('@/assets/Featuredoffers.png')}
                    mainText="Get More Visibility"
                    description="Use the feature option to enhance your fighter’s visibility!"
                    buttonText="Feature Your Fighter"
                    onPress={() => router.push("/profile/featured-fighters")}
                />
                <RecentlySavedSection
                    favoriteOffers={favoriteOffers}
                    refreshFavorites={refreshFavorites}
                />
                <MessageSection />
                <NewFeatureSection newFeatures={newFeatures} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeManagerScreen;

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
});
