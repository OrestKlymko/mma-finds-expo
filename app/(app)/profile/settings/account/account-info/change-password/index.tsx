import React, {useState} from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '@/styles/colors';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import {changePassword} from '@/service/service';
import GoBackButton from '@/components/GoBackButton';
import PasswordInputSection from "@/components/method-auth/PasswordInputSection";
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useRouter} from "expo-router";

const ChangePasswordScreen: React.FC = () => {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const insets = useSafeAreaInsets();

    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const handleResetPassword = () => {
        if (!isPasswordValid) {
            Alert.alert(
                'Invalid Password',
                'Please check the password requirements.',
            );
            return;
        }

        const data = {
            currentPassword,
            newPassword: password,
        };
        setLoading(true);
        changePassword(data)
            .then(() => {
                Alert.alert('Success', 'Your password has been updated successfully.');
                router.back();
            })
            .catch(error => {
                Alert.alert(
                    'Error',
                    'Failed to update password. Check your current password.',
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (

        <View style={{flex: 1, backgroundColor: colors.background}}><GoBackButton/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                {/* Back Button */}

                <Text style={styles.title}>Change Password</Text>
                <Text style={styles.subtitle}>
                    Update your password for enhanced account security.
                </Text>

                <View style={styles.passwordRow}>
                    <FloatingLabelInput
                        label="Current Password*"
                        value={currentPassword}
                        onChangeText={text => {
                            setCurrentPassword(text);
                        }}
                        secureTextEntry={!confirmVisible}
                        containerStyle={styles.floatingPasswordContainer}
                    />
                    <TouchableOpacity
                        style={styles.eyeIconButton}
                        onPress={() => setConfirmVisible(!confirmVisible)}>
                        <Icon
                            name={confirmVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color={colors.primaryBlack}
                        />
                    </TouchableOpacity>
                </View>
                <PasswordInputSection
                    titleFirst="New Password*"
                    onValidationChange={setIsPasswordValid}
                    onPasswordChange={setPassword}
                />

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleResetPassword}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={colors.white} size="small"/>
                    ) : (
                        <Text style={styles.confirmButtonText}>Change Password</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 38,
    },
    title: {
        fontSize: 25,
        fontFamily: 'Roboto',
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 50,
        textAlign: 'center',
        color: colors.primaryBlack,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: '400',
        marginBottom: 15,
        color: colors.primaryBlack,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.primaryBlack,
        borderRadius: 9,
        fontSize: 16,
        padding: 10,
        textAlign: 'center',
        marginBottom: 20,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    floatingPasswordContainer: {
        flex: 1,
    },
    eyeIconButton: {
        position: 'absolute',
        right: 10,
    },
    errorText: {
        fontSize: 12,
        color: colors.error,
        marginBottom: 10,
    },
    confirmButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 9,
        paddingVertical: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
    },
});

export default ChangePasswordScreen;
