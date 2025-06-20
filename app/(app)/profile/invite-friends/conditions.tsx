import React from 'react';
import {ScrollView, StyleSheet, Text, View,} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Friends from '@/assets/friends.svg';
import Discount from '@/assets/discount.svg';
import Money from '@/assets/money.svg';
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";

const HowItWorksScreenInviteFriends = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton shouldGoBack={true}/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                {/* Title Section */}
                <Text style={styles.title}>How It Works</Text>
                <Text style={styles.subtitle}>
                    Earning with referrals is easy!{'\n'}
                    Just follow these simple steps:
                </Text>

                {/* Steps Section */}
                <View>
                    {/* Step 1: Invite Friends */}
                    <View style={styles.step}>
                        <View style={styles.iconContainer}>
                            <Friends height={24} width={24} color={colors.gray} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>Invite Users</Text>
                            <Text style={styles.stepDescription}>
                                Share your unique invite link with fight promotions and fighter representatives to bring
                                them into MMA Finds.
                            </Text>
                        </View>
                    </View>

                    {/* Step 2: They Save */}
                    <View style={styles.step}>
                        <View style={styles.iconContainer}>
                            <Discount height={24} width={24} color={colors.gray} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>They Save</Text>
                            <Text style={styles.stepDescription}>
                                When your invites sign up, they will get a 10% discount on their
                                first purchase.
                            </Text>
                        </View>
                    </View>

                    {/* Step 3: You Earn */}
                    <View style={styles.step}>
                        <View style={styles.iconContainer}>
                            <Money height={24} width={24} color={colors.gray} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>You Earn</Text>
                            <Text style={styles.stepDescription}>
                                After their first purchase, you’ll receive MMA Finds Credits based on the amount they
                                spend, which you can use on your future purchases.
                            </Text>
                        </View>
                    </View>
                </View>
                {/*<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>*/}
                {/*  <Text style={styles.learnMoreText}>Learn More</Text>*/}
                {/*  <Icon name="chevron-right" size={20} color={colors.primaryGreen} />*/}
                {/*</TouchableOpacity>*/}
            </ScrollView>
        </View>
    );
};

export default HowItWorksScreenInviteFriends;
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },

    /** Title Section **/
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginTop: 50,
        lineHeight: 30,
        fontFamily: 'Roboto',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 20,
    },

    /** Steps Section **/
    step: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    iconContainer: {
        width: 52,
        height: 54,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    stepTextContainer: {
        borderLeftWidth: 1,
        borderLeftColor: colors.lightGray,
        paddingHorizontal: 16,
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.primaryGreen,
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 11,
        color: colors.primaryBlack,
        fontFamily: 'Roboto',
        fontWeight: '500',
        lineHeight: 18,
    },
    learnMoreText: {
        color: colors.primaryGreen,
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
});
