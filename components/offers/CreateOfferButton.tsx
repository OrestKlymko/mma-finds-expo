import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '@/styles/colors';
import {useRouter} from "expo-router";

interface CreateOfferButtonProps {
    selectedTab: string;
}

export const CreateOfferButton = ({selectedTab}: CreateOfferButtonProps) => {
    const router = useRouter();

    return selectedTab === 'Public' ? (
        <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
                router.push('/offer/public/create')
            }}>
            <Text style={styles.createButtonText}>Create Public Offer</Text>
        </TouchableOpacity>
    ) : (
        <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
                router.push('/offer/exclusive/create')
            }}>
            <Text style={styles.createButtonText}>Create Private Offer</Text>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    createButton: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 8,
        height: 56,
        justifyContent: 'center',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
});
