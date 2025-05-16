import React, {useState} from 'react';
import {Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from "@/styles/colors";
import GoBackButton from "@/components/GoBackButton";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "expo-router";

const AccountScreen = () => {
    const insets = useSafeAreaInsets();
    const {setToken, setRole, setMethodAuth} = useAuth();
    const router = useRouter();
    const [isSignOutVisible, setSignOutVisible] = useState(false);

    const handleSignOut = async () => {
        setRole(null);
        setToken(null);
        setMethodAuth(null);
        setSignOutVisible(false);
        router.push('/login');
    };

    const openSignOutSheet = () => setSignOutVisible(true);
    const closeSignOutSheet = () => setSignOutVisible(false);

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                {/* Header */}
                <Text style={styles.headerTitle}>Account</Text>

                {/* Account Sections */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.content}>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => router.push('/(app)/profile/settings/account/account-info')}>
                        <Text style={styles.itemText}>Account Info</Text>
                        <Icon name="chevron-right" size={20} color={colors.gray}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => router.push('/profile/settings/payment')}>
                        <Text style={styles.itemText}>Payment Methods</Text>
                        <Icon name="chevron-right" size={20} color={colors.gray}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => router.push('/(app)/profile/settings/account/account-management')}>
                        <Text style={styles.itemText}>Account Management</Text>
                        <Icon name="chevron-right" size={20} color={colors.gray}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.itemLast} onPress={openSignOutSheet}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Bottom Sheet for Sign Out Confirmation */}
                <Modal
                    visible={isSignOutVisible}
                    animationType="fade"
                    transparent
                    onRequestClose={closeSignOutSheet}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.bottomSheet}>
                            <Icon
                                name="logout"
                                size={50}
                                color={colors.primaryBlack}
                                style={styles.modalIcon}
                            />
                            <Text style={styles.modalTitle}>
                                Are you sure you want to sign out?
                            </Text>
                            <Text style={styles.modalDescription}>
                                You will be signed out of your account and{'\n'}
                                will need to sign in again to access {'\n'}
                                your personalized profile.
                            </Text>

                            <TouchableOpacity
                                style={styles.staySignedInButton}
                                onPress={closeSignOutSheet}>
                                <Text style={styles.staySignedInText}>Stay Signed In</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.signOutButton}
                                onPress={handleSignOut}>
                                <Text style={styles.signOutButtonText}>Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

export default AccountScreen;
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 38,
    },

    headerTitle: {
        fontSize: 25,
        fontWeight: '500',
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
        lineHeight: 30,
        textAlign: 'center',
        marginBottom: 20,
    },

    content: {},

    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        paddingHorizontal: 10,
    },
    itemLast: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 10,
    },

    itemText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
    },

    signOutText: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Roboto',
        color: '#980909',
    },

    /** MODAL **/
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },

    bottomSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 40,
        paddingHorizontal: 40,
        padding: 24,
        alignItems: 'center',
    },

    modalIcon: {
        marginBottom: 20,
    },

    modalTitle: {
        fontSize: 25,
        fontWeight: '500',
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 16,
    },

    modalDescription: {
        fontSize: 16.5,
        fontWeight: '400',
        fontFamily: 'Roboto',
        lineHeight: 19.3,
        color: colors.gray,
        textAlign: 'center',
        marginBottom: 40,
    },

    staySignedInButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        width: '100%',
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 8,
    },

    staySignedInText: {
        color: colors.white,
        fontFamily: 'Roboto',
        fontSize: 16,
        paddingVertical: 8,

        fontWeight: '500',
    },

    signOutButton: {
        backgroundColor: 'transparent',
        width: '100%',
        paddingVertical: 12,
        alignItems: 'center',
    },

    signOutButtonText: {
        color: '#980909',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '400',
    },
});
