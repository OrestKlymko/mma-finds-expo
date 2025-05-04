import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from "@/styles/colors";

type Props = {
    eventDescription?: string | undefined | null;
};
const EventDescription = ({eventDescription}: Props) => {

    if (!eventDescription) return null;
    return (
        <View>
            <Text style={styles.sectionTitle}>About the Event</Text>
            <Text style={styles.eventDescription}>{eventDescription}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 24,
        marginBottom: 12,
        color: colors.primaryBlack,
    },
    eventDescription: {
        fontSize: 12,
        fontWeight: '400',
        color: colors.gray,
        lineHeight: 16,
        marginBottom: 20,
    },
    readMore: {
        color: colors.primaryGreen,
        fontSize: 12,
        fontWeight: '500',
    },
});

export default EventDescription;
