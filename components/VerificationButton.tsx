import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import React from 'react';
import {useRouter} from "expo-router";

export const VerificationButton = () => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.item}
            onPress={() => {
                router.push('/profile/settings/account/account-info/verification')
            }
            }>
            <Text style={styles.itemText}>Account Verification</Text>
            <Icon name="chevron-right" size={20} color={colors.gray} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        paddingHorizontal: 10,
    },
    itemText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
    },
});
