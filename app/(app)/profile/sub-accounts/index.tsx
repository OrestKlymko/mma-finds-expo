import React, {useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getEmployees} from '@/service/service';
import {Image} from "expo-image";
import GoBackButton from "@/components/GoBackButton";
import {useFocusEffect, useRouter} from "expo-router";
import {EmployeeInfo} from "@/service/response";


const SubAccountsScreen = () => {
    const [subAccounts, setSubAccounts] = useState<EmployeeInfo[]>([]);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const handleInviteSubAccount = () => {
        router.push({pathname:'/profile/sub-accounts/invite',params:{

            }});
    };

    useFocusEffect(
        React.useCallback(() => {
            getEmployees().then(res => {
                setSubAccounts(res);
            });
        }, []),
    );

    return (
        <View style={{flex:1,backgroundColor:colors.background}}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.containerStyle,
                    { paddingBottom: insets.bottom},
                ]}>

                <View style={styles.container}>
                    {/* Title */}
                    <Text style={styles.header}>Sub-Accounts</Text>
                    <Text style={styles.description}>
                        Efficiently manage all fight-related tasks and improve tracking
                        efficiency within your organization using our comprehensive platform.
                    </Text>

                    {/* Sub-Accounts List */}
                    {subAccounts.map(account => (
                        <TouchableOpacity
                            key={account.id}
                            style={styles.subAccountCard}
                            onPress={() =>console.log('SubAccount', account.id)
                                // navigation.navigate('SubAccountTask', {
                                //     id: account.id,
                                //     name: account.name,
                                //     role: account.role,
                                //     imageLink: account.imageLink,
                                // })
                            }>
                            <View style={{flexDirection: 'row',alignItems:'center'}}>
                                <Image
                                    source={{uri: account.imageLink}}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        marginRight: 15,
                                    }}
                                />
                                <View>
                                    <Text style={styles.subAccountName}>{account.name}</Text>
                                    <Text style={styles.subAccountRole}>
                                        Job Function: {account.role}
                                    </Text>
                                </View>
                            </View>
                            <Icon name="chevron-right" size={30} color={colors.primaryGreen} />
                        </TouchableOpacity>
                    ))}

                    {/* Invite Button */}
                    <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={handleInviteSubAccount}>
                        <Text style={styles.inviteButtonText}>Invite Sub-Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default SubAccountsScreen;

const styles = StyleSheet.create({
    containerStyle: {
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    container: {
        alignItems: 'center',
    },

    /** Back Button **/
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    backText: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginLeft: 8,
    },

    /** Header **/
    header: {
        fontSize: 25,
        fontWeight: '500',
        fontFamily: 'Roboto',
        marginBottom: 20,
        marginTop: 50,
        color: colors.primaryBlack,
        textAlign: 'center',
    },

    description: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 24,
        paddingHorizontal: 12,
    },

    /** Sub-Account Card **/
    subAccountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 24,
        borderRadius: 8,
        padding: 14,
        paddingVertical: 24,
        marginBottom: 12,
        width: '100%',
    },
    subAccountName: {
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'Roboto',
        lineHeight: 18,
        color: colors.primaryGreen,
    },
    subAccountRole: {
        fontSize: 12,
        color: colors.primaryBlack,
        fontFamily: 'Roboto',
        fontWeight: '500',
        marginTop: 4,
    },

    /** Invite Button **/
    inviteButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
        height: 56,
        justifyContent: 'center',
    },
    inviteButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },

    /** Remaining Sub-Accounts **/
    remainingAccounts: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Roboto',
        color: colors.secondaryBlack,
        marginTop: 12,
    },
});
