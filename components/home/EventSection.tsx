import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import EventList from "@/components/EventList";
import {useRouter} from "expo-router";

interface EventSectionProps {
    events?: any[];
}

export const EventSection = ({events}: EventSectionProps) => {
    const router = useRouter();
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Events</Text>
                <TouchableOpacity onPress={() => {
                    router.push('/event')
                }}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            <EventList horizontal={true} events={events} />
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
