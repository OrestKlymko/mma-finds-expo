import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import {useRouter} from "expo-router";


const SuccessCreatePublicOfferScreen: React.FC = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Галочка */}
            <View style={styles.checkmarkContainer}>
                <Icon name="check" size={72} color="#FFFFFF" />
            </View>

            <Text style={styles.title}>
                Your Fight Offer is Live!
            </Text>

            <Text style={styles.description}>
                Your fight offer has been successfully published. Get ready to receive submissions from fighter representatives!
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(app)/(tabs)/feed')}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SuccessCreatePublicOfferScreen;

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
        color: colors.primaryGreen,
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
        paddingVertical: 17,
        paddingHorizontal: 32,
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
