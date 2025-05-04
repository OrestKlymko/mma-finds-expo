import React from 'react';
import {ScrollView, StyleSheet, Text, View,} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Order from '@/assets/order.svg';
import Star from '@/assets/star.svg';
import GrowthGraph from '@/assets/growth-graph.svg';
import colors from '@/styles/colors';
import GoBackButton from "@/components/GoBackButton";

const HowItWorksScreenFeaturedOffers = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton/>
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
                    Boosting your Fight Offers&apos; is easy!{'\n'}
                    Just follow these simple steps:
                </Text>

                {/* Steps Section */}
                <View style={styles.stepsContainer}>
                    {/* Step 1: Invite Friends */}
                    <View style={styles.step}>
                        <View style={styles.iconContainer}>
                            <Order height={24} width={24} color={colors.gray} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>Choose an Offer</Text>
                            <Text style={styles.stepDescription}>
                                Select the fight offer you want to boost for better visibility.
                            </Text>
                        </View>
                    </View>

                    {/* Step 2: They Save */}
                    <View style={styles.step}>
                        <View style={styles.iconContainer}>
                            <Star height={24} width={24} color={colors.gray} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>Feature it</Text>
                            <Text style={styles.stepDescription}>
                                Click the &quot;Feature Your Offer&quot; button to make it stand
                                out.
                            </Text>
                        </View>
                    </View>

                    {/* Step 3: You Earn */}
                    <View style={styles.step}>
                        <View style={styles.iconContainer}>
                            <GrowthGraph height={24} width={24} color={colors.gray} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>Get More Exposure</Text>
                            <Text style={styles.stepDescription}>
                                Featured offers get priority placement, attracting top fighters
                                and better matchups.
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

export default HowItWorksScreenFeaturedOffers;
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
        marginBottom: 30,
        lineHeight: 20,
    },

    /** Steps Section **/
    stepsContainer: {},
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
        fontSize: 9,
        color: colors.primaryBlack,
        fontFamily: 'Roboto',
        fontWeight: '500',
        lineHeight: 11,
    },
    learnMoreText: {
        fontSize: 15,
        color: colors.primaryGreen,
        fontWeight: '600',
        textAlign: 'center',
    },
});
