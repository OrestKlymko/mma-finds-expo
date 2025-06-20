import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React from 'react';
import colors from '@/styles/colors';

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

const FORMAT: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
};

// Helpers -----------------------------------------------------------
const dateWithTime = (h: number, m: number) => {
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
};
const defaultStartDate = () => dateWithTime(18, 0); // 18:00
const defaultEndDate = () => dateWithTime(23, 0);  // 23:00

const parseTime = (str: string | null): Date => {
    if (!str) return new Date();
    const m = str.replace(/\u00A0|\u202F/g, ' ').trim().match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/i);
    if (!m) return new Date();
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const suffix = m[3]?.toUpperCase();
    if (suffix === 'PM' && h < 12) h += 12;
    if (suffix === 'AM' && h === 12) h = 0;
    return dateWithTime(h, min);
};
const formatTime = (d: Date) => d.toLocaleTimeString('en-US', FORMAT);
// ------------------------------------------------------------------

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
    const [isStartVisible, setStartVisible] = React.useState(false);
    const [isEndVisible, setEndVisible] = React.useState(false);

    const startDate = eventDurationFrom ? parseTime(eventDurationFrom) : defaultStartDate();
    const endDate = eventDurationTo ? parseTime(eventDurationTo) : defaultEndDate();
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    const confirm = (d: Date, type: 'start' | 'end') => {
        const t = formatTime(d);
        console.log(type);
        if (type === 'start') {
            setEventDurationFrom(t);
            setErrorEventDurationFrom(false);
            setStartVisible(false);
        } else {
            setEventDurationTo(t);
            setErrorEventDurationTo(false);
            setEndVisible(false);
        }
    };

    return (
        <>
            <View style={styles.row}>
                {/* Start */}
                <TouchableOpacity
                    style={[styles.input, errorEventDurationFrom && styles.errorBorder]}
                    onPress={() => setStartVisible(true)}
                >
                    <Text style={[styles.inputText, errorEventDurationFrom && styles.errorText]}>
                        {eventDurationFrom || 'Start Time*'}
                    </Text>
                    <Icon name="clock-outline" size={20} color={colors.gray} />
                </TouchableOpacity>

                {/* End */}
                <TouchableOpacity
                    style={[styles.input, styles.inputRight, errorEventDurationTo && styles.errorBorder]}
                    onPress={() => setEndVisible(true)}
                >
                    <Text style={[styles.inputText, errorEventDurationTo && styles.errorText]}>
                        {eventDurationTo || 'End Time*'}
                    </Text>
                    <Icon name="clock-outline" size={20} color={colors.gray} />
                </TouchableOpacity>
            </View>

            {/* Pickers */}
            <DateTimePickerModal
                isVisible={isStartVisible}
                mode="time"
                is24Hour={false}
                date={startDate}
                onConfirm={(d) => confirm(d, 'start')}
                onCancel={() => setStartVisible(false)}
                pickerContainerStyleIOS={styles.pickerContainer}
            />
            <DateTimePickerModal
                isVisible={isEndVisible}
                mode="time"
                is24Hour={false}
                date={endDate}
                onConfirm={(d) => confirm(d, 'end')}
                onCancel={() => setEndVisible(false)}
                pickerContainerStyleIOS={styles.pickerContainer}
            />
        </>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    input: {
        flex: 1,
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
    inputRight: {
        marginLeft: 10,
    },
    inputText: {
        fontSize: 16,
        color: colors.gray,
    },
    errorBorder: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
    },
    pickerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
