import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {EventShortInfo} from "@/service/response";
import {useFocusEffect, useRouter} from "expo-router";
import {getEvents} from "@/service/service";
import GoBackButton from "@/components/GoBackButton";
import ContentLoader from "@/components/ContentLoader";
import colors from "@/styles/colors";
import EventList from "@/components/EventList";


const MyEventsScreen = () => {
    const insets = useSafeAreaInsets();
    const [events, setEvents] = useState<EventShortInfo[]>([]);
    const router = useRouter();
    const [contentLoading, setContentLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setContentLoading(true);
            getEvents()
                .then(res => {
                    setEvents(res);
                })
                .catch(() => {
                    Alert.alert('Error', 'Failed to load events', [{text: 'OK'}]);
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
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                <Text style={styles.header}>My Events</Text>
                <Text style={styles.subtitle}>
                    View all of your fight events in one place.
                </Text>
                <EventList events={events} />
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => router.push('/event/create') }>
                    <Text style={styles.modalButtonText}>Create New Event</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MyEventsScreen;

const styles = StyleSheet.create({
    /** Container **/
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingBottom: 24,
    },

    /** Header **/
    header: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        fontFamily: 'Roboto',
        textAlign: 'center',
        marginBottom: 20,
    },

    modalButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 17,
        paddingHorizontal: 32,
        alignItems: 'center',
        marginTop: 8,
        width: '100%',
        marginBottom: 50,
        height: 56,
        justifyContent: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
    },
    subtitle: {
        fontSize: 14,
        color: colors.primaryBlack,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '400',
    },
});
