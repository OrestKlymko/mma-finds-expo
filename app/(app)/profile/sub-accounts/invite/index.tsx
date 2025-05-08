import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import colors from '@/styles/colors';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import {generateInviteLink, getInformationPromotionById} from '@/service/service';
import {useRouter} from "expo-router";
import {Image} from "expo-image";
import {useAuth} from "@/context/AuthContext";

const InviteTeamOnPromotion = () => {
    const {entityId} = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [imageLink, setImageLink] = useState<string | null>(null);
    useEffect(() => {
        if (!entityId) return;
        getInformationPromotionById(entityId).then(promo => {
            setImageLink(promo.imageLink);
        })
    }, [entityId]);
    const handleSendInvitation = () => {
        if (!role || !email) {
            Alert.alert('Error', 'Please fill in the role field');
            return;
        }
        setLoading(true);
        const data = {
            email: email,
            role: role,
        };
        generateInviteLink(data)
            .then(() => {
                Alert.alert('Success', 'The invitation link has been sent');
                router.push('/(app)/(tabs)')
            })
            .catch(() => {
                Alert.alert('Error', 'Failed to send the invitation link');
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return (
        <View style={styles.container}>
            {/* Фото профілю */}
            <View style={styles.imageContainer}>
                {imageLink && (
                    <Image
                        source={{uri: imageLink}} // Заглушка
                        style={styles.profileImage}
                    />
                )}
            </View>

            {/* Основний заголовок */}
            <Text style={styles.mainTitle}>Invite Your Team!</Text>

            {/* Опис */}
            <Text style={styles.descriptionText}>
                The app generates links for team members{'\n'}
                to easily create their own accounts, enabling them{'\n'}
                to communicate with managers regarding tasks{'\n'}
                related to the given fight offer.
            </Text>

            {/* Відступ */}
            <View style={{height: 35}}/>
            <View style={styles.inputContainer}>
                <FloatingLabelInput
                    label={'Assign Role*'}
                    value={role}
                    onChangeText={setRole}
                />

                <FloatingLabelInput
                    label={'Email*'}
                    value={email}
                    onChangeText={setEmail}
                    containerStyle={styles.floatingLabel}
                />
            </View>
            {/* Кнопка */}
            <TouchableOpacity
                style={styles.createProfileButton}
                onPress={handleSendInvitation}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color={colors.white}/>
                ) : (
                    <Text style={styles.createProfileButtonText}>Send an Invite Link</Text>
                )}
            </TouchableOpacity>

            {/* Клікабельний текст */}
            <TouchableOpacity onPress={() => {
                router.push('/(app)/(tabs)')
            }}>
                <Text style={styles.clickableText}>Maybe Later</Text>
            </TouchableOpacity>
        </View>
    );
};

export default InviteTeamOnPromotion;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 24,
    },

    /* Фото профілю */
    imageContainer: {
        marginBottom: 20,
    },
    profileImage: {
        width: 114,
        height: 114,
        borderRadius: 57, // Робимо круглим
        backgroundColor: colors.gray,
    },

    /* Привітання */
    welcomeText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 18.75,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 8,
    },

    /* Основний заголовок */
    mainTitle: {
        fontFamily: 'Roboto',
        fontSize: 25,
        fontWeight: '500',
        lineHeight: 29.3,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 8,
    },

    /* Опис */
    descriptionText: {
        fontFamily: 'Roboto',
        fontSize: 14.5,
        fontWeight: '400',
        lineHeight: 19.34,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 5,
    },
    floatingLabel: {
        marginTop: 10,
    },
    /* Кнопка */
    createProfileButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        width: '100%',
    },
    createProfileButtonText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
        textAlign: 'center',
    },

    /* Клікабельний текст */
    clickableText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 18.75,
        textAlign: 'center',
        color: colors.gray,
    },

    inputContainer: {
        marginBottom: 15,
        width: '100%',
    },
});
