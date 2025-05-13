import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    View,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {useAuth} from '@/context/AuthContext';
import {VerificationButton} from '@/components/VerificationButton';
import {useRouter} from "expo-router";

const AccountInfoScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const {methodAuth} = useAuth();

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

                <Text style={styles.headerTitle}>Account Info</Text>

                {/* Account Sections */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.content}>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => router.push('/profile/settings/account/account-info/account-details')}>
                        <Text style={styles.itemText}>Change Account Details</Text>
                        <Icon name="chevron-right" size={20} color={colors.gray}/>
                    </TouchableOpacity>

                    {methodAuth === 'standard' && (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => router.push('/profile/settings/account/account-info/change-password')}>
                            <Text style={styles.itemText}>Change Password</Text>
                            <Icon name="chevron-right" size={20} color={colors.gray}/>
                        </TouchableOpacity>
                    )}
                    <VerificationButton/>
                </ScrollView>
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

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: colors.white,
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
});

export default AccountInfoScreen;
