import React, {useState} from 'react';
import {ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {
    renewDocumentExclusiveOfferDueDate,
    renewDocumentMultiFightOfferDueDate,
    renewDocumentPublicOfferDueDate,
} from '@/service/service';
import {useLocalSearchParams, useRouter} from "expo-router";
import {formatDateForBackend} from "@/utils/utils";

const RenewDocumentDueDateScreen = () => {
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const {offerId, typeOffer} = useLocalSearchParams<{
        offerId: string;
        typeOffer: 'Exclusive' | 'Multi-fight contract' | 'Public';
    }>();
    const router =useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            setDueDate(selectedDate);
        }
    };

    const handleConfirmDate = (date: Date) => {
        setDueDate(date);
        setDatePickerVisible(false);
    };

    const formatDate = (date: Date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const handleSubmit = () => {
        if (!dueDate) {
            Alert.alert('Please select a due date!');
            return;
        }
        setLoading(true);
        switch (typeOffer) {
            case 'Exclusive':
                renewDocumentExclusiveOfferDueDate(offerId, formatDateForBackend(formatDate(dueDate)))
                    .then(() => {
                        Alert.alert('Due date renewed successfully!');
                        router.back();
                    })
                    .catch(err => {
                        console.error(err);
                        Alert.alert('Failed to renew due date');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                break;
            case 'Multi-fight contract':
                renewDocumentMultiFightOfferDueDate(offerId, formatDateForBackend(formatDate(dueDate)))
                    .then(() => {
                        Alert.alert('Due date renewed successfully!');
                        router.back();
                    })
                    .catch(err => {
                        console.error(err);
                        Alert.alert('Failed to renew due date');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                break;
            case 'Public':
                renewDocumentPublicOfferDueDate(offerId, formatDateForBackend(formatDate(dueDate)))
                    .then(() => {
                        Alert.alert('Due date renewed successfully!');
                        router.back();
                    })
                    .catch(err => {
                        console.error(err);
                        Alert.alert('Failed to renew due date');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                break;
            default:
                break;
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                <View style={styles.illustrationContainer}>
                    <Icon name="calendar-clock" size={80} color={colors.primaryBlack} />
                </View>

                <Text style={styles.title}>Set a new due date!</Text>

                <Text style={styles.subtitle}>
                    Please extend the due date for the documents you need to upload.
                </Text>

                <TouchableOpacity
                    style={styles.selectFieldButton}
                    onPress={() => setDatePickerVisible(true)}>
                    <Icon name="calendar-outline" size={24} color={colors.primaryBlack} />
                    <Text style={styles.selectFieldText}>
                        {dueDate ? `Due Date: ${formatDate(dueDate)}` : 'Set a Due Date'}
                    </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    locale="en-GB"
                    pickerContainerStyleIOS={{alignSelf:'center'}}
                    minimumDate={new Date()}
                    onConfirm={handleConfirmDate}
                    onCancel={() => setDatePickerVisible(false)}
                />

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <Text style={styles.submitButtonText}>Renew Due Date</Text>
                    )}
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={dueDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                    />
                )}
            </View>
        </View>
    );
};

export default RenewDocumentDueDateScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    backText: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginLeft: 8,
    },
    illustrationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 100,
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 30,
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 40,
    },
    selectFieldButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 14,
        marginBottom: 30,
    },
    selectFieldText: {
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 12,
        color: colors.primaryBlack,
    },
    submitButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 20,
        height: 56,
        justifyContent: 'center',
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});
