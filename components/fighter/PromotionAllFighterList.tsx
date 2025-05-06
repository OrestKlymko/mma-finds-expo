import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {SearchForFighterFlow} from "@/components/fighter/SearchForFighterFlow";
import {SearchForManagerFlow} from "@/components/fighter/SearchForManagerFlow";

const PromotionAllFighterMainList = () => {
    const TABS = ['Fighters', 'Managers'];

    const [activeTab, setActiveTab] = useState('Fighters');
    const insets = useSafeAreaInsets();

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
    };

    const renderTitle = useMemo(() => {
        switch (activeTab) {
            case 'Fighters':
                return (
                    <View>
                        <Text style={styles.title}>Search Fighters</Text>
                        <Text style={styles.subtitle}>
                            Find fighters and explore their profiles to discover potential
                            matchups.
                        </Text>
                    </View>
                );
            default:
                return (
                    <View>
                        <Text style={styles.title}>Search Managers</Text>
                        <Text style={styles.subtitle}>
                            Find managers and explore the fighters they represent.
                        </Text>
                    </View>
                );
        }
    }, [activeTab]);

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                {renderTitle}
                <View style={styles.tabContainer}>
                    {TABS.map((tab, index) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tabButton,
                                index === 0
                                    ? {borderTopLeftRadius: 8, borderBottomLeftRadius: 8}
                                    : {borderTopRightRadius: 8, borderBottomRightRadius: 8},
                                activeTab === tab && styles.activeTabButton,
                            ]}
                            onPress={() => handleTabPress(tab)}>
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.activeTabText,
                                ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {activeTab === 'Fighters' ? (
                    <SearchForFighterFlow />
                ) : (
                    <SearchForManagerFlow />
                )}
            </View>
        </View>
    );
};

export default PromotionAllFighterMainList;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        flex: 1,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        height: 56,
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
        alignItems: 'center',
    },
    activeTabButton: {
        backgroundColor: colors.primaryGreen,
    },
    tabText: {
        color: colors.primaryBlack,
        fontSize: 16,
    },
    activeTabText: {
        color: colors.white,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '400',
    },
});
