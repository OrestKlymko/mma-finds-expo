import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import {getEventById} from '@/service/service';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {
    setAddMoreInfo,
    setAddNewDocumentToProfile,
    setAmDraw,
    setAmLoss,
    setAmWin,
    setBenefits,
    setChoosenDocument,
    setCurrency,
    setDueDateDocument,
    setEvent,
    setFightLength,
    setIsTitleFight,
    setMmaRule,
    setNewDocument,
    setOpponentAge,
    setOpponentGender,
    setOpponentName,
    setOpponentNationality,
    setOpponentTapology,
    setProDraw,
    setProLoss,
    setProWin,
    setPurseValues,
    setSportType,
    setWeightClass,
} from '@/store/createExclusiveOfferSlice';
import {DocumentRequiredResponse} from '@/service/response';
import {formatDate, formatDateForBackend} from '@/utils/utils';
import {EventName} from "@/components/EventName";
import RuleSelector from "@/components/RuleSelector";
import {TitleFightSwitcher} from "@/components/TitleFightSwitcher";
import FightLengthPicker from "@/components/FightLengthPicker";
import {WeightClassComponent} from "@/components/WeightClassComponent";
import OpponentInfoSection from "@/components/OpponentInfoSection";
import BenefitBottomSheet from "@/components/BenefitBottomSheet";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import {PromotionTailoringRequiredDocuments} from "@/components/PromotionTailoringRequiredDocuments";
import {SportTypeSingleSelectDropdown} from "@/components/SportTypeSingleSelectDropdown";
import PurseExclusiveFightComponent from "@/components/offers/PurseExclusiveFightComponent";
import {useRouter} from "expo-router";
import {FighterForExclusiveOffer} from "@/components/fighter/FightersForExclusiveOffer";

interface SingleBoutOfferFlowProps {
    eventId?: any;
    fighterId?: any;
}

export function SingleBoutOfferFlow({
                                        eventId,
                                        fighterId,
                                    }: SingleBoutOfferFlowProps) {
    const {
        weightClass,
        opponentTapology,
        purseValues,
        addMoreInfo,
        mmaRule,
        isTitleFight,
        event,
        benefits,
        fightLength,
        currency,
        sportType,
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
        fightersChosen
    } = useSelector((state: RootState) => state.createExclusiveOffer);
    const dispatch = useDispatch();
    const [noTapologyLink, setNoTapologyLink] = useState(false);
    const [hasSubmit, setHasSubmit] = useState(false);
    const [errorWeightClass, setErrorWeightClass] = useState(false);
    const [errorTapologyLink, setErrorTapologyLink] = useState(false);
    const [errorPurse, setErrorPurse] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isSaveDocumentModalVisible, setSaveDocumentModalVisible] =
        useState(false);
    const [documents, setDocuments] = useState<DocumentRequiredResponse[]>([]);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const onConfirmPurse = (
        values: {
            win: string;
            fight: string;
            bonus: string;
        },
        selectedCurrency: string,
    ) => {
        dispatch(setPurseValues(values));
        dispatch(setCurrency(selectedCurrency));
    };

    useEffect(() => {
        if (eventId) {
            getEventById(eventId).then(res => {
                dispatch(setEvent(res));
            });
        }

    }, [eventId, fighterId, dispatch]);

    const handleContinue = (shouldSaveDocumentToProfile: boolean) => {

        if (documents.length === 0) {
            Alert.alert('Please select at least one document.');
            return;
        }
        const choosenDocument: DocumentRequiredResponse[] = documents.filter(
            doc => doc.selected,
        );
        const newDocument = documents.filter(doc => doc.isCustom && doc.selected);
        const formattedDate = dueDate
            ? formatDateForBackend(formatDate(dueDate))
            : null;
        if (!formattedDate) {
            Alert.alert('Please select a valid date.');
            return;
        }
        setHasSubmit(true);
        setErrorWeightClass(!weightClass);
        setErrorTapologyLink(!opponentTapology && !noTapologyLink);
        setErrorPurse(
            purseValues?.win.trim() === '' &&
            purseValues?.fight.trim() === '' &&
            purseValues?.bonus.trim() === '',
        );
        dispatch(
            setNewDocument(
                newDocument.map(doc => ({
                    name: doc.documentName,
                    type: doc.documentType,
                })),
            ),
        );
        dispatch(
            setChoosenDocument(
                choosenDocument.filter(doc => !doc.isCustom).map(doc => doc.id),
            ),
        );
        dispatch(setDueDateDocument(formattedDate));
        dispatch(setAddNewDocumentToProfile(shouldSaveDocumentToProfile));

        if (
            !event ||
            !mmaRule ||
            !fightLength ||
            !weightClass ||
            (!noTapologyLink && !opponentTapology) ||
            !purseValues
        ) {
            Alert.alert('Please fill all fields');
            return;
        }
        router.push('/offer/exclusive/create/due-date-single-bout');
    };

    return (
        <View style={styles.container}>
            <EventName event={event}/>
            <FighterForExclusiveOffer fighterChosen={fightersChosen}/>
            <RuleSelector
                mmaRule={mmaRule ?? 'Amateur'}
                setMmaRule={mmaRuleChoose => dispatch(setMmaRule(mmaRuleChoose))}
                selectedSportType={sportType}
            />
            <SportTypeSingleSelectDropdown
                selectedSportType={sportType}
                setSelectedSportType={st => dispatch(setSportType(st))}
            />
            <TitleFightSwitcher
                isTitleFight={isTitleFight ?? false}
                setIsTitleFight={isTitleFightChosen =>
                    dispatch(setIsTitleFight(isTitleFightChosen))
                }
            />
            <FightLengthPicker
                fightLength={fightLength || null}
                setFightLength={fl => dispatch(setFightLength(fl))}
            />
            <WeightClassComponent
                hasError={errorWeightClass}
                onSelect={weightClassChoosen =>
                    dispatch(setWeightClass(weightClassChoosen))
                }
            />
            <OpponentInfoSection
                mmaRule={mmaRule}
                title={sportType?.name}
                amDraw={amateurDraw ?? ''}
                amLoss={amateurLoss ?? ''}
                amWins={amateurWin ?? ''}
                hasSubmitted={hasSubmit}
                noTapologyLink={noTapologyLink}
                opponentName={opponentName}
                proDraw={proDraw ?? ''}
                proLoss={proLoss ?? ''}
                proWins={proWin ?? ''}
                opponentTapology={opponentTapology ?? ''}
                opponentAge={opponentAge ?? ''}
                opponentGender={opponentGender ?? ''}
                nationality={opponentNationality || null}
                setAmDraw={s => dispatch(setAmDraw(s))}
                setAmLoss={s => dispatch(setAmLoss(s))}
                setAmWins={s => dispatch(setAmWin(s))}
                setNoTapologyLink={setNoTapologyLink}
                setOpponentName={s => dispatch(setOpponentName(s))}
                setOpponentTapology={s => dispatch(setOpponentTapology(s))}
                setProDraw={s => dispatch(setProDraw(s))}
                setProLoss={s => dispatch(setProLoss(s))}
                setProWins={s => dispatch(setProWin(s))}
                setOpponentGender={s => dispatch(setOpponentGender(s))}
                setOpponentAge={s => dispatch(setOpponentAge(s))}
                setOpponentNationality={s => dispatch(setOpponentNationality(s))}
            />
            <Text style={styles.label}> Purse*</Text>
            <PurseExclusiveFightComponent
                currencyType={currency ?? 'EUR'}
                hasError={errorPurse}
                currentValues={purseValues}
                onConfirm={onConfirmPurse}
            />

            <BenefitBottomSheet
                benefitsChoosen={benefits}
                onConfirm={selectedBenefits => dispatch(setBenefits(selectedBenefits))}
            />
            <FloatingLabelInput
                label="Add More Info"
                value={addMoreInfo ?? ''}
                onChangeText={info => dispatch(setAddMoreInfo(info))}
                containerStyle={styles.inputContainer}
                multiline={true}
                maxLength={255}
            />

            <PromotionTailoringRequiredDocuments
                documents={documents}
                setDocuments={setDocuments}
                dueDate={dueDate}
                setDueDate={setDueDate}
                isDatePickerVisible={isDatePickerVisible}
                setDatePickerVisible={setDatePickerVisible}
                isSaveDocumentModalVisible={isSaveDocumentModalVisible}
                setSaveDocumentModalVisible={setSaveDocumentModalVisible}
                loading={loading}
                handleContinue={handleContinue}
            />
            {/* Continue Button */}
            <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                    if (documents.filter(doc => doc.isCustom).length > 0) {
                        setSaveDocumentModalVisible(true);
                    } else {
                        handleContinue(false);
                    }
                }}>
                <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    /** Основний контейнер */
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
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

    /** Випадаючі списки (Fight Length / Benefits) */
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

    /** Ввід для Purse */
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
        color: colors.primaryBlack,
    },

    /** Кнопка "Continue" */
    continueButton: {
        backgroundColor: colors.primaryBlack,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
        height: 56,
        justifyContent: 'center',
    },
    continueButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
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

    inputContainer: {
        marginBottom: 20,
    },
});
