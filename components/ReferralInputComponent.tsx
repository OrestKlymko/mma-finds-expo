import {Alert, Share, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import * as Clipboard from 'expo-clipboard';
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "expo-router";
import colors from "@/styles/colors";

interface ReferralInputComponentProps {
    blackBackground?: boolean;
}

export function ReferralInputComponent({
                                           blackBackground,
                                       }: ReferralInputComponentProps) {
    const {entityId} = useAuth();
    const router = useRouter();
    const [referralLink, setReferralLink] = useState<string>('');
    useEffect(() => {
        if (!entityId) {
            router.push('/login')
            return;
        }
        createReferralLink(entityId).then(link => {
            if (link) {
                setReferralLink(link);
            } else {
                Alert.alert('Error', 'Failed to create referral link');
            }
        });
    }, [entityId]);
    /** Copy Link **/
    const handleCopyLink = () => {
        Clipboard.setStringAsync(referralLink);
        Alert.alert('Copied', 'Referral link copied to clipboard!');
    };

    // Приклад створення реферального лінку для запрошення
    const createReferralLink = async (userId: string) => {
        try {
            // const branchUniversalObject = await branch.createBranchUniversalObject(
            //     `invite/${userId}`,
            //     {
            //         title: 'Join and earn rewards!',
            //         contentDescription:
            //             'Sign up using my invite link and get bonus cash rewards.',
            //         contentMetadata: {
            //             customMetadata: {
            //                 userId, // ключ, який передаємо для відстеження
            //             },
            //         },
            //     },
            // );

            // // Додаткові налаштування лінку (якщо потрібно)
            // const linkProperties: BranchLinkProperties = {
            //     feature: 'invite',
            //     channel: 'referral',
            // };
            //
            // // Контрольні параметри можна використати для встановлення fallback URL або deep link URL
            // const controlParams: BranchLinkControlParams = {
            //     $fallback_url: 'https://yourapp.com', // Якщо апка не встановлена
            //     $ios_url: 'yourappscheme://invite',
            //     $android_url: 'yourappscheme://invite',
            // };

            // Генеруємо короткий лінк
            // const {url} = await branchUniversalObject.generateShortUrl(
            //     linkProperties,
            //     controlParams,
            // );
            // return url;
        } catch (error) {
            console.error('Error generating referral link:', error);
            return null;
        }
    };

    /** Share Link **/
    const handleShareLink = async () => {
        try {
            await Share.share({
                message: `Join me on this platform using my referral link: ${referralLink}`,
            });
        } catch (error) {
            console.error('Error sharing link:', error);
        }
    };

    return (
        <View style={styles.referralSection}>
            <Text
                style={[
                    styles.referralLabel,
                    {color: blackBackground ? '#FFFFFF' : '#131313'},
                ]}>
                Your Unique Referral Link
            </Text>
            <View style={styles.referralContainer}>
                <TextInput
                    style={styles.referralInput}
                    value={referralLink ? referralLink : ''}
                    editable={false}
                />
                <TouchableOpacity style={styles.iconButton} onPress={handleCopyLink}>
                    <Icon name="content-copy" size={20} color={colors.primaryBlack}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleShareLink}>
                    <Icon name="share-variant" size={20} color={colors.primaryBlack}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    /** Referral Section **/
    referralSection: {
        marginTop: 30,
        width: '100%',
        paddingHorizontal: 20,
    },
    referralLabel: {
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: '300',
        color: '#131313',
        marginBottom: 6,
    },
    referralContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    referralInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: '300',
        color: '#707070',
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.grayBackground,
        paddingVertical: 20,
        borderRadius: 8,
    },
    iconButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: colors.grayBackground,
        marginLeft: 5,
        paddingVertical: 19,
    },
});
