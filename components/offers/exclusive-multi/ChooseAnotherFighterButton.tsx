import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {useRouter} from "expo-router";

type ChooseAnotherFighterButtonProps = {
    type: 'Exclusive' | 'Public' | 'Multi-fight';
}
export const ChooseAnotherFighterButton = (
    {type}: ChooseAnotherFighterButtonProps
) => {
    const router = useRouter();
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
