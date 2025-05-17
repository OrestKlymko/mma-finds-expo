import React, {useCallback, useMemo, useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View,} from 'react-native';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useRoute} from '@react-navigation/native';

import {useDispatch} from 'react-redux';
import {resetMultiOffer as MultiContractReset} from '@/store/createMultiContractOfferSlice';
import {ContractTypeButton} from "@/components/offers/ContractTypeButton";
import {SingleBoutOfferFlow} from "@/components/offers/SingleBoutOfferFlow";
import MultiFightOfferFlow from "@/components/offers/MultiFightOfferFlow";

const CreateExclusiveOfferScreen = () => {
    const dispatch = useDispatch();
    const clearReduxState = () => {
        dispatch(MultiContractReset());
    };

    const [contractType, setContractType] = useState<
        'Single Bout' | 'Multi-Fight'
    >('Single Bout');
    const route = useRoute();
    const {eventId, fighterId} = route.params as {
        eventId: string;
        fighterId: string;
    };

    const offerTypes = useMemo(() => ['Single Bout', 'Multi-Fight'], []);

    const handleInfoPress = useCallback((rule: string) => {
        Alert.alert(
            rule === 'Single Bout'
                ? 'Create a fight offer for one specific matchup with a pre-selected opponent.'
                : 'Create a fight offer for multiple matchups within your promotion.',
        );
    }, []);

    const contractTypeButtons = useMemo(() => {
        return offerTypes.map(rule => {
            const isActive = contractType === rule;
            return (
                <ContractTypeButton
                    key={rule}
                    rule={rule}
                    isActive={isActive}
                    onPress={() => setContractType(rule as 'Single Bout' | 'Multi-Fight')}
                    onInfoPress={() => handleInfoPress(rule)}
                />
            );
        });
    }, [contractType, handleInfoPress, offerTypes]);

    const formComponent = useMemo(() => {
        return contractType === 'Single Bout' ? (
            <SingleBoutOfferFlow eventId={eventId} fighterId={fighterId} />
        ) : (
            <MultiFightOfferFlow fighterId={fighterId} />
        );
    }, [contractType, eventId, fighterId]);

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{flex: 1, backgroundColor: colors.background}}>
                <GoBackButton onPress={clearReduxState} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Exclusive Fight Offer</Text>

                    <Text style={styles.label}>Type of offer*</Text>
                    <View style={styles.buttonGroup}>{contractTypeButtons}</View>
                    {formComponent}
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

export default CreateExclusiveOfferScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingBottom: 60,
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 50,
        color: colors.primaryBlack,
    },
    label: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 8,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    ruleButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.grayBackground,
        backgroundColor: colors.grayBackground,
        borderRadius: 8,
        marginRight: 8,
        height: 56,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    ruleButtonActive: {
        backgroundColor: colors.primaryGreen,
        borderColor: colors.primaryBlack,
    },
    ruleButtonText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '400',
        justifyContent: 'space-between',
        color: colors.primaryBlack,
    },
    ruleButtonTextActive: {
        color: colors.white,
        fontWeight: '500',
    },
});
