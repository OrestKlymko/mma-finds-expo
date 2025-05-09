import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Question from '@/assets/question.svg';
import Staro from '@/assets/staro.svg';
import {ImageBackground} from "expo-image";
import {useRouter} from "expo-router";
import colors from "@/styles/colors";

const FeaturedOffersListScreen = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    return (
        <View style={{flex: 1}}>

            <ImageBackground
                source={require('@/assets/Feature.png')}
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
                    <Icon name="star-outline" size={72} color={colors.white} />
                    <Text style={styles.title}>Featured Offers</Text>
                    <Text style={styles.subtitle}>Boost Your Fight Offers&apos; Visibility!</Text>
                    <Text style={styles.description}>
                        Featured offers stay at the top of the fight offers feed, increasing exposure and
                        attracting high-quality fighters.
                    </Text>

                    <View style={styles.referralSection}>
                        <View style={styles.referralContainer}>
                            <TouchableOpacity
                                style={styles.featuredButton}
                                onPress={() => router.push('/(app)/(tabs)/feed')}>
                                <Text style={{color: colors.primaryBlack, fontWeight: '500'}}>
                                    Feature Your Offers
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <TouchableOpacity
                    style={styles.bottomItem}
                    onPress={() =>
                        router.push('/profile/featured-offers/conditions')
                    }>
                    <Question height={24} width={24} color={colors.primaryBlack} />
                    <Text style={styles.bottomText}>How It Works</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.bottomItem}
                    onPress={() =>
                        router.push('/profile/featured-offers/list')
                    }>
                    <Staro height={24} width={24} color={colors.primaryBlack} />
                    <Text style={styles.bottomText}>Featured Offers</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FeaturedOffersListScreen;

const styles = StyleSheet.create({
    /** Image Background **/
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        marginTop: -10,
        marginBottom: -30,
    },

    /** Back Button **/
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 20,
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
        marginTop: 20,
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

    /** Referral Section **/
    referralSection: {
        marginTop: 30,
        width: '100%',
        paddingHorizontal: 20,
    },
    referralContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
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
        borderBottomColor: colors.lightGray
    },
    bottomText: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
    },
    featuredButton: {
        marginTop: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 8,
        width: '100%',
        paddingVertical: 17,
        height: 56,
        justifyContent: 'center',
    },
});
