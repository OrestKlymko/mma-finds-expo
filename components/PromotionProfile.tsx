import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PromotionShortInfo, UserInfoResponse} from "@/service/response";
import {getShortInfoPromotion} from "@/service/service";
import {ProfileHeader} from "@/components/profile/ProfileHeader";
import {SectionItem} from "@/components/profile/SectionItem";
import {ShareFeedbackSection} from "@/components/profile/ShareFeedbackSection";
import {useFocusEffect} from "expo-router";
import ContentLoader from "@/components/ContentLoader";
import {useAuth} from "@/context/AuthContext";

export const PromotionProfile = () => {
    const [userInfo, setUserInfo] = useState<PromotionShortInfo | null>(null);
    const insets = useSafeAreaInsets();
    const {entityId} = useAuth();
    const [contentLoading, setContentLoading] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            if (!entityId) {
                return;
            }
            setContentLoading(true);
            getShortInfoPromotion(entityId)
                .then(res => {
                    setUserInfo(res);
                })
                .finally(() => {
                    setContentLoading(false);
                });
        }, [entityId]),
    );

    if (contentLoading) {
        return <ContentLoader/>;
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
                    {
                        label: 'Balance Overview',
                        icon: 'currency-usd',
                        pathToScreen: '/profile/balance',
                    },
                    {label: 'My Events', icon: 'calendar-outline', pathToScreen: '/event'},
                    {
                        label: 'Required documents',
                        icon: 'file-document-multiple-outline',
                        pathToScreen: '/profile/offer-documents',
                    },
                    {
                        label: 'Sub-Accounts',
                        icon: 'account-multiple-outline',
                        pathToScreen: '/profile/sub-accounts',
                    },
                    {
                        label: 'Task Center',
                        icon: 'clipboard-text-outline',
                        pathToScreen: 'TaskCenter',
                    },
                    {
                        label: 'Invite & Earn',
                        icon: 'account-plus',
                        pathToScreen: '/profile/invite-friends',
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
                    {label: 'Account', icon: 'account-circle', pathToScreen: '/profile/settings/account'},
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
