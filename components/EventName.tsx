import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import React from 'react';
import {useRouter} from "expo-router";

interface EventNameProps {
    event?: any;
}

export const EventName = ({event}: EventNameProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={[styles.inputRow]}
            onPress={() => {
                router.push('/event/choose')
            }}>
            <Text style={[styles.inputText]}>{event?.eventName || 'Event*'}</Text>
            <Icon name="chevron-right" size={24} color={colors.primaryBlack} />
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    inputDisabled: {
        backgroundColor: colors.lightGray,
        padding: 14,
        borderRadius: 8,
        marginBottom: 20,
        height: 56,
        justifyContent: 'center',
    },
    disabledText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        marginBottom: 20,
        height: 56,
    },
    inputText: {
        fontSize: 16,
        color: colors.gray,
    },
});
