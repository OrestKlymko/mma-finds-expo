import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TicketResponse} from "@/service/response";
import {getTickets} from "@/service/service";
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";
import {useRouter} from "expo-router";


const TABS = ['All', 'Open', 'Closed'];

const MyTicketsScreen = () => {
    const insets = useSafeAreaInsets();
    const [tickets, setTickets] = useState<TicketResponse[]>([]);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getTickets()
            .then(res => {
                setTickets(res);
            })
            .catch(() => {
                Alert.alert('Error', 'Failed to load tickets');
            });
    }, []);

    // Фільтрація квитків
    const filteredTickets = tickets.filter(ticket => {
        if (activeTab !== 'All' && ticket.status !== activeTab) return false;
        if (searchQuery && !ticket.subject.includes(searchQuery)) return false;
        return true;
    });

    return (
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            {/* Header */}
            <View style={styles.header}>
                <GoBackButton />
                {/*<TouchableOpacity onPress={() => router.push('/profile/settings/resource/support')}>*/}
                {/*    <Text style={styles.faqText}>FAQs</Text>*/}
                {/*</TouchableOpacity>*/}
            </View>

            {/* Title */}
            <Text style={styles.title}>My Tickets</Text>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}>
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

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for a ticket..."
                    placeholderTextColor={colors.gray}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Icon name="magnify" size={24} color={colors.gray} />
            </View>

            {/* Tickets List */}
            <FlatList
                data={filteredTickets}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.ticketItem}>
                        <View>
                            <Text
                                style={[
                                    styles.ticketNumber,
                                    item.status === 'OPEN'
                                        ? styles.ticketNumberOpen
                                        : styles.ticketNumberClosed,
                                ]}>
                                {item.subject}
                            </Text>
                            <Text style={styles.ticketDescription}>{item.description}</Text>
                        </View>
                        <Icon
                            name={item.status === 'OPEN' ? 'clock-outline' : 'check'}
                            size={24}
                            color={
                                item.status === 'CLOSED' ? colors.orange : colors.primaryGreen
                            }
                        />
                    </TouchableOpacity>
                )}
                contentContainerStyle={[styles.ticketList, { flexGrow: 1 }]} // Додано flexGrow: 1
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No tickets found</Text>
                    </View>
                }
            />
        </View>
    );
};

export default MyTicketsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 18,
    },

    /** Header **/
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    faqText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryGreen,
    },

    /** Title **/
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 50,
        marginTop: 20,
        color: colors.primaryBlack,
    },

    /** Tabs **/
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },

    tab: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
    },

    activeTab: {
        backgroundColor: colors.primaryGreen,
    },

    tabText: {
        fontSize: 16,
        color: colors.gray,
        fontWeight: '500',
    },

    activeTabText: {
        color: colors.white,
    },

    /** Search **/
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        paddingVertical: 20,
        paddingHorizontal: 8,
    },

    /** Ticket List **/
    ticketList: {
        paddingBottom: 20,
    },

    ticketItem: {
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 26,
        padding: 12,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    ticketNumber: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        marginBottom: 4,
    },

    ticketNumberOpen: {
        color: colors.orange,
    },

    ticketNumberClosed: {
        color: colors.primaryGreen,
    },

    ticketDescription: {
        fontSize: 12,
        fontWeight: '400',
        color: colors.primaryBlack,
    },

    /** Empty State **/
    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        color: colors.gray,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
