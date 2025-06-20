import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, { useState } from 'react';
import colors from '@/styles/colors';

/* ---------- типи пропів НЕ змінюємо ---------- */
type EventDateProps = {
    eventDate: Date | null;
    setEventDate: (date: Date) => void;
    errorEventDate: boolean;
    setErrorEventDate: (error: boolean) => void;
};

/* сьогодні + 1 день (щоб мінімальна ≠ початкова) */
const tomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const EventDate = ({
                              eventDate,
                              setEventDate,
                              errorEventDate,
                              setErrorEventDate,
                          }: EventDateProps) => {
    /* локальна дата, яку бачить пікер */
    const [pickerDate, setPickerDate] = useState<Date>(eventDate ?? tomorrow());
    const [visible, setVisible] = useState(false);
    console.log(pickerDate)
    /* відкриваємо — завжди ставимо актуальну дату */
    const openPicker = () => {
        setPickerDate(eventDate ?? tomorrow());
        setVisible(true);
    };

    /* підтвердили */
    const confirm = (d: Date) => {
        setVisible(false);
        setEventDate(d);
        setErrorEventDate(false);
    };

    return (
        <>
            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.input, errorEventDate && styles.errBorder]}
                    onPress={openPicker}
                >
                    <Text style={[styles.txt, errorEventDate && styles.errTxt]}>
                        {eventDate ? eventDate.toLocaleDateString('en-GB') : 'Event Date*'}
                    </Text>
                    <Icon name="calendar" size={20} color={colors.gray} />
                </TouchableOpacity>
            </View>

            <DateTimePickerModal
                isVisible={visible}
                mode="date"
                date={pickerDate}
                minimumDate={new Date()}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                locale="en-GB"
                onConfirm={confirm}
                onCancel={() => setVisible(false)}
                pickerContainerStyleIOS={styles.pickerCtr}
            />
        </>
    );
};

/* ---------- styles ---------- */
const styles = StyleSheet.create({
    row: { flexDirection: 'row', marginBottom: 15 },
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
    txt: { fontSize: 16, color: colors.gray },
    errBorder: { borderColor: colors.error },
    errTxt: { color: colors.error },
    pickerCtr: { justifyContent: 'center', alignItems: 'center' },
});
