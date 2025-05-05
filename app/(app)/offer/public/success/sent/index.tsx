import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useRouter} from "expo-router";

const SuccessPublicOfferSent: React.FC = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.checkmarkContainer}>
                <Icon name="check" size={72} color="#FFFFFF"/>
            </View>

            <Text style={styles.title}>Thank You!</Text>

            <Text style={styles.description}>
                Your requested purse has been sent.{'\n'}
                We will notify you once they respond.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(app)/(tabs)')}>
                <Text style={styles.buttonText}>Back Home</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SuccessPublicOfferSent;

const styles = StyleSheet.create({
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
