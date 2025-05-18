import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {SubmissionTabType} from "@/types/submission";
import {OfferSubmissionResponse} from "@/service/request";
import {getSubmissionManager} from "@/service/service";
import ContentLoader from "@/components/ContentLoader";
import colors from '@/styles/colors';
import GoBackButton from "@/components/GoBackButton";
import {SubmissionTab} from "@/components/submissions/SubmissionTab";
import { SearchSubmission } from '@/components/submissions/SearchSubmissions';
import {SubmissionList} from "@/components/submissions/SubmissionList";

const MyOffersScreen = () => {
    const [activeTab, setActiveTab] = useState<SubmissionTabType>('Active');
    const [submissions, setSubmissions] = useState<OfferSubmissionResponse[]>([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState<OfferSubmissionResponse[]>(
        [],
    );
    const insets = useSafeAreaInsets();
    const [contentLoading, setContentLoading] = useState(false);
    useFocusEffect(
        useCallback(() => {
            setContentLoading(true);
            getSubmissionManager()
                .then(res => {
                    setSubmissions(res);
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
        <SafeAreaView
            style={[
                styles.safeArea,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    marginBottom: 65,
                },
            ]}>
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                <Text style={styles.title}>Manage Submissions</Text>
                <Text style={styles.subtitle}>
                    Track all your active and inactive fighter{'\n'}
                    submissions to specific offers.
                </Text>
                <SubmissionTab activeTab={activeTab} setActiveTab={setActiveTab} />
                <SearchSubmission
                    submissions={submissions}
                    activeTab={activeTab}
                    setFilteredSubmissions={setFilteredSubmissions}
                />
                <SubmissionList filteredSubmission={filteredSubmissions} />
            </View>
        </View>
        </SafeAreaView>
    );
};

export default MyOffersScreen;

const styles = StyleSheet.create({
    safeArea: {flex:1},
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
        fontSize: 16,
        color: colors.primaryBlack,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '400',
    },
});
