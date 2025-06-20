import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '@/styles/colors';
import Question from '@/assets/question.svg';
import Star from '@/assets/staro.svg';
import {useRouter} from "expo-router";
import {ImageBackground} from "expo-image";


const InviteFriendsScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container,]}>
            <ImageBackground
                source={require('@/assets/Feature.png')} // Replace with your image path
                style={[styles.imageBackground, {paddingTop: insets.top}]}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Icon name="chevron-left" size={24} color={colors.white} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                {/* Top Section */}
                <View style={styles.topSection}>
                    <Icon name="star-outline" size={72} color={colors.white} />
                    <Text style={styles.title}>Featured Fighters</Text>
                    <Text style={styles.subtitle}>Boost Your Fighters&apos; Visibility!</Text>
                    <Text style={styles.description}>
                        Featuring your fighters enhances their visibility and improves
                        their chances of being selected for a given offer.
                    </Text>

                    {/* Referral Link */}
                    <View style={styles.referralSection}>
                        <View style={styles.referralContainer}>
                            <TouchableOpacity style={styles.featuredButton} onPress={()=>router.push('/profile/submission-my-fighters')}>
                                <Text>Feature Your Fighters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <TouchableOpacity
                    style={styles.bottomItem}
                    onPress={() => router.push('/profile/featured-fighters/conditions')}>
                    <Question height={24} width={24} color={colors.primaryBlack} />
                    <Text style={styles.bottomText}>How It Works</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.bottomItem}
                    onPress={() => router.push('/profile/featured-fighters/list')}>
                    <Star height={24} width={24} color={colors.primaryBlack} />
                    <Text style={styles.bottomText}>Featured Fighters</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default InviteFriendsScreen;

const styles = StyleSheet.create({
    /** Container **/
    container: {
        flex: 1,
        backgroundColor: '#707070', // Сірий фон для верхньої частини
    },

    /** Back Button **/
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
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
    imageBackground: {
        flex: 1,
        marginTop: -10,
        marginBottom: -30,
        justifyContent: 'center',
    },

    referralLabel: {
        fontSize: 9,
        fontFamily: 'Roboto',
        fontWeight: '300',
        color: colors.white,
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
        color: colors.primaryBlack,
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.white,
        paddingVertical: 20,
        borderRadius: 8,
    },
    iconButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: colors.white,
        marginLeft: 5,
        paddingVertical: 19,
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
        borderBottomColor: colors.lightGray,
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
    }
});
