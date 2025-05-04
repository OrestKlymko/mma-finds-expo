import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getEvents} from '@/service/service';
import {useDispatch} from 'react-redux';
import {setEvent} from '@/store/createPublicOfferSlice';
import {setEvent as setEventForExclusive} from '@/store/createExclusiveOfferSlice';
import {EventDetailsResponse} from '@/service/response';
import EventList from "@/components/EventList";
import {useRouter} from "expo-router";


const AllMyEventsForChooseScreen = () => {
    const router = useRouter()
    const insets = useSafeAreaInsets();
    const [events, setEvents] = useState<EventDetailsResponse[]>([]);
    const dispatch = useDispatch();
    const handleEventSelect = (item: EventDetailsResponse) => {
        dispatch(setEvent(item));
        dispatch(setEventForExclusive(item));
        router.back();
    };

    useEffect(() => {
        getEvents()
            .then(res => {
                setEvents(res);
            })
            .catch(() => {});
    }, []);

    return (
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            {/* Back Button */}
            <GoBackButton />

            {/* Title */}
            <Text style={styles.header}>All Events</Text>
            <Text style={styles.subHeader}>Please choose an event.</Text>
            <EventList events={events} eventSelect={ev => handleEventSelect(ev)} />
            <TouchableOpacity
                style={styles.modalButton}
                onPress={() => router.push('/event/create')}>
                <Text style={styles.modalButtonText}>Create New Event</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AllMyEventsForChooseScreen;

const styles = StyleSheet.create({
    /** Container **/
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },

    /** Header **/
    header: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        fontFamily: 'Roboto',
        marginBottom: 8,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 24,
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
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
    },
});
