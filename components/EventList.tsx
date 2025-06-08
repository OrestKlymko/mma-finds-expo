import {Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React from 'react';
import {Image} from "expo-image";
import {EventShortInfo} from "@/service/response";
import {useRouter} from "expo-router";
import colors from "@/styles/colors";

interface EventListProps {
    horizontal?: boolean;
    fighterId?: any;
    events?: EventShortInfo[];
    eventSelect?: (item: EventShortInfo) => void;
}


export const EventList = ({horizontal, fighterId, events, eventSelect}: EventListProps) => {
    const shortLabel = React.useCallback((label: string) => {
        return label.length > 20 ? label.substring(0, 20) + '...' : label;
    }, []);
    const router = useRouter();

    const handleEventSelect = (item: EventShortInfo) => {
        if (eventSelect) {
            eventSelect(item);
            return;
        }

        router.push({
            pathname: `/event/${item.id}` as any,
            params: { fighterId },
        });
    };

    const formattedDate = React.useCallback((date: string) => {
        if (!date) return '';
        const dateArray = date.split('-');
        return `${dateArray[2]}.${dateArray[1]}.${dateArray[0]}`;
    }, []);

    const getDayOfWeekFromDate = React.useCallback((date: string) => {
        const dateArray = date.split('-');
        const dateObject = new Date(
            parseInt(dateArray[0]),
            parseInt(dateArray[1]) - 1,
            parseInt(dateArray[2]),
        );
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];
        return days[dateObject.getDay()];
    }, []);
    const screenWidth = Dimensions.get('window').width;
    const CARD_WIDTH = screenWidth - 30 * 2; // 38 зліва та 38 справа
    const setWidth = React.useMemo(() => {
        return horizontal ? {width: CARD_WIDTH, marginRight: 13} : {};
    }, [CARD_WIDTH, horizontal]);

    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={events}
            horizontal={horizontal}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={!horizontal ? () => <View style={{ height: 15 }} /> : () => <></>}
            renderItem={({item}) => (
                <TouchableOpacity
                    style={[styles.eventCard, setWidth]}
                    onPress={() => handleEventSelect(item)}>
                    <Image
                        source={{
                            uri: item.eventImageLink || 'https://via.placeholder.com/80',
                        }}
                        style={styles.eventImage}
                    />
                    <View style={styles.eventDetails}>
                        <Text style={styles.eventTitle}>
                            {item.eventName}
                        </Text>
                        <Text style={styles.eventDetail}>
                            <Text style={styles.eventLabel}>Date: </Text>
                            {formattedDate(item.eventDate)},{' '}
                            {getDayOfWeekFromDate(item.eventDate)}
                        </Text>
                        <Text style={styles.eventDetail}>
                            <Text style={styles.eventLabel}>Place: </Text>
                            {shortLabel(item.eventLocation)}
                        </Text>
                        <Text style={styles.eventDetail}>
                            <Text style={styles.eventLabel}>Duration: </Text>
                            {item.eventTime}
                        </Text>
                    </View>
                    <Icon
                        name="chevron-right"
                        size={24}
                        color={colors.gray}
                        style={styles.iconStyle}
                    />
                </TouchableOpacity>
            )}
        />
    );
}

export default EventList;

const styles = StyleSheet.create({
    /** Event Card **/
    eventCard: {
        backgroundColor: colors.lightGray,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 120, // Фіксована висота картки
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
    },
    iconStyle: {
        position: 'absolute',
        right: 0,
    },
    eventImage: {
        width: 125,
        height: '100%', // Заповнює всю висоту картки
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        marginRight: 10,
        backgroundColor: colors.gray,
    },
    eventDetails: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.primaryGreen,
        marginBottom: 6,
    },
    eventDetail: {
        fontSize: 10,
        color: colors.primaryBlack,
        marginBottom: 2,
    },
    eventLabel: {
        fontWeight: '600',
        color: colors.primaryBlack,
    },
});
