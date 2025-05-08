import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useRouter} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "@/styles/colors";


const SuccessRenewSubmissionScreen: React.FC = () => {
    const router = useRouter();
    const handleGetStarted = () => {
        router.push('/(app)/(tabs)')
    };

    return (
        <View style={styles.container}>
            {/* Галочка */}
            <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark" size={72} color="#FFFFFF" />
            </View>

            {/* Заголовок */}
            <Text style={styles.title}>Renewal Successful</Text>

            {/* Опис */}
            <Text style={styles.description}>
                Your submission has been renewed successfully!
            </Text>

            {/* Кнопка */}
            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SuccessRenewSubmissionScreen;

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
        backgroundColor: colors.primaryGreen,
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
        color: colors.primaryBlack,
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
        backgroundColor: colors.primaryGreen,
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
