import {ScrollView, StyleSheet} from 'react-native'
import React, {useState} from 'react'
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ManagerShortInfo} from '@/service/response';
import {useFocusEffect} from "expo-router";
import {getShortInfoManager} from "@/service/service";
import ContentLoader from "@/components/ContentLoader";
import {ProfileHeader} from '@/components/profile/ProfileHeader';
import {SectionItem} from "@/components/profile/SectionItem";
import {ShareFeedbackSection} from "@/components/profile/ShareFeedbackSection";
import {useAuth} from "@/context/AuthContext";

const ManagerProfile = () => {
    const [userInfo, setUserInfo] = useState<ManagerShortInfo | null>(null);
    const insets = useSafeAreaInsets();
    const {entityId} = useAuth();
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setContentLoading(true);
            if (!entityId) {
                return;
            }
            getShortInfoManager(entityId).then(res => {
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
            style={[
                styles.container,
                {paddingBottom: insets.bottom},
            ]}>
            <ProfileHeader userInfo={userInfo}/>
            <SectionItem
                title="MMA Finds Center"
                items={[
                    {
                        label: 'Balance Overview',
                        icon: 'currency-usd',
                        pathToScreen: '/profile/balance',
                    },
                    {label: 'My Fighters', icon: 'account-group', pathToScreen: '/profile/my-fighters'},
                    {label: 'All Promotions', icon: 'office-building', pathToScreen: '/promotion'},
                    {
                        label: 'Invite & Earn',
                        icon: 'account-plus',
                        pathToScreen: '/profile/invite-friends',
                    },
                    {
                        label: 'Featured Fighters',
                        icon: 'star-outline',
                        pathToScreen: '/profile/featured-fighters',
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
}
export default ManagerProfile
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        marginBottom: 70,
    },
})
