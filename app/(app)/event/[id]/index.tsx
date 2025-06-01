import React, {useEffect, useState} from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {Image} from "expo-image";
import {EventShortInfo} from "@/service/response";
import {useLocalSearchParams, useRouter} from "expo-router";
import colors from "@/styles/colors";
import EventDescription from "@/components/EventDescription";
import {getEventById} from "@/service/service";
import ContentLoader from "@/components/ContentLoader";
import GoBackButton from "@/components/GoBackButton";


export const EventFullInfoScreen = () => {
    const [event, setEvent] = useState<EventShortInfo | null>(null);
    const params = useLocalSearchParams();
    const router = useRouter();
    const eventId = params.id as string | undefined;
    const fighterId = params.fighterId as string | undefined;
    const [contentLoading, setContentLoading] = useState(false);
    const [isMenuVisible, setMenuVisible] = useState(false);

    const handleBack = () => {
        router.back();
    };
    useEffect(() => {
        if (eventId) {
            setContentLoading(true);
            getEventById(eventId)
                .then(res => {
                    setEvent(res);
                })
                .finally(() => setContentLoading(false));
        }
    }, [eventId]);

    const handleEditEvent = () => {
        if (event) {
            router.push({pathname: `/event/create`, params: {eventId: event.id}});
            setMenuVisible(false);
        }
    };

    const formattedDate = (date: string | undefined) => {
        if (!date) return '';
        const dateArray = date.split('-');
        return `${dateArray[2]}.${dateArray[1]}.${dateArray[0]}`;
    };

    const formattedEventDate = React.useMemo(() => {
        return formattedDate(event?.eventDate);
    }, [event?.eventDate]);
    const rednerEventDetails = () => {
        return (
            <View style={styles.eventDetailsContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.eventTitle}>
                        {event?.eventName || 'Event Name'}
                    </Text>

                    <TouchableOpacity onPress={() => setMenuVisible(!isMenuVisible)}>
                        <Icon name="dots-vertical" size={24} color={colors.primaryBlack}/>
                    </TouchableOpacity>

                    {isMenuVisible && (
                        <View style={styles.menuContainer}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleEditEvent}>
                                <Icon
                                    name="pencil-outline"
                                    size={20}
                                    color={colors.primaryBlack}
                                />
                                <Text style={styles.menuItemText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {/* Date */}
                <View style={styles.infoRow}>
                    <Icon
                        name="calendar"
                        size={26}
                        color={colors.primaryBlack}
                        style={styles.iconStyle}
                    />
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoLabel}>
                            {formattedEventDate || 'Date not provided'}
                        </Text>
                        <Text style={styles.infoSubLabel}>{event?.eventTime}</Text>
                    </View>
                </View>
                {/* Location */}
                <View style={styles.infoRow}>
                    <Icon
                        name="map-marker"
                        size={26}
                        color={colors.primaryBlack}
                        style={styles.iconStyle}
                    />
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoLabel}>
                            {event?.arenaName || 'Venue not provided'}
                        </Text>
                        <Text style={styles.infoSubLabel}>
                            {event?.eventLocation || 'Address not provided'}
                        </Text>
                    </View>
                </View>
                {/* Description */}

                {event?.description && (
                    <EventDescription eventDescription={event?.description}/>
                )}

                <View
                    style={{
                        marginBottom: 14,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={() => {
                            router.push({pathname: '/offer/public/create', params: {eventId}});
                            // navigation.navigate('CreatePublicOfferFirstStepScreen', {
                            //     eventId,
                            // })
                        }}>
                        <Text style={styles.ctaButtonText}>Create Public Offer</Text>
                        <TouchableOpacity
                            onPress={() =>
                                Alert.alert(
                                    'Create and send public fight offers to attract fighters worldwide.',
                                )
                            }>
                            <Icon name="information-outline" size={20} color={colors.white}/>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    {/* Exclusive Offer Button */}
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={() => {
                            router.push({pathname: '/offer/exclusive/create', params: {eventId}});
                        }}>
                        <Text style={styles.ctaButtonText}>Create Private Offer</Text>
                        <TouchableOpacity
                            onPress={() =>
                                Alert.alert(
                                    'Create and send an private fight offer tailored to a specific fighter, whether for a single bout or a multi-fight contract. The offer is visible only to the fighters’ representative.',
                                )
                            }>
                            <Icon name="information-outline" size={20} color={colors.white}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (contentLoading) {
        return <ContentLoader/>;
    }
    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[styles.container]}>
                {/* Event Image */}
                <View style={styles.imageWrapper}>
                    <Image
                        source={{
                            uri:
                                event?.eventImageLink || 'https://via.placeholder.com/400x200',
                        }}
                        style={styles.eventImage}
                    />
                    <GoBackButton
                        color={'white'}
                        style={{position: 'absolute', left: 10}}
                    />
                </View>

                {/* Event Details */}
                {rednerEventDetails()}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
    },
    maybeLaterText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#C01818',
        textAlign: 'center',
    },
    imageWrapper: {
        aspectRatio: 1,
    },
    eventImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    eventDetailsContainer: {
        padding: 24,
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -28,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryGreen,
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconStyle: {
        marginRight: 12,
        backgroundColor: colors.lightGray,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    infoWrapper: {
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: colors.lightGray,
        paddingLeft: 12,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryGreen,
        marginBottom: 4,
    },
    infoSubLabel: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: '500',
        lineHeight: 11,
        color: colors.gray,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 24,
        marginBottom: 12,
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
    },
    eventDescription: {
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'Roboto',
        color: colors.gray,
        lineHeight: 16,
        marginBottom: 32,
    },

    ctaButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 56,
        marginBottom: 10,
        width: 174,
    },
    ctaButtonText: {
        fontSize: 11,
        color: colors.white,
    },

    menuContainer: {
        position: 'absolute',
        top: 30,
        right: 0,
        backgroundColor: colors.white,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 2},
        paddingVertical: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 10,
    },
    bottomSheetStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    ctaButtonFullWidth: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        width: '100%', // Make button full width
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 56,
    },
    infoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primaryGreen,
        marginTop: 5,
    },
});

export default EventFullInfoScreen;
