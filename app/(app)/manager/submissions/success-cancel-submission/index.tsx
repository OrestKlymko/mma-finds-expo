import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {useRouter} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "@/styles/colors";

const SuccessCancelSubmissionScreen = () => {
    const router = useRouter();
    const handleGetStarted = () => {
        router.push('/(app)/(tabs)')
    };

    return (
        <View style={styles.container}>
            {/* Галочка */}
            <View style={styles.checkmarkContainer}>
                <Ionicons name="close" color={colors.white} size={100} />
            </View>

            {/* Заголовок */}
            <Text style={styles.title}>Submission Canceled</Text>

            {/* Опис */}
            <Text style={styles.description}>
                Submission has been officially canceled. The promotion team will be
                notified accordingly. Thank you for your confirmation.
            </Text>

            {/* Кнопка */}
            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
        </View>
    );
}
export default SuccessCancelSubmissionScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 24,
    },

    /** Галочка */
    checkmarkContainer: {
        width: 144,
        height: 144,
        borderRadius: 72,
        backgroundColor: colors.darkError,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },

    /** Заголовок */
    title: {
        fontFamily: 'Roboto',
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 29.3,
        textAlign: 'center',
        color: colors.darkError,
        marginBottom: 14,
    },

    /** Опис */
    description: {
        fontFamily: 'Roboto',
        fontSize: 16.5,
        fontWeight: '400',
        lineHeight: 19.34,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 40,
    },

    /** Кнопка */
    button: {
        backgroundColor: colors.secondaryBlack,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 32,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },

    buttonText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 18.75,
        textAlign: 'center',
        color: '#FFFFFF',
    },
});
