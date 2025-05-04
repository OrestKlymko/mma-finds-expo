import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React from 'react';
import colors from "@/styles/colors";

type EventTimeProps = {
    eventDurationFrom: string | null;
    setEventDurationFrom: (time: string) => void;
    eventDurationTo: string | null;
    setEventDurationTo: (time: string) => void;
    errorEventDurationFrom: boolean;
    setErrorEventDurationFrom: (error: boolean) => void;
    errorEventDurationTo: boolean;
    setErrorEventDurationTo: (error: boolean) => void;
};

export const EventTime = ({
                              eventDurationFrom,
                              setEventDurationFrom,
                              eventDurationTo,
                              setEventDurationTo,
                              errorEventDurationFrom,
                              setErrorEventDurationFrom,
                              errorEventDurationTo,
                              setErrorEventDurationTo,
                          }: EventTimeProps) => {
    const [isStartTimePickerVisible, setStartTimePickerVisible] =
        React.useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisible] =
        React.useState(false);

    const handleConfirmTime = (selectedTime: Date, type: 'start' | 'end') => {
        if (type === 'start') {
            setEventDurationFrom(
                selectedTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                }),
            );
            setErrorEventDurationFrom(false);
            setStartTimePickerVisible(false);
        } else {
            setEventDurationTo(
                selectedTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                }),
            );
            setErrorEventDurationTo(false);
            setEndTimePickerVisible(false);
        }
    };
    return (
        <>
            <View style={styles.flexDirectionRow}>
                <TouchableOpacity
                    style={[
                        styles.dobContainer,
                        {flex: 1},
                        errorEventDurationFrom && {borderColor: colors.error},
                    ]}
                    onPress={() => setStartTimePickerVisible(true)}>
                    <Text
                        style={[
                            styles.dobText,
                            errorEventDurationFrom && {color: colors.error},
                        ]}>
                        {eventDurationFrom ? eventDurationFrom : 'Start Time*'}
                    </Text>
                    <Icon name="clock-outline" size={20} color={colors.gray} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.dobContainer,
                        {flex: 1, marginLeft: 10},
                        errorEventDurationTo && {borderColor: colors.error},
                    ]}
                    onPress={() => setEndTimePickerVisible(true)}>
                    <Text
                        style={[
                            styles.dobText,
                            errorEventDurationTo && {color: colors.error},
                        ]}>
                        {eventDurationTo ? eventDurationTo : 'End Time*'}
                    </Text>
                    <Icon name="clock-outline" size={20} color={colors.gray} />
                </TouchableOpacity>
            </View>

            <DateTimePickerModal
                style={{
                    flex: 1,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                isVisible={isStartTimePickerVisible}
                mode="time"
                is24Hour={false}
                onConfirm={time => handleConfirmTime(time, 'start')}
                onCancel={() => setStartTimePickerVisible(false)}
                pickerContainerStyleIOS={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            />

            <DateTimePickerModal
                style={{
                    flex: 1,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                isVisible={isEndTimePickerVisible}
                mode="time"
                is24Hour={false}
                onConfirm={time => handleConfirmTime(time, 'end')}
                onCancel={() => setEndTimePickerVisible(false)}
                pickerContainerStyleIOS={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            />
        </>
    );
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
});
