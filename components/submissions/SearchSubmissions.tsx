import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import {OfferSubmissionResponse} from "@/service/request";
import { SubmissionTabType } from '@/types/submission';
import colors from "@/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

type SearchSubmissionProps = {
    submissions: OfferSubmissionResponse[];
    activeTab: SubmissionTabType;
    setFilteredSubmissions: (subs: OfferSubmissionResponse[]) => void;
};

export const SearchSubmission = ({
                                     submissions,
                                     activeTab,
                                     setFilteredSubmissions,
                                 }: SearchSubmissionProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const normalizedQuery = searchQuery.toLowerCase().trim();
        const filtered = submissions.filter(sub => {
            const matchesQuery = sub.eventName
                ? sub.eventName.toLowerCase().includes(normalizedQuery)
                : true;
            if (activeTab === 'Active') {
                return matchesQuery && sub.fighterStateApprove === 'ACTIVE';
            } else {
                return matchesQuery && sub.fighterStateApprove !== 'ACTIVE';
            }
        });
        setFilteredSubmissions(filtered);
    }, [submissions, activeTab, searchQuery, setFilteredSubmissions]);

    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search for an offer..."
                placeholderTextColor={colors.gray}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Ionicons name="search" size={24} color={colors.primaryBlack} />
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 20,
        height: 56,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        color: colors.secondaryBlack,
    },
});