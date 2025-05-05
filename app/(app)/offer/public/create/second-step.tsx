import React, {useState} from 'react';
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
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '@/styles/colors';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import GoBackButton from '@/components/GoBackButton';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {
    setAddMoreInfo,
    setAmDraw,
    setAmLoss,
    setAmWin,
    setGender,
    setMaxFights,
    setMinFights,
    setMinLoss,
    setMinWin,
    setOpponentAge,
    setOpponentGender,
    setOpponentName,
    setOpponentNationality,
    setOpponentTapology,
    setProDraw,
    setProLoss,
    setProWin,
    setWeightClass,
} from '@/store/createPublicOfferSlice';
import {WeightClassResponse} from '@/service/response';
import {useRouter} from "expo-router";
import {Gender} from "@/components/Gender";
import {WeightClassComponent} from "@/components/WeightClassComponent";
import OpponentInfoSection from "@/components/OpponentInfoSection";

const CreatePublicOfferSecondStepScreen = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        mmaRule,
        sportType,
        gender,
        weightClass,
        minFights,
        maxFights,
        minWin,
        minLoss,
        opponentTapology,
        addMoreInfo,
        offerId,
        opponentName,
        amateurWin,
        amateurLoss,
        amateurDraw,
        proWin,
        proLoss,
        proDraw,
        opponentAge,
        opponentGender,
        opponentNationality
    } = useSelector((state: RootState) => state.createPublicOffer);
    const insets = useSafeAreaInsets();
    // Фото бійця
    const [noTapologyLink, setNoTapologyLink] = useState(false);
    const [loading, setLoading] = useState(false);

    const [errorWeight, setErrorWeight] = useState(false);
    const [errorTapologyLink, setErrorTapologyLink] = useState(false);

    const [hasSubmit, setHasSubmit] = useState(false);

    const handleWeightClassSelect = (selected: WeightClassResponse) => {
        dispatch(setWeightClass(selected));
        setErrorWeight(false);
    };

    const onSignUpPress = () => {
        setHasSubmit(true);
        setErrorWeight(!weightClass);
        setErrorTapologyLink(!noTapologyLink && !opponentTapology);

        if (
            !gender ||
            !weightClass ||
            !minFights ||
            !maxFights ||
            (!noTapologyLink && !opponentTapology)
        ) {
            Alert.alert('Please fill all required fields');
            return;
        }
        router.push('/offer/public/create/third-step');
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{flex: 1, backgroundColor: colors.background}}>
                <GoBackButton/>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={[
                        styles.container,
                        {paddingBottom: insets.bottom},
                    ]}>
                    <Text style={styles.headerRoboto}>Fighter Requirements</Text>

                    <Gender
                        gender={gender || ''}
                        hasSubmitted={hasSubmit}
                        setGender={g => dispatch(setGender(g))}
                    />
                    <WeightClassComponent
                        selectedWeightClass={weightClass}
                        onSelect={handleWeightClassSelect}
                        hasError={errorWeight}
                    />

                    <FloatingLabelInput
                        label="Minimum Fights*"
                        value={minFights || ''}
                        hasSubmitted={hasSubmit}
                        isRequired={true}
                        keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                        onChangeText={text => dispatch(setMinFights(text))}
                        containerStyle={styles.inputContainer}
                    />
                    <FloatingLabelInput
                        label="Maximum Fights*"
                        value={maxFights || ''}
                        isRequired={true}
                        hasSubmitted={hasSubmit}
                        keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                        onChangeText={text => dispatch(setMaxFights(text))}
                        containerStyle={styles.inputContainer}
                    />
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.sectionTitle}>Minimum Win/Loss Ratio</Text>
                        <TouchableOpacity
                            onPress={() =>
                                Alert.alert(
                                    'The win/loss ratio represents the number of wins a fighter has compared to their losses. For example, a 2:1 ratio means the fighter has won twice as many fights as they’ve lost.',
                                )
                            }
                            style={{marginLeft: 4}}>
                            <Icon
                                name="information-outline"
                                size={20}
                                color={colors.primaryBlack}
                                style={{marginBottom: 8}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.recordRow}>
                        <FloatingLabelInput
                            label="Win"
                            value={minWin || ''}
                            onChangeText={text => dispatch(setMinWin(text))}
                            containerStyle={[styles.recordInput, {flex: 1, marginRight: 0}]} // Додай flex: 1
                            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                        />
                        <Text style={styles.doubleDotsBetween}>:</Text>
                        <FloatingLabelInput
                            label="Loss"
                            value={minLoss || ''}
                            onChangeText={text => dispatch(setMinLoss(text))}
                            containerStyle={[styles.recordInput, {flex: 1}]} // Додай flex: 1
                            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                        />
                    </View>
                    <OpponentInfoSection
                        opponentTapology={opponentTapology || ''}
                        mmaRule={mmaRule}
                        title={sportType?.name}
                        amDraw={amateurDraw ?? ''}
                        amLoss={amateurLoss ?? ''}
                        amWins={amateurWin ?? ''}
                        hasSubmitted={hasSubmit}
                        noTapologyLink={noTapologyLink}
                        opponentName={opponentName ?? ''}
                        opponentAge={opponentAge ?? ''}
                        opponentGender={opponentGender ?? ''}
                        nationality={opponentNationality ?? null}
                        proDraw={proDraw ?? ''}
                        proLoss={proLoss ?? ''}
                        proWins={proWin ?? ''}
                        setAmDraw={s => dispatch(setAmDraw(s))}
                        setAmLoss={s => dispatch(setAmLoss(s))}
                        setAmWins={s => dispatch(setAmWin(s))}
                        setNoTapologyLink={setNoTapologyLink}
                        setOpponentName={s => dispatch(setOpponentName(s))}
                        setOpponentTapology={s => dispatch(setOpponentTapology(s))}
                        setProDraw={s => dispatch(setProDraw(s))}
                        setProLoss={s => dispatch(setProLoss(s))}
                        setProWins={s => dispatch(setProWin(s))}
                        setOpponentAge={s => dispatch(setOpponentAge(s))}
                        setOpponentGender={s => dispatch(setOpponentGender(s))}
                        setOpponentNationality={s => dispatch(setOpponentNationality(s))}
                    />

                    <FloatingLabelInput
                        label="Add More Info"
                        value={addMoreInfo || ''}
                        containerStyle={styles.inputContainer}
                        onChangeText={text => dispatch(setAddMoreInfo(text))}
                        maxLength={255}
                    />

                    <TouchableOpacity
                        style={styles.createFighterButton}
                        disabled={loading}
                        onPress={onSignUpPress}>
                        {offerId ? (
                            <Text style={styles.createFighterButtonText}>Save Changes</Text>
                        ) : (
                            <Text style={styles.createFighterButtonText}>Continue</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

export default CreatePublicOfferSecondStepScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 38,
    },
    headerRoboto: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 50,
        color: colors.primaryBlack,
    },

    inputContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    recordInput: {
        borderRadius: 8,
    },
    doubleDotsBetween: {
        fontSize: 16,
        color: colors.primaryBlack,
        textAlignVertical: 'center',
    },

    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchLabel: {
        flex: 1,
        fontSize: 14,
        color: colors.primaryBlack,
        marginLeft: 10,
    },

    createFighterButton: {
        height: 54,
        backgroundColor: colors.primaryBlack,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    createFighterButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },

    // Record Inputs (Win, Loss, Draw)
    recordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
});
