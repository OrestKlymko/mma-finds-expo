import {StyleSheet, Text, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import colors from '@/styles/colors';
import { SubmissionList } from '@/components/submissions/SubmissionList';
import { SearchSubmission } from '@/components/submissions/SearchSubmissions';
import GoBackButton from '@/components/GoBackButton';
import ContentLoader from '@/components/ContentLoader';
import { SubmissionTabType } from '@/types/submission';
import {FighterInfoResponse} from "@/service/response";
import {useLocalSearchParams} from "expo-router";
import {OfferSubmissionResponse} from "@/service/request";
import { getFullInfoAboutFighter, getSubmissionsOfferByFighter } from '@/service/service';
import {SubmissionTab} from "@/components/submissions/SubmissionTab";

const Index = () => {
    const [activeTab, setActiveTab] = useState<SubmissionTabType>('Active');

    const [fighter, setFighter] = useState<FighterInfoResponse | null>(null);
    const { fighterId } = useLocalSearchParams<{fighterId: string}>()
    const [submissions, setSubmissions] = useState<OfferSubmissionResponse[]>([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState<OfferSubmissionResponse[]>(
        [],
    );
    const [contentLoading, setContentLoading] = useState(false);

    useEffect(() => {
        let isActive = true;

        const loadFighterInfo = async () => {
            if (!fighterId) return;

            setContentLoading(true);

            try {
                const [fighterData, submissionsFromBe] = await Promise.all([
                    getFullInfoAboutFighter(fighterId),
                    getSubmissionsOfferByFighter(fighterId),
                ]);

                if (isActive) {
                    setFighter(fighterData);
                    setSubmissions(submissionsFromBe);
                }
            } catch (error) {
                console.error('Error loading fighter info:', error);
            } finally {
                if (isActive) {
                    setContentLoading(false);
                }
            }
        };

        loadFighterInfo();

        return () => {
            isActive = false;
        };
    }, [fighterId]);

    if (contentLoading) {
        return <ContentLoader />;
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <View style={styles.container}>
                <Text style={styles.title}>Submissions of</Text>
                <Text style={styles.subtitle}>{fighter?.name}</Text>

                <SubmissionTab activeTab={activeTab} setActiveTab={setActiveTab} />
                <SearchSubmission
                    submissions={submissions}
                    activeTab={activeTab}
                    setFilteredSubmissions={setFilteredSubmissions}
                />
                <SubmissionList
                    fighterId={fighterId}
                    filteredSubmission={filteredSubmissions}
                />
            </View>
        </View>
    );
}
export default Index
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        lineHeight: 30,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryGreen,
        textAlign: 'center',
        marginBottom: 30,
    },
});

