import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import {useRouter} from "expo-router";

const SuccessToppedPublicOfferScreen: React.FC = () => {
const router = useRouter();
    return (
        <View style={styles.container}>

            <View style={styles.checkmarkContainer}>
                <Icon name="check" size={72} color="#FFFFFF" />
            </View>

            <Text style={styles.title}>Offer Successfully Featured!</Text>

            <Text style={styles.description}>
                Your offer has been boosted and now shines at the top!
            </Text>

            <TouchableOpacity style={styles.button} onPress={() => {
                router.push('/(app)/(tabs)');
            }}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SuccessToppedPublicOfferScreen;

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
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 14,
    },
    description: {
        fontFamily: 'Roboto',
        fontSize: 16.5,
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
        textAlign: 'center',
        color: '#FFFFFF',
    },
});
