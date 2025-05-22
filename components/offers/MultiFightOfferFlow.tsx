import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {getFullInfoAboutFighter} from '@/service/service';
import colors from '@/styles/colors';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import {SportTypeMultiChoose} from './SportTypeMultiChoose';
import {MultiWeightClassComponent} from './MultiWeightClassComponent';
import {useDispatch, useSelector} from 'react-redux';
import {
    setAddMoreInfo,
    setAddNewDocumentToProfile,
    setChoosenDocument,
    setDueDateDocument,
    setFighterName,
    setMonths,
    setNewDocument,
    setSportType,
    setWeightClass,
} from '@/store/createMultiContractOfferSlice';
import {RootState} from '@/store/store';
import {DocumentRequiredResponse, WeightClassResponse,} from '@/service/response';
import {ExclusivitySection} from './ExclusivitySection';
import {formatDate, formatDateForBackend} from '@/utils/utils';
import {useRouter} from "expo-router";
import {FighterForOffer} from "@/components/FighterForOffer";
import {NumberOfFightAndPurseSection} from "@/components/offers/NumberOfFightAndPurseSection";
import {PromotionTailoringRequiredDocuments} from "@/components/PromotionTailoringRequiredDocuments";

interface MultiFightOfferFlowProps {
    fighterId?: any;
    editMode?: boolean;
}

const MultiFightOfferFlow = ({fighterId}: MultiFightOfferFlowProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        fighterName,
        weightClass,
        sportType,
        months,
        purseValues,
        numberOfFights,
        currency,
        addMoreInfo,
        exclusivity,
        isExclusive,
    } = useSelector((state: RootState) => state.createMultiContractOffer);
    const [hasSubmit, setHasSubmit] = useState(false);
    const state = useSelector((state: RootState) => state.createMultiContractOffer);
    const [errorWeightClass, setErrorWeightClass] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isSaveDocumentModalVisible, setSaveDocumentModalVisible] =
        useState(false);
    const [documents, setDocuments] = useState<DocumentRequiredResponse[]>([]);
    const [dueDate, setDueDate] = useState<Date | null>(null);

    useEffect(() => {
        if (fighterId) {
            getFullInfoAboutFighter(fighterId).then(res => {
                dispatch(setFighterName(res.name));
            });
        }
    }, [fighterId]);

    const handleContinue = (shouldSaveDocumentToProfile: boolean) => {

        if (!state.fighterId) {
            Alert.alert('Please select a fighter.');
            return;
        }
        setHasSubmit(true);

        setErrorWeightClass(!weightClass);
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

        if (!weightClass  || !numberOfFights) {
            Alert.alert('Please fill all required fields');
            return;
        }
        router.push('/offer/exclusive/create/due-date-multi-fight');
    };

    return (
        <View>
            <FighterForOffer fighterName={fighterName} type="Multi-Fight" />

            <MultiWeightClassComponent
                hasError={errorWeightClass}
                onSelect={(item: WeightClassResponse[]) => {
                    dispatch(setWeightClass(item));
                    setErrorWeightClass(false);
                }}
            />

            <SportTypeMultiChoose
                hasSubmit={hasSubmit}
                selectedSportTypes={sportType ?? []}
                setSelectedSportTypes={selected => dispatch(setSportType(selected))}
            />

            <NumberOfFightAndPurseSection
                currency={currency}
                hasSubmit={hasSubmit}
                numberOfFights={numberOfFights}
                purseValues={purseValues}
            />

            <FloatingLabelInput
                label="Contract Duration (Months)*"
                value={months ?? ''}
                hasSubmitted={hasSubmit}
                isRequired={true}
                keyboardType="numeric"
                onChangeText={month => dispatch(setMonths(month))}
                containerStyle={styles.inputContainer}
            />

            <FloatingLabelInput
                label="Add More Info"
                value={addMoreInfo ?? ''}
                onChangeText={text => dispatch(setAddMoreInfo(text))}
                containerStyle={styles.inputContainer}
                maxLength={255}
            />
            <ExclusivitySection exclusivity={exclusivity} isExclusive={isExclusive} />

            <PromotionTailoringRequiredDocuments
                documents={documents}
                setDocuments={setDocuments}
                dueDate={dueDate}
                setDueDate={setDueDate}
                isDatePickerVisible={isDatePickerVisible}
                setDatePickerVisible={setDatePickerVisible}
                isSaveDocumentModalVisible={isSaveDocumentModalVisible}
                setSaveDocumentModalVisible={setSaveDocumentModalVisible}
                loading={false}
                handleContinue={handleContinue}
            />

            <TouchableOpacity style={styles.continueButton} onPress={()=>{
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
};

export default MultiFightOfferFlow;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingBottom: 60,
    },
    label: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 8,
    },
    inputContainer: {
        marginBottom: 20,
        height: 56,
    },
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
});
