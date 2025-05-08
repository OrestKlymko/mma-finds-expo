import {Platform, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "@/styles/colors";

interface DateOfBirthProps {
    dateOfBirth: Date | null;
    setDateOfBirth: (date: Date) => void;
    hasSubmitted: boolean;
    setAge: (value: ((prevState: string) => string) | string) => void;
    age: string;
}

export const DateOfBirth = ({
                                dateOfBirth,
                                setDateOfBirth,
                                hasSubmitted,
                                setAge,
                                age,
                            }: DateOfBirthProps) => {
    const [isDOBPickerVisible, setDOBPickerVisible] = React.useState(false);

    const handleConfirmDOB = (selectedDate: Date) => {
        setDOBPickerVisible(false);
        if (selectedDate) {
            setDateOfBirth(selectedDate);

            // Автокалькуляція віку
            const birthYear = selectedDate.getFullYear();
            const nowYear = new Date().getFullYear();
            const ageCalc = nowYear - birthYear;
            setAge(String(ageCalc));
        }
    };

    const handleCancelDOB = () => {
        setDOBPickerVisible(false);
    };

    return (
        <>
            <View style={styles.flexDirectionRow}>
                <TouchableOpacity
                    style={[
                        styles.dobContainer,
                        hasSubmitted && !dateOfBirth && {borderColor: colors.error},
                    ]}
                    onPress={() => setDOBPickerVisible(true)}>
                    <Text
                        style={[
                            styles.dobText,
                            hasSubmitted && !dateOfBirth && {color: colors.error},
                        ]}>
                        {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Date of Birth*'}
                    </Text>
                    <Ionicons name="calendar" size={20} color={colors.gray} />
                </TouchableOpacity>

                <View style={[styles.ageContainer, {flex: 0.5}]}>
                    <Text style={styles.ageText}>{age ? `${age} years` : 'Age'}</Text>
                </View>
            </View>

            <DateTimePickerModal
                isVisible={isDOBPickerVisible}
                mode="date"
                onConfirm={handleConfirmDOB}
                onCancel={handleCancelDOB}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                locale="en-GB"
                maximumDate={new Date()}
                pickerContainerStyleIOS={{alignSelf:'center'}}
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
        flex: 1,
        marginRight: 10,
    },
    dobText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    ageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        height: 56,
        backgroundColor: colors.lightGray,
    },
    ageText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
});
