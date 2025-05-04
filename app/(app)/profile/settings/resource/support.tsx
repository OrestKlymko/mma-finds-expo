import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getTickets} from "@/service/service";
import {TicketResponse} from "@/service/response";
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";
import {useRouter} from "expo-router";


const SupportScreen = () => {
    const [activeTab, setActiveTab] = useState<string>('All');
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [faqItems, setFaqItems] = useState<TicketResponse[]>([]);
    const [subjects, setSubjects] = useState<string[]>(['All']);
    const [filteredItems, setFilteredItems] = useState<TicketResponse[]>([]);

    const toggleItem = (id: string) => {
        setExpandedItemId(prev => (prev === id ? null : id));
    };

    useEffect(() => {
        getTickets().then((res) => {
            setFaqItems(res);
            const uniqueSubjects = Array.from(new Set(res.map(i => i.subject)));
            setSubjects(['All', ...uniqueSubjects]);
            setFilteredItems(res);
        });
    }, []);


    const handleTabChange = (subject: string) => {
        setActiveTab(subject);
        if (subject === 'All') {
            setFilteredItems(faqItems);
        } else {
            setFilteredItems(faqItems.filter(item => item.subject === subject));
        }
    };

    return (
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            {/* Header */}
            <View>
                <View style={styles.header}>
                    <GoBackButton />
                    <TouchableOpacity onPress={() => router.push('/profile/settings/resource/ticket')}>
                        <Text style={[styles.myTickets, {paddingTop: insets.top}]}>
                            My Tickets
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <Text style={styles.title}>Support</Text>

                {/* Description */}
                <Text style={styles.description}>
                    We understand that sometimes you may have questions or encounter
                    challenges, and we&apos;re here to help! Before reaching out to our support
                    team, consider checking our FAQs below.
                </Text>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsContainer}>
                    {subjects.map((subject, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.tab, activeTab === subject && styles.activeTab]}
                            onPress={() => handleTabChange(subject)}>
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === subject && styles.activeTabText,
                                ]}>
                                {subject}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            {/* FAQ List */}
            <View style={styles.faqListContainer}>
                <FlatList
                    data={filteredItems}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.faqItem}
                            onPress={() => toggleItem(item.id)}>
                            <View style={styles.faqContent}>
                                <Text style={styles.faqTitle}>{item.subject}</Text>
                                {expandedItemId === item.id && (
                                    <Text style={styles.faqSubtitle}>{item.description}</Text>
                                )}
                            </View>
                            <Icon
                                name={
                                    expandedItemId === item.id ? 'chevron-up' : 'chevron-right'
                                }
                                size={24}
                                color={colors.primaryGreen}
                            />
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Support Button */}
            <View style={styles.supportButtonContainer}>
                <TouchableOpacity
                    style={styles.supportButton}
                onPress={() => router.push('/profile/settings/resource/ticket/submission')}>
                    <Text style={styles.supportButtonText}>
                        Can&apos;t find what you&apos;re looking for?
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SupportScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },

    /** Header **/
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    myTickets: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryGreen,
    },

    /** Title **/
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
        color: colors.primaryBlack,
    },

    description: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.gray,
        marginBottom: 16,
    },

    /** Tabs **/
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
        paddingVertical: 8,
    },

    tab: {
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
    },

    activeTab: {
        backgroundColor: colors.primaryGreen,
    },

    tabText: {
        fontSize: 12,
        color: colors.gray,
        fontWeight: '500',
    },

    activeTabText: {
        color: colors.white,
    },

    /** FAQ List **/
    faqListContainer: {
        flex: 1,
    },

    faqItem: {
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    faqContent: {
        flex: 1,
    },

    faqTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryGreen,
    },

    faqSubtitle: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 8,
    },

    /** Support Button **/
    supportButtonContainer: {
        paddingVertical: 12,
        backgroundColor: colors.white,
    },

    supportButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },

    supportButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
});
