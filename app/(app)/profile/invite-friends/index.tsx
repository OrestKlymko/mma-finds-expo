import React from 'react';
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Team from '@/assets/team.svg';
import Question from '@/assets/question.svg';
import {useRouter} from "expo-router";
import colors from "@/styles/colors";
import {ReferralInputComponent} from "@/components/ReferralInputComponent";
import GoBackButton from "@/components/GoBackButton";
const InviteFriendsScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    return (
        <View style={{flex: 1}}>
            {/* Top Section with Image B  ackground */}
            <ImageBackground
                onLoadEnd={() => {
                }}
                source={require('@/assets/Invite.png')} // Replace with your image path
                style={[styles.imageBackground, {paddingTop: insets.top}]}
                resizeMode="cover">
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}>
                    <Icon name="chevron-left" size={24} color={colors.white} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>


                {/* Top Section Content */}
                <View style={styles.topSection}>
                    <Icon name="account-plus" size={72} color={colors.white} />
                    <Text style={styles.title}>Invite &amp; Earn</Text>
                    <Text style={styles.subtitle}>
                        Earn up to €500 in credits with Referrals!
                    </Text>
                    <Text style={styles.description}>
                        Referring new members to our platform gives you private rewards!
                        Whether you invite promotions or fighter representatives, you’ll
                        earn up to €50 in credits per referral to use on your future purchases.
                    </Text>

                    <ReferralInputComponent blackBackground={true} />
                </View>
            </ImageBackground>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <TouchableOpacity
                    style={styles.bottomItem}
                    onPress={() => router.push('/profile/invite-friends/conditions')}>
                    <Question height={24} width={24} color={colors.primaryBlack} />
                    <Text style={styles.bottomText}>How It Works</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.bottomItem}
                    onPress={() => router.push('/profile/invite-friends/list')}>
                    <Team height={24} width={24} color={colors.primaryBlack} />
                    <Text style={styles.bottomText}>Your Referrals</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default InviteFriendsScreen;

const styles = StyleSheet.create({
    /** Image Background **/
    imageBackground: {
        flex: 1,
        marginTop: -10,
        marginBottom: -30,
        justifyContent: 'center',
    },

    /** Back Button **/
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginLeft: 10,
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        fontFamily: 'Roboto',
        color: colors.white,
    },

    /** Top Section **/
    topSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 25,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.white,
        marginTop: 16,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.white,
        lineHeight: 18,
        marginTop: 5,
        textAlign: 'center',
    },
    description: {
        fontSize: 12,
        fontWeight: '400',
        paddingHorizontal: 20,
        fontFamily: 'Roboto',
        color: colors.white,
        marginTop: 15,
        textAlign: 'center',
        lineHeight: 15,
    },

    /** Bottom Sheet **/
    bottomSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 50,
        paddingTop: 40,
        paddingHorizontal: 30,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    bottomItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: colors.whiteGray,
    },
    bottomText: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
    },
});
