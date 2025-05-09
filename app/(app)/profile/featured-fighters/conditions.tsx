import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HowItWorksScreenInviteFriends = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingTop: insets.top, paddingBottom: insets.bottom},
                ]}>
                {/* Title Section */}
                <Text style={styles.title}>How It Works</Text>
                <Text style={styles.subtitle}>
                    Boosting your fighter&apos;s visibility is simple!{'\n'}
                    Just follow these straightforward steps:
                </Text>

                {/* Steps Section */}
                <View style={styles.stepsContainer}>
                    {/* Step 1: Invite Friends */}
                    <View style={styles.step}>
                        <View style={styles.iconContainer}>
                            <Icon
                                name="account-group"
                                size={24}
                                color={colors.primaryBlack}
                            />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>Choose Offer</Text>
                            <Text style={styles.stepDescription}>
                                Select the fight offer where you&apos;ve submitted your fighter that
                                you would like to feature.
                            </Text>
                        </View>
                    </View>

                    {/* Step 2: They Save */}
                    <View style={styles.step}>
                        <View style={styles.iconContainer}>
                            <Icon name="tag" size={24} color={colors.primaryBlack} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>Feature Your Fighter</Text>
                            <Text style={styles.stepDescription}>
                                Click the &apos;Feature Your Fighter&apos; button on the selected offer.
                            </Text>
                        </View>
                    </View>

                    {/* Step 3: You Earn */}
                    <View style={styles.step}>
                        <View style={styles.iconContainer}>
                            <Icon
                                name="ticket-percent"
                                size={24}
                                color={colors.primaryBlack}
                            />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>Enhance Visibility</Text>
                            <Text style={styles.stepDescription}>
                                Experience enhanced visibility and increased chances of
                                selection for your fighter with our featuring option.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default HowItWorksScreenInviteFriends;
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        padding: 24,
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
    stepsContainer: {
        marginBottom: 24,
    },
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
});
