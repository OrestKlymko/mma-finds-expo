import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import React from 'react';
import {OfferSubmissionResponse} from "@/service/request";
import {useRouter} from "expo-router";
import colors from "@/styles/colors";
import {SubmissionList} from "@/components/submissions/SubmissionList";


type MySubmissionSectionProps = {
    submissions: OfferSubmissionResponse[];
};

export const MySubmissionSection = ({
                                        submissions,
                                    }: MySubmissionSectionProps) => {
    const router = useRouter();
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Submissions</Text>

                <TouchableOpacity
                    onPress={() => {
                        router.push("/(app)/(tabs)/feed")
                    }}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            <SubmissionList horizontal filteredSubmission={submissions}/>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    seeAll: {
        fontSize: 17,
        fontWeight: '500',
        color: colors.primaryGreen,
        paddingRight: 20,
    },
});
