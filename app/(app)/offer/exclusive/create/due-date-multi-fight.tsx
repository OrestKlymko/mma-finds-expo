import React, {useState} from 'react';
import {ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {createMultiFightOffer} from '@/service/service';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {resetOffer} from '@/store/createMultiContractOfferSlice';
import {CreateMultiOfferRequest} from '@/service/request';
import {useRouter} from "expo-router";

const ExclusiveOfferDueDateScreen = () => {
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        weightClass,
        sportType,
        purseValues,
        numberOfFights,
        currency,
        addMoreInfo,
        fighterId,
        months,
        exclusivity,
        newDocument,
        choosenDocument,
        addNewDocumentToProfile,
        dueDateDocument
    } = useSelector((state: RootState) => state.createMultiContractOffer);
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
    const formatDateForBackend = (date: string): string => {
        const [day, month, year] = date.split('/');
        const parsedDate = new Date(`${year}-${month}-${day}`);
        return parsedDate.toISOString().split('T')[0];
    };

    const handleSubmit = () => {
        if (!dueDate) {
            Alert.alert('Please select a due date.');
            return;
        }

        setLoading(true);
        if(!numberOfFights||!months){
            Alert.alert('Please fill all the fields');
            setLoading(false);
            return;
        }
        const dataToSend: CreateMultiOfferRequest = {
            durationContractMonth:parseInt(months, 10),
            purse: purseValues,
            moreInfo: addMoreInfo ?? '',
            numberOfFights: parseInt(numberOfFights, 10),
            weightClass: weightClass?.map(wc => wc.id),
            dueDate: formatDateForBackend(dueDate.toLocaleDateString()),
            fighterId: fighterId,
            minCatchWeight: weightClass?.filter(wc => wc.name === 'Catchweight')[0]
                ?.minCatchWeight,
            maxCatchWeight: weightClass?.filter(wc => wc.name === 'Catchweight')[0]
                ?.maxCatchWeight,
            currency: currency,
            exclusivity: exclusivity,
            newDocument: newDocument,
            dueDateDocument: dueDateDocument,
            choosenDocument: choosenDocument,
            addNewDocumentToProfile: addNewDocumentToProfile,
            sportTypeId: sportType?.map((s: any) => s.id),
        };

        createMultiFightOffer(dataToSend)
            .then(() => {
                dispatch(resetOffer());
                router.push('/offer/exclusive/create/third-step');
            })
            .catch(() => {
                Alert.alert('Error', 'Something went wrong');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                {/* Back Button */}

                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    <Icon name="calendar-clock" size={80} color={colors.primaryBlack} />
                </View>

                {/* Title */}
                <Text style={styles.title}>Set a Due Date!</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Choose a deadline for the fighter or their team to confirm or reject
                    your exclusive offer.
                </Text>

                {/* Вибір дати */}
                <TouchableOpacity
                    style={styles.selectFieldButton}
                    onPress={() => setDatePickerVisible(true)}>
                    <Icon name="calendar-outline" size={24} color={colors.primaryBlack} />
                    <Text style={styles.selectFieldText}>
                        {dueDate ? `Due Date: ${formatDate(dueDate)}` : 'Set a Due Date'}
                    </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    locale="en-GB"
                    isVisible={isDatePickerVisible}
                    minimumDate={new Date()}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={() => setDatePickerVisible(false)}
                />

                {/* Submit Button */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            Send Exclusive Fight Offer
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Date Picker */}
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

export default ExclusiveOfferDueDateScreen;

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
        marginBottom: 20,
    },
    selectFieldButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 14,
    },
    selectFieldText: {
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 12,
        color: colors.primaryBlack,
    },
    submitButton: {
        backgroundColor: colors.primaryBlack,
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
