import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UserInfoResponse} from "@/service/response";
import {getShortInfoPromotion} from "@/service/service";
import {ProfileHeader} from "@/components/profile/ProfileHeader";
import {SectionItem} from "@/components/profile/SectionItem";
import {ShareFeedbackSection} from "@/components/profile/ShareFeedbackSection";
import {useFocusEffect} from "expo-router";
import ContentLoader from "@/components/ContentLoader";

export const PromotionEmployeeProfile = () => {
    const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
    const insets = useSafeAreaInsets();
    const [contentLoading, setContentLoading] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            setContentLoading(true);
            getShortInfoPromotion()
                .then(res => {
                    setUserInfo(res);
                })
                .finally(() => {
                    setContentLoading(false);
                });
        }, []),
    );

    if (contentLoading) {
        return <ContentLoader />;
    }
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={[styles.container, {paddingBottom: insets.bottom}]}>
            <ProfileHeader userInfo={userInfo}/>
            <SectionItem
                title="MMA Finds Center"
                items={[
                    {label: 'My Events', icon: 'calendar-outline', pathToScreen: '/event'},
                    {
                        label: 'Required Documents',
                        icon: 'file-document-multiple-outline',
                        pathToScreen: '/profile/offer-documents',
                    },
                    {
                        label: 'Task Center',
                        icon: 'clipboard-text-outline',
                        pathToScreen: 'TaskCenter',
                    },
                    {
                        label: 'Featured Offers',
                        icon: 'star-outline',
                        pathToScreen: '/profile/featured-offers',
                    },
                ]}
            />

            <SectionItem
                title="Settings"
                items={[
                    {label: 'Account', icon: 'account-circle', pathToScreen: '/profile/settings/account/account-info'},
                    {label: 'Preferences', icon: 'cog-outline', pathToScreen: '/profile/settings/preferences'},
                ]}
            />

            <SectionItem
                title="Resources"
                items={[
                    {label: 'Legal', icon: 'scale-balance', pathToScreen: '/profile/settings/resource/legal'},
                    {label: 'Support', icon: 'lifebuoy', pathToScreen: '/profile/settings/resource/support'},
                ]}
            />

            <ShareFeedbackSection/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F8F8',
        marginBottom: 70,
    },
});
