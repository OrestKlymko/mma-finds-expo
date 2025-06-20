import React, {useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
    KeyboardAvoidingView, ActivityIndicator,
} from "react-native";
import colors from "@/styles/colors";
import {Image} from "expo-image";
import GoBackButton from "@/components/GoBackButton";
import {generateVerificationCode} from "@/service/service";
import {useRouter} from "expo-router";

// ‼️ Common personal e‑mail providers that are NOT allowed
const PERSONAL_DOMAINS = [
    // "gmail.com",
    "googlemail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
    "aol.com",
    "mail.ru",
];

/**
 * Returns true only for corporate / custom domains.
 */
const isBusinessEmail = (email: string): boolean => {
    const match = email.match(/^([\w.+-]+)@([\w.-]+)$/i);
    if (!match) return false;
    const domain = match[2].toLowerCase();
    return !PERSONAL_DOMAINS.includes(domain);
};

export default function VerificationPromotionEmailScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim()) {
            setError("Email is required.");
            return;
        }
        if (!isBusinessEmail(email)) {
            setError("Please enter a valid business email (no gmail/outlook etc.).");
            return;
        }

        setError(null);
        const request = {
            email: email.trim().toLowerCase(),
        }
        setLoading(true);
        generateVerificationCode(request).then(
            () => {
                Alert.alert("Email submitted", "Check your inbox or spam – we've sent you a verification code.");
                setEmail("");
                router.push('/profile/settings/account/account-info')
            }
        ).catch((err) => {
            console.error("Error sending verification code:", err);
            Alert.alert("Error", "Could not send verification code. Please try again later.");
        }).finally(() => setLoading(false))


    };

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton/>
            <View style={styles.checkmarkContainer}>
                <Image
                    source={require('@/assets/verify.png')}
                    style={styles.icon}
                />
            </View>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >

                <Text style={styles.title}>Verify your organisation</Text>

                {/* Steps box */}
                <View style={styles.stepsBox}>
                    <Text style={styles.step}>1. Enter your <Text style={styles.bold}>business e‑mail</Text>.</Text>
                    <Text style={styles.step}>2. We send you a unique verification code.</Text>
                    <Text style={styles.step}>3. Paste the code in the next screen to finish.</Text>
                </View>

                {/* Email input */}
                <TextInput
                    style={[styles.input, error && styles.inputError]}
                    placeholder="name@yourcompany.com"
                    placeholderTextColor={colors.gray}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                {error && <Text style={styles.error}>{error}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    {
                        loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Send Verification Code</Text>
                        )
                    }
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
        backgroundColor: colors.white,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.primaryBlack,
        marginBottom: 18,
    },
    stepsBox: {
        marginBottom: 22,
        backgroundColor: colors.grayBackground,
        borderRadius: 8,
        padding: 12,
    },
    step: {
        fontSize: 14,
        color: colors.secondaryBlack,
        lineHeight: 20,
        marginBottom: 4,
    },
    bold: {
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.primaryBlack,
        backgroundColor: "#F9F9F9",
    },
    inputError: {
        borderColor: colors.error,
    },
    error: {
        color: colors.error,
        marginTop: 6,
    },
    button: {
        marginTop: 24,
        backgroundColor: colors.primaryGreen,
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "700",
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
        alignSelf: 'center',
        marginTop: 40,
    },

    /** Іконка */
    icon: {
        width: 163,
        height: 163,
    },
});
