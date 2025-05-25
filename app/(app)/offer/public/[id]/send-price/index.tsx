import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getFullInfoAboutFighter, sendFirstOfferAfterSelectedFighter,} from '@/service/service';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {CurrencyCode} from 'react-native-country-picker-modal';
import {DocumentRequiredResponse, FighterInfoResponse} from '@/service/response';
import {PublicOfferToSelectedFighterRequest} from '@/service/request';
import {formatDateForBackend} from "@/utils/utils";
import {PromotionTailoringRequiredDocuments} from "@/components/PromotionTailoringRequiredDocuments";
import {TailoringPurse} from "@/components/TailoringPurse";
import {FighterAndManagerHeader} from "@/components/FighterAndManagerHeader";
import {useLocalSearchParams, useRouter} from "expo-router";

const PromotionTailoringPriceAndDocumentScreen = () => {
    const insets = useSafeAreaInsets();
    const [fighter, setFighter] = useState<FighterInfoResponse | null>(null);
    const {fighterId, id, currency} = useLocalSearchParams<{
        fighterId: string;
        id: string;
        currency: CurrencyCode;
    }>();
    const router = useRouter();
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isSaveDocumentModalVisible, setSaveDocumentModalVisible] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [currencyChoosen, setCurrencyChoosen] = useState<CurrencyCode>('EUR');
    const [documents, setDocuments] = useState<DocumentRequiredResponse[]>([]);
    const [purseValues, setPurseValues] = useState({
        fight: '',
        win: '',
        bonus: '',
    });

    useEffect(() => {
        setLoading(true);
        getFullInfoAboutFighter(fighterId)
            .then(res => {
                setFighter(res);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [fighterId]);

    useEffect(() => {
        if (currency) {
            setCurrencyChoosen(currency);
        }
    }, [currency]);


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primaryGreen}/>
            </View>
        );
    }

    const handleContinue = (shouldSaveDocument: boolean) => {
        if (!purseValues.fight || !purseValues.win || !purseValues.bonus) {
            Alert.alert('Please fill in all purse values.');
            return;
        }

        if (!dueDate) {
            Alert.alert('Please select a due date.');
            return;
        }

        if (documents.length === 0) {
            Alert.alert('Please select at least one document.');
            return;
        }
        const choosenDocument = documents.filter(doc => doc.selected);
        const newDocument = documents.filter(doc => doc.isCustom && doc.selected);
        const formattedDate = dueDate
            ? formatDateForBackend(formatDate(dueDate))
            : null;
        if (!formattedDate) {
            Alert.alert('Please select a valid date.');
            return;
        }
        const data: PublicOfferToSelectedFighterRequest = {
            fighterId: fighterId,
            winPurse: purseValues.win,
            fightPurse: purseValues.fight,
            bonusPurse: purseValues.bonus,
            offerId:id,
            currency: currencyChoosen,
            newDocument: newDocument.map(doc => ({
                name: doc.documentName,
                type: doc.documentType,
            })),
            choosenDocument: choosenDocument
                .filter(doc => !doc.isCustom)
                .map(doc => doc.id),
            dueDate: formattedDate,
            addNewDocumentToProfile: shouldSaveDocument,
        };
        setLoading(true);
        sendFirstOfferAfterSelectedFighter(data)
            .then(() => {
                router.push({pathname: '/offer/public/success/selected-fighter', params: {name: fighter?.name}});
            })
            .catch(() => {
                Alert.alert('Error', 'Failed to save cuments.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const formatDate = (date: Date) => {
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.background}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <GoBackButton/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                <FighterAndManagerHeader fighter={fighter}/>

                <TailoringPurse
                    purseValues={purseValues}
                    setPurseValues={setPurseValues}
                    currencyChoosen={currencyChoosen}
                    setCurrencyChoosen={setCurrencyChoosen}
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

                <TouchableOpacity
                    style={styles.submitButton}
                    disabled={loading}
                    onPress={() => {
                        if (documents.filter(doc => doc.isCustom).length > 0) {
                            setSaveDocumentModalVisible(true);
                        } else {
                            handleContinue(false);
                        }
                    }}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white}/>
                    ) : (
                        <Text style={styles.submitButtonText}>Continue</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryBlack,
        marginRight: 5,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: colors.primaryBlack,
        backgroundColor: 'rgb(240, 240, 240)',
        height: 56,
    },
    countryPicker: {
        height: 56,
        borderRadius: 8,
        marginLeft: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.priceGray,
        color: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countryPickerCustomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.priceGray, // ваш колір
        borderRadius: 8,
        paddingHorizontal: 20,
        height: 56,
        justifyContent: 'center',
        marginLeft: 8,
    },
    countryPickerCustomText: {
        color: 'white', // колір тексту
        fontSize: 16,
    },

    addMoreDocumentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        backgroundColor: colors.gray,
        borderRadius: 8,
        padding: 14,
        marginBottom: 30,
        justifyContent: 'center',
        height: 56,
    },
    addMoreButtonText: {
        color: colors.white,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500',
    },
    documentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        marginBottom: 12,
    },
    documentLabel: {
        flex: 1,
        fontSize: 15,
        color: colors.primaryBlack,
    },
    removeText: {
        color: colors.primaryGreen,
        fontSize: 15,
    },
    submitButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        height: 56,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '500',
    },
});

export default PromotionTailoringPriceAndDocumentScreen;
