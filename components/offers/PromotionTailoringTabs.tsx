import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {SubmittedInformationOffer} from "@/service/response";

type PromotionTailoringTabsProps = {
    submittedInformation?: SubmittedInformationOffer;
    selectedTab: 'Preselected Fighter' | 'Submitted Fighters' | 'Selected Fighter';
    setSelectedTab: (tab: 'Preselected Fighter' | 'Submitted Fighters' | 'Selected Fighter') => void;
};

export const PromotionTailoringTabs = ({
                                           submittedInformation,
                                           selectedTab,
                                           setSelectedTab,
                                       }: PromotionTailoringTabsProps) => {

    return (
        <View style={styles.tabContainer}>
            {submittedInformation?.statusResponded === 'ACCEPTED' ? (
                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedTab === 'Selected Fighter' && styles.tabActive,
                    ]}
                    onPress={() => {
                        setSelectedTab('Selected Fighter');
                    }}>
                    <Text
                        style={[
                            styles.tabText,
                            selectedTab === 'Selected Fighter' && styles.tabTextActive,
                        ]}>
                        Selected Fighter
                    </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[
                        styles.tab,
                        selectedTab === 'Preselected Fighter' &&
                        styles.tabActivePreselected,
                    ]}
                    onPress={() => {
                        setSelectedTab('Preselected Fighter');
                    }}>
                    <Text style={styles.tabText}>Preselected Fighter</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={[
                    styles.tab,
                    selectedTab === 'Submitted Fighters' && styles.tabActive,
                ]}
                onPress={() => {
                    setSelectedTab('Submitted Fighters');
                }}>
                <Text
                    style={[
                        styles.tabText,
                        selectedTab === 'Submitted Fighters' && styles.tabTextActive,
                    ]}>
                    Submitted Fighters
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 17,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        marginHorizontal: 4,
    },
    tabActive: {
        backgroundColor: colors.primaryGreen,
    },
    tabActivePreselected: {
        backgroundColor: colors.yellow,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    tabTextActive: {
        color: colors.white,
    },
});
