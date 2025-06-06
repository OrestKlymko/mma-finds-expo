import React, {useEffect} from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {getEventById} from '@/service/service';


import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {
    resetPublicOffer,
    setBenefits,
    setCurrency,
    setEvent,
    setFightLength,
    setIsTitleFight,
    setMmaRule,
    setPurseType,
    setPurseValues,
    setSportType,
} from '@/store/createPublicOfferSlice';
import {EventName} from "@/components/EventName";
import {SportTypeSingleSelectDropdown} from "@/components/SportTypeSingleSelectDropdown";
import RuleSelector from "@/components/RuleSelector";
import {TitleFightSwitcher} from "@/components/TitleFightSwitcher";
import FightLengthPicker from "@/components/FightLengthPicker";
import PursePublicOfferComponent from "@/components/PursePublicOfferComponent";
import BenefitBottomSheet from "@/components/BenefitBottomSheet";
import {useLocalSearchParams, useRouter} from "expo-router";

const CreatePublicOfferFirstStepScreen = () => {
    const {
        event,
        mmaRule,
        fightLength,
        purseType,
        purseValues,
        sportType,
        isTitleFight,
        benefits,
    } = useSelector((state: RootState) => state.createPublicOffer);
    const dispatch = useDispatch();
    const router = useRouter();
    const params = useLocalSearchParams();
    const {eventId} = params as { eventId: string };
    useEffect(() => {

        if (event?.id || eventId) {
            getEventById(event?.id || eventId).then(res => {
                dispatch(setEvent(res));
            });
        }
    }, [event?.id, eventId]);

    const onConfirmPurse = (
        type: 'Between',
        values: {
            from: string;
            to: string;
        },
        selectedCurrency: string,
    ) => {
        dispatch(setPurseType(type));
        dispatch(setPurseValues(values));
        dispatch(setCurrency(selectedCurrency));
    };
    const handleContinue = () => {
        if (
            !event ||
            !mmaRule ||
            !fightLength ||
            !purseType ||
            !purseValues ||
            !sportType
        ) {
            Alert.alert('Please fill all required fields');
            return;
        }
        router.push('/offer/public/create/second-step')
    };
    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.white}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{flex: 1, backgroundColor: colors.white}}>
                <GoBackButton onPress={() => dispatch(resetPublicOffer())}/>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Create Public Fight Offer</Text>
                    <Text style={styles.label}>Event*</Text>
                    <EventName event={event}/>
                    <SportTypeSingleSelectDropdown
                        selectedSportType={sportType}
                        setSelectedSportType={st => dispatch(setSportType(st))}
                    />

                    <RuleSelector
                        mmaRule={mmaRule || 'Amateur'}
                        setMmaRule={rule => dispatch(setMmaRule(rule))}
                        selectedSportType={sportType}
                    />

                    <TitleFightSwitcher
                        isTitleFight={isTitleFight ? isTitleFight : false}
                        setIsTitleFight={ft => dispatch(setIsTitleFight(ft))}
                    />
                    <FightLengthPicker
                        fightLength={fightLength || null}
                        setFightLength={fl => dispatch(setFightLength(fl))}
                    />

                    <Text style={styles.label}>Purse*</Text>
                    <PursePublicOfferComponent
                        currentValues={purseValues}
                        onConfirm={onConfirmPurse}
                    />

                    <Text style={styles.label}>Benefits</Text>
                    <BenefitBottomSheet
                        benefitsChoosen={benefits}
                        onConfirm={selectedBenefits =>
                            dispatch(setBenefits(selectedBenefits))
                        }
                    />

                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}>
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

export default CreatePublicOfferFirstStepScreen;

const styles = StyleSheet.create({
    /** Основний контейнер */
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingBottom: 60,
    },

    /** Заголовок */
    title: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 50,
        color: colors.primaryBlack,
    },

    /** Підпис поля */
    label: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 8,
    },

    /** Поле Event (неактивне) */
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
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
        color: colors.primaryBlack,
    },
    continueButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 30,
        height: 56,
        justifyContent: 'center',
    },
    continueButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    errorBorder: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
    },
});
