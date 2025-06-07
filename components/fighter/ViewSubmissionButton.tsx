import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import React from 'react';
import colors from "@/styles/colors";
import {useRouter} from "expo-router";



type ViewSubmissionButtonProps = {
    fighterId: string;
}

export const ViewSubmissionButton = (
    {fighterId}: ViewSubmissionButtonProps,
) => {
    const router = useRouter();

    const handleSelectFighter = () => {
        router.push(`/(app)/manager/submissions/submission-of-fighter/${fighterId}`);
    };

    return (
        <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectFighter}>
                <Text style={styles.selectButtonText}>View Submissions</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    selectButton: {
        flex: 1,
        backgroundColor: colors.primaryGreen,
        paddingVertical: 17,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
        height: 56,
        justifyContent: 'center',
    },
    selectButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        fontFamily: 'Roboto',
    },
});
