import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/styles/colors';
import ConfettiCannon from 'react-native-confetti-cannon';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const SuccessFighterChosenForOfferScreen: React.FC = () => {
    const router = useRouter();
    const confettiRef = useRef<any>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const lottieRef = useRef<LottieView>(null);

    useEffect(() => {
        // Play checkmark animation once
        lottieRef.current?.play();
        // Fire confetti
        setShowConfetti(true);
    }, []);

    return (
        <View style={styles.container}>
            {/* Lottie Checkmark */}
            <View style={styles.lottieContainer}>
                <LottieView
                    ref={lottieRef}
                    source={require('@/assets/lottie/success.json')}
                    loop={false}
                    autoPlay={false}
                    style={styles.lottie}
                />
            </View>

            {/* Confetti */}
            {showConfetti && (
                <ConfettiCannon
                    count={150}
                    origin={{ x: width / 2, y: 0 }}
                    fadeOut={true}
                    autoStart={true}
                    explosionSpeed={350}
                    fallSpeed={3000}
                    onAnimationEnd={() => setShowConfetti(false)}
                />
            )}

            {/* Title */}
            <Text style={styles.title}>Success!</Text>

            {/* Description */}
            <Text style={styles.description}>
                You have successfully chosen a fighter for the offer and featured them at the top positions.
            </Text>

            {/* Continue Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(app)/(tabs)')}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SuccessFighterChosenForOfferScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 24,
    },
    lottieContainer: {
        width: 160,
        height: 160,
        marginBottom: 32,
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.primaryBlack,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    button: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        height:56
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
