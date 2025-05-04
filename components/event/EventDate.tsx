import {Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons as Icon} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import React, {useState} from "react";
import colors from "@/styles/colors";

type EventDateProps = {
    eventDate: Date | null;
    setEventDate: (date: Date) => void;
    errorEventDate: boolean;
    setErrorEventDate: (error: boolean) => void;
}

export const EventDate = (
    {eventDate, setEventDate, errorEventDate, setErrorEventDate}: EventDateProps
) => {
    const [isDOBPickerVisible, setDOBPickerVisible] = useState(false);
    const handleConfirmDOB = (selectedDate: Date) => {
        setDOBPickerVisible(false);
        if (selectedDate) {
            setEventDate(selectedDate);
            setErrorEventDate(false);
        }
    };

    const handleCancelDOB = () => {
        setDOBPickerVisible(false);
    };

    return <>
        <View style={styles.flexDirectionRow}>
            <TouchableOpacity
                style={[
                    styles.dobContainer,
                    {flex: 1},
                    errorEventDate && {borderColor: colors.error},
                ]}
                onPress={() => setDOBPickerVisible(true)}>
                <Text
                    style={[
                        styles.dobText,
                        errorEventDate && {color: colors.error},
                    ]}>
                    {eventDate ? eventDate.toLocaleDateString() : 'Event Date*'}
                </Text>
                <Icon name="calendar" size={20} color={colors.gray} />
            </TouchableOpacity>
        </View>

        <DateTimePickerModal
            isVisible={isDOBPickerVisible}
            mode="date"
            onConfirm={handleConfirmDOB}
            onCancel={handleCancelDOB}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            locale="en-GB"
            minimumDate={new Date()}
            pickerContainerStyleIOS={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        />
    </>;
};

const styles = StyleSheet.create({
    flexDirectionRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    dobContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 56,
        backgroundColor: colors.white,
    },
    dobText: {
        fontSize: 16,
        color: colors.gray,
    },
})
