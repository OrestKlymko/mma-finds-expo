import React, {useState} from 'react';
import {ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {mapBenefitsToCreateBenefit} from '@/utils/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {createExclusiveOffer} from '@/service/service';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {resetExclusiveOffer} from '@/store/createExclusiveOfferSlice';
import {CreateExclusiveOfferRequest} from '@/service/request';
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
        opponentTapology,
        purseValues,
        addMoreInfo,
        mmaRule,
        isTitleFight,
        event,
        fighterId,
        benefits,
        fightLength,
        currency,
        opponentName,
        sportType,
        newDocument,
        addNewDocumentToProfile,
        choosenDocument,
        dueDateDocument,
        amateurWin,
        amateurLoss,
        amateurDraw,
        proWin,
        proLoss,
        proDraw,
        opponentAge,
        opponentGender,
        opponentNationality,
    } = useSelector((state: RootState) => state.createExclusiveOffer);

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

        const dataToSend: CreateExclusiveOfferRequest = {
            dueDate: formatDateForBackend(dueDate.toLocaleDateString()),
            weightClass: weightClass?.id,
            tapologyLinkOpponents: opponentTapology,
            purseWin: purseValues?.win,
            purseFight: purseValues?.fight,
            purseBonus: purseValues?.bonus,
            moreInfo: addMoreInfo,
            mmaRule: mmaRule?.toUpperCase(),
            isTitleFight: isTitleFight,
            eventId: event?.id,
            fighterId: fighterId,
            benefit: mapBenefitsToCreateBenefit(benefits),
            rounds: fightLength?.rounds,
            minutes: fightLength?.minutes,
            minCatchWeight: weightClass?.minCatchWeight,
            maxCatchWeight: weightClass?.maxCatchWeight,
            currency: currency,
            sportTypeId: sportType?.id,
            opponentName: opponentName,
            newDocument: newDocument,
            dueDateDocument: dueDateDocument,
            choosenDocument: choosenDocument,
            addNewDocumentToProfile: addNewDocumentToProfile,
            proRecordLoses: parseInt(proLoss ?? '0'),
            proRecordWins: parseInt(proWin ?? '0'),
            proRecordDraws: parseInt(proDraw ?? '0'),
            amateurRecordLoses: parseInt(amateurLoss ?? '0'),
            amateurRecordWins: parseInt(amateurWin ?? '0'),
            amateurRecordDraws: parseInt(amateurDraw ?? '0'),
            opponentAge: opponentAge,
            opponentGender: opponentGender,
            opponentNationality: opponentNationality?.id,
        };
        createExclusiveOffer(dataToSend)
            .then(() => {
                dispatch(resetExclusiveOffer());
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
                <View style={styles.illustrationContainer}>
                    <Icon name="calendar-clock" size={80} color={colors.primaryBlack} />
                </View>

                <Text style={styles.title}>Set a Due Date!</Text>

                <Text style={styles.subtitle}>
                    Choose a deadline for the fighter or their team to confirm or reject
                    your exclusive offer.
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
                    pickerContainerStyleIOS={{alignSelf:'center'}}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    locale="en-GB"
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
                        <Text style={styles.submitButtonText}>
                            Send Exclusive Fight Offer
                        </Text>
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
        marginBottom: 30,
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
        height: 56,
        justifyContent: 'center',
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});
