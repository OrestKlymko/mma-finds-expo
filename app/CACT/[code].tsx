import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useRouter} from 'expo-router';
import colors from '@/styles/colors';

export default function Index() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* зелена галочка */}
            <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark" size={72} color="#FFFFFF"/>
            </View>

            <Text style={styles.title}>Hello!</Text>

            <Text style={styles.description}>
                The app is ready to use.{'\n'}
                Enjoy MMA Finds!
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(app)/(tabs)')}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
}

/* ========== styles ========== */
const styles = StyleSheet.create({
    center: {flex: 1, justifyContent: 'center', alignItems: 'center'},

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 24,
    },

    checkmarkContainer: {
        width: 144,
        height: 144,
        borderRadius: 72,
        backgroundColor: colors.primaryGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },

    title: {
        fontFamily: 'Roboto',
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 29.3,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 14,
    },

    description: {
        fontFamily: 'Roboto',
        fontSize: 16.5,
        fontWeight: '400',
        lineHeight: 19.34,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 40,
    },

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
