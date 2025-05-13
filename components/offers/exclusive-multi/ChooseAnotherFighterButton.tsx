import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import colors from '@/styles/colors';
import {useRouter} from "expo-router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {confirmFighterParticipationExclusive, confirmFighterParticipationMultiFight} from "@/service/service";
import {resetMultiOffer} from "@/store/createMultiContractOfferSlice";
import {resetExclusiveOffer} from "@/store/createExclusiveOfferSlice";

type ChooseAnotherFighterButtonProps = {
    type: 'Exclusive' | 'Public' | 'Multi-Fight',
    offerId: string
}
export const ChooseAnotherFighterButton = (
    {type, offerId}: ChooseAnotherFighterButtonProps
) => {
    const dispatch = useDispatch();
    const {fighterId: exclusiveFighterId} = useSelector((state: RootState) => state.createExclusiveOffer);
    const {fighterId: multiContractFighterId} = useSelector((state: RootState) => state.createMultiContractOffer);
    const router = useRouter();
    useEffect(() => {
        if (type === 'Exclusive' && exclusiveFighterId) {
            confirmFighterParticipationExclusive(offerId, exclusiveFighterId).then(() => {
                router.back();
                dispatch(resetExclusiveOffer());
            }
            )
        }
        if (type === 'Multi-Fight' && multiContractFighterId) {
            confirmFighterParticipationMultiFight(offerId, multiContractFighterId).then(() => {
                router.back();
                dispatch(resetMultiOffer());
            })
        }
    }, [exclusiveFighterId, multiContractFighterId, offerId, type]);

    return <TouchableOpacity
        style={styles.createProfileButton}
        onPress={() => {
            router.push({
                pathname: '/offer/exclusive/create/fighter', params: {
                    type: type
                }
            })
        }}>
        <Text style={styles.createProfileButtonText}>
            Choose Another Fighter
        </Text>
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    createProfileButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 20,
        marginTop: 20,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    createProfileButtonText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
        textAlign: 'center',
    },
});
