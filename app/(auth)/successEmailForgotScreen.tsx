import React, {useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Alert,
    ActivityIndicator,
} from 'react-native';
import colors from '../../styles/colors';
import {useRoute} from '@react-navigation/native';
import {requestOnForgotPassword} from "@/service/service";
import Ionicons from "@expo/vector-icons/Ionicons";
import FooterSignUp from "@/components/FooterSingUp";


interface EmailProps {
    email: string;
}

const SuccessEmailForgotScreen: React.FC = () => {
    const route = useRoute();
    const {email} = route.params as EmailProps;
    const [loading, setLoading] = useState(false);

    const handleMailSend = async () => {
        try {
            await Linking.openURL('mailto:');
        } catch (error) {
            Alert.alert('Error', 'Unable to open the email application');
        }
    };

    const handleResendLink = () => {
        setLoading(true);
        requestOnForgotPassword(email)
            .then(() => {
                Alert.alert('Success', 'The link has been sent to your email');
            })
            .catch(() => {
                Alert.alert('Error', 'The link has not been sent');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark" size={72} color="#FFFFFF" />
            </View>

            <Text style={styles.title}>Check Your Email</Text>

            <Text style={styles.description}>
                We have sent a reset password link{'\n'}
                to your registered email address.
            </Text>

            <TouchableOpacity style={styles.buttonGoToEmail} onPress={handleMailSend}>
                <Text style={styles.buttonText}>Go to Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonResendLink}
                onPress={handleResendLink}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                    <Text style={styles.buttonText}>Resend Link</Text>
                )}
            </TouchableOpacity>
            <FooterSignUp />
        </View>
    );
};

export default SuccessEmailForgotScreen;

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
    buttonGoToEmail: {
        backgroundColor: colors.primaryBlack,
        borderRadius: 8,
        paddingVertical: 17,
        paddingHorizontal: 32,
        marginBottom: 20,
        width: '100%',
    },

    buttonResendLink: {
        backgroundColor: colors.secondaryBlack,
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