import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createEvent, getEventById, getShortInfoPromotion, updateEvent} from "@/service/service";
import {useLocalSearchParams, useRouter} from "expo-router";
import ContentLoader from "@/components/ContentLoader";
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import FloatingLabelInputGeo from "@/components/FloatingLabelInputGeo";
import {EventTime} from "@/components/event/EventTime";
import {EventPromotionName} from "@/components/event/EventPromotionName";
import {EventDate} from "@/components/event/EventDate";
import {EventPoster} from "@/components/event/EventPoster";
import {useAuth} from "@/context/AuthContext";



export function CreateEventScreen() {
    const insets = useSafeAreaInsets();
    const [profileImage, setProfileImage] = useState<any | null>(null);
    const {entityId}=useAuth();
    const [loading, setLoading] = useState(false);
    const startTimeDefault = new Date();
    startTimeDefault.setHours(18, 0, 0, 0);
    const endTimeDefault = new Date();
    endTimeDefault.setHours(23, 0, 0, 0);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState<Date | null>(null);
    const [eventDurationFrom, setEventDurationFrom] = useState('6:00 PM');
    const [eventDurationTo, setEventDurationTo] = useState('23:00 PM');
    const [eventInfo, setEventInfo] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [country, setCountry] = useState<string | null>(null);
    const [continent, setContinent] = useState<string | null>(null);
    const [location, setLocation] = useState('');
    const [arenaName, setArenaName] = useState('');
    const [organizerId, setOrganizerId] = useState<string | null>(null);
    const [organizationName, setOrganizationName] = useState<string | null>(null);

    const [errorEventDate, setErrorEventDate] = useState(false);
    const [errorEventDurationFrom, setErrorEventDurationFrom] = useState(false);
    const [errorEventDurationTo, setErrorEventDurationTo] = useState(false);
    const [errorLocation, setErrorLocation] = useState(false);
    const [contentLoading, setContentLoading] = useState(false);
    const {eventId} = useLocalSearchParams<{eventId?: string | undefined}>();
    const router = useRouter();
    const formatedOnBackendDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        if(!entityId) {
            return;
        }
        getShortInfoPromotion(entityId)
            .then(response => {
                setOrganizerId(response.id);
                setOrganizationName(response.name);
            })
            .catch(() => {
                Alert.alert('Error', 'Failed to load promotion info');
            });
        if (eventId) {
            setContentLoading(true);
            getEventById(eventId)
                .then(res => {
                    console.log(res);
                    setProfileImage({uri: res.eventImageLink});
                    setEventName(res.eventName);
                    setEventDate(new Date(res.eventDate));
                    setEventDurationFrom(res.eventTime.split('-')[0]);
                    setEventDurationTo(res.eventTime.split('-')[1].replace('CET', ''));
                    setEventInfo(res?.description?? '');
                    setLocation(res.eventLocation);
                    setArenaName(res.arenaName);
                    setEditMode(true);
                })
                .finally(() => setContentLoading(false));
        }
    }, [eventId]);

    const onSignUpPress = () => {
        setHasSubmitted(true);
        setErrorEventDate(!eventDate);
        setErrorEventDurationFrom(!eventDurationFrom);
        setErrorEventDurationTo(!eventDurationTo);
        setErrorLocation(!location);

        if (
            !profileImage ||
            !eventName ||
            !eventDate ||
            !eventDurationFrom ||
            !eventDurationTo ||
            !location ||
            !arenaName
        ) {
            Alert.alert('Please fill all required fields');
            return;
        }

        setLoading(true);
        const formData = new FormData();

        if (profileImage) {
            formData.append('image', {
                uri: profileImage.uri,
                type: profileImage.type || 'image/jpeg',
                name: profileImage.name || `profile_${Date.now()}.jpg`,
            } as any);
        }
        formData.append('name', eventName);
        formData.append('description', eventInfo);
        formData.append('location', location);
        formData.append('arenaName', arenaName);
        formData.append('date', formatedOnBackendDate(eventDate));
        formData.append('timeTo', eventDurationTo);
        formData.append('timeFrom', eventDurationFrom);
        formData.append('organizerId', organizerId || '');
        formData.append('country', country || '');
        formData.append('continent', continent || '');

        if (!editMode) {
            createEvent(formData)
                .then(response => {
                    router.push(`/event/${response.id}`)
                })
                .catch(() => {
                    Alert.alert('Error', 'Failed to create event');
                })
                .finally(() => {
                    setLoading(false);
                });
            return;
        }
        if (!eventId) {
            Alert.alert('Error', 'Event ID is required for updating');
            setLoading(false);
            return;
        }
        updateEvent(eventId, formData)
            .then(response => {
                router.push(`/event/${response.id}`)
            })
            .catch(() => {
                Alert.alert('Error', 'Failed to update event');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (contentLoading) {
        return <ContentLoader />;
    }

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{flex: 1, backgroundColor: colors.background,overflow: 'visible'}}>
                <GoBackButton />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={[
                        styles.container,
                        {paddingBottom: insets.bottom},
                    ]}>
                    <Text style={styles.headerRoboto}>
                        {editMode ? 'Edit an' : 'Create an'} Event
                    </Text>

                    <EventPoster
                        profileImage={profileImage}
                        setProfileImage={setProfileImage}
                        hasSubmitted={hasSubmitted}
                    />
                    <EventPromotionName organizationName={organizationName} />
                    <FloatingLabelInput
                        label="Event Name*"
                        value={eventName}
                        isRequired={true}
                        hasSubmitted={hasSubmitted}
                        onChangeText={setEventName}
                        containerStyle={styles.inputContainer}
                    />
                    <EventDate
                        eventDate={eventDate}
                        setEventDate={setEventDate}
                        errorEventDate={errorEventDate}
                        setErrorEventDate={setErrorEventDate}
                    />
                    <EventTime
                        eventDurationFrom={eventDurationFrom}
                        setEventDurationFrom={setEventDurationFrom}
                        eventDurationTo={eventDurationTo}
                        setEventDurationTo={setEventDurationTo}
                        errorEventDurationFrom={errorEventDurationFrom}
                        setErrorEventDurationFrom={setErrorEventDurationFrom}
                        errorEventDurationTo={errorEventDurationTo}
                        setErrorEventDurationTo={setErrorEventDurationTo}
                    />

                    <FloatingLabelInput
                        label="Arena Name*"
                        value={arenaName}
                        isRequired={true}
                        hasSubmitted={hasSubmitted}
                        onChangeText={setArenaName}
                        containerStyle={styles.inputContainer}
                    />

                    <FloatingLabelInputGeo
                        label={'Event Arena Address*'}
                        value={location}
                        error={errorLocation}
                        onChangeContinent={setContinent}
                        onChangeCountry={setCountry}
                        onChangeText={text => {
                            setLocation(text);
                            setErrorLocation(false);
                        }}
                        containerStyle={{marginBottom: 20}}
                    />

                    <FloatingLabelInput
                        label="Add More Info"
                        value={eventInfo}
                        onChangeText={setEventInfo}
                        containerStyle={styles.inputContainer}
                        maxLength={255}
                        multiline={true}
                    />

                    <TouchableOpacity
                        style={styles.createFighterButton}
                        onPress={onSignUpPress}
                        disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                            <Text style={styles.createFighterButtonText}>
                                {editMode ? 'Save' : 'Create New'} Event
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 38,
        overflow: 'visible',
    },
    headerRoboto: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 20,
        color: colors.primaryBlack,
    },
    titleProfile: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 19,
        marginBottom: 12,
        color: 'rgb(19, 19, 19)',
    },

    profileImage: {
        width: '100%',
        height: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    createFighterButton: {
        height: 56,
        backgroundColor: colors.primaryBlack,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    createFighterButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
});

export default CreateEventScreen;
