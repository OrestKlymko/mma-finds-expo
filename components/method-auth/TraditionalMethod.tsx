import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React from 'react';
import {SignUpDataManager, SignUpDataPromotion} from "@/models/model";
import {useRouter} from "expo-router";
import colors from "@/styles/colors";

type TraditionalMethodProps = {
    data: SignUpDataPromotion | SignUpDataManager;
    role: 'MANAGER' | 'PROMOTION';
};

export const TraditionalMethod = ({data, role}: TraditionalMethodProps) => {
    const router = useRouter()
    return (
        <TouchableOpacity
            style={[styles.signUpButton]}
            onPress={() => {
                router.push({
                    pathname: '/sign-up/method/traditional',
                    params: {
                        data: JSON.stringify(data),
                        role: role,
                    },
                });
            }}>
            <>
                <Icon
                    name="email-outline"
                    size={24}
                    color={colors.primaryBlack}
                    style={{marginRight: 10}}
                />
                <Text style={styles.signUpButtonText}>Sign up with Email</Text>
            </>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    signUpButton: {
        backgroundColor: colors.white,
        borderRadius: 9,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primaryBlack,
        flexDirection: 'row',
        height: 56,
    },
    signUpButtonText: {
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.primaryBlack,
    },
});
