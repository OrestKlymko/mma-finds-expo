import React from 'react';
import {ScrollView, StyleSheet, Text, View,} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";
import { ReferralInputComponent } from '@/components/ReferralInputComponent';


const YourReferralsScreen = () => {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
                styles.container,
                { paddingBottom: insets.bottom},
            ]}>
            <GoBackButton shouldGoBack={true}/>

            {/* Title Section */}
            <Text style={styles.title}>Your Invites</Text>
            <Text style={styles.subtitle}>
                None of your invited members have joined yet!
            </Text>

            <Text style={styles.description}>
                Share your unique invite link with fight promotions and fighter representatives to help
                them discover MMA Finds. The more members you bring in, the more rewards you
                earn!
            </Text>

            {/* Steps Section */}
            <View style={styles.stepsContainer}>
                <ReferralInputComponent />
            </View>
        </ScrollView>
    );
};

export default YourReferralsScreen;
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
        marginBottom: 20,
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

    description:{
        fontSize: 12,
        color: colors.primaryBlack,
        fontFamily: 'Roboto',
        fontWeight: '400',
        textAlign:'center',
        lineHeight: 15,
    }
});
