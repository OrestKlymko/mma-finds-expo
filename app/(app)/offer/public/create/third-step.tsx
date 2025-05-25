import React, {useState} from 'react';
import {ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {createPublicOffer, getShortInfoPromotion,} from '@/service/service';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {resetPublicOffer} from '@/store/createPublicOfferSlice';
import {UpdateOfferRequest} from '@/service/request';
import {formatDate, mapBenefitsToCreateBenefit} from "@/utils/utils";
import {useRouter} from "expo-router";
import {useAuth} from "@/context/AuthContext";

const PromotionSetDueDatePublicOffer = () => {
    const router = useRouter();
    const {entityId}=useAuth();
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {
        event,
        mmaRule,
        fightLength,
        purseValues,
        sportType,
        isTitleFight,
        currency,
        benefits,
        gender,
        weightClass,
        minFights,
        maxFights,
        minWin,
        minLoss,
        opponentTapology,
        addMoreInfo,
        opponentName,
        amateurWin,
        amateurLoss,
        amateurDraw,
        proWin,
        proLoss,
        proDraw,
        opponentAge,
        opponentGender,
        opponentNationality,
        showToAllManagers
    } = useSelector((state: RootState) => state.createPublicOffer);

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

    const formatDateForBackend = (date: string): string => {
        const [day, month, year] = date.split('/');
        const parsedDate = new Date(`${year}-${month}-${day}`);
        return parsedDate.toISOString().split('T')[0];
    };

    const handleSubmit = () => {
        if(!entityId){
            Alert.alert('Error', 'Start a new offer from the beginning.');
            return;
        }
        if (!dueDate) {
            Alert.alert('Please select a due date.');
            return;
        }

        setLoading(true);

        const dataToSend:UpdateOfferRequest = {
            eventId: event?.id,
            rounds: fightLength?.rounds,
            minutes: fightLength?.minutes,
            weightClass: weightClass?.id,
            mmaRule: mmaRule?.toUpperCase(),
            isTitleFight: isTitleFight,
            fromPrice: purseValues?.from,
            toPrice: purseValues?.to,
            description: addMoreInfo,
            gender: gender,
            minFights: minFights,
            maxFights: maxFights,
            minWins: minWin,
            minLoss: minLoss,
            tapologyLinkOpponents: opponentTapology,
            dueDate: formatDateForBackend(dueDate.toLocaleDateString()),
            benefit: mapBenefitsToCreateBenefit(benefits),
            minCatchWeight: weightClass?.minCatchWeight,
            maxCatchWeight: weightClass?.maxCatchWeight,
            currency: currency,
            sportTypeId: sportType?.id,
            opponentName: opponentName,
            proRecordLoses: parseInt(proLoss ?? '0'),
            proRecordWins: parseInt(proWin ?? '0'),
            proRecordDraws: parseInt(proDraw ?? '0'),
            amateurRecordLoses: parseInt(amateurLoss ?? '0'),
            amateurRecordWins: parseInt(amateurWin ?? '0'),
            amateurRecordDraws: parseInt(amateurDraw ?? '0'),
            opponentAge: opponentAge,
            opponentGender: opponentGender,
            opponentNationality: opponentNationality?.id,
            showToAllManagers: showToAllManagers,
        };
        createPublicOffer(dataToSend)
            .then(_ => {
                dispatch(resetPublicOffer());
                getShortInfoPromotion(entityId)
                    .then(res => {
                        if (!res.isVerified) {
                            Alert.alert(
                                'Need Verification',
                                'Your offer will be published after verification of your organization. You can check the status of verification in the profile section.',
                                [
                                    {
                                        text: 'Go to Verification',
                                        onPress: () => router.push('/profile/settings/account/account-info/verification'),
                                    },
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                        onPress: () => router.push('/(app)/(tabs)'),
                                    },
                                ],
                                {cancelable: false},
                            );
                            return;
                        } else {
                            router.push('/offer/public/create/success-step');
                        }
                    })
                    .finally(() => setLoading(false));
            })
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Something went wrong');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>

                <View style={styles.illustrationContainer}>
                    <Icon name="calendar-clock" size={80} color={colors.primaryBlack} />
                </View>

                <Text style={styles.title}>Set a Due Date!</Text>

                <Text style={styles.subtitle}>
                    It’s important to set a due date by which managers must submit their
                    fighter applications.
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
                        <Text style={styles.submitButtonText}>
                            Create Public Fight Offer
                        </Text>
                    )}
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={dueDate || new Date()}
                        mode="date"
                        onChange={handleDateChange}
                    />
                )}
            </View>
        </View>
    );
};

export default PromotionSetDueDatePublicOffer;

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
        backgroundColor: colors.primaryBlack,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        height: 56,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});
