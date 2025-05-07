import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SubmissionTabType} from "@/types/submission";
import colors from "@/styles/colors";


type SubmissionTabProps = {
    activeTab: SubmissionTabType;
    setActiveTab: (tab: SubmissionTabType) => void;
};

export const SubmissionTab = ({
                                  activeTab,
                                  setActiveTab,
                              }: SubmissionTabProps) => {
    return (
        <View style={styles.tabsContainer}>
            {(['Active', 'Inactive'] as SubmissionTabType[]).map(tab => (
                <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => setActiveTab(tab)}>
                    <Text
                        style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        marginHorizontal: 4,
        height: 56,
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: colors.primaryGreen,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    activeTabText: {
        color: colors.white,
        fontWeight: '600',
    },
});