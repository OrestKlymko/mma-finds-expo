import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    UIManager,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {Image} from 'expo-image';

import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import ContentLoader from '@/components/ContentLoader';
import {getVerificationStatus} from '@/service/service';
import VerificationMainBanner from "@/components/verification/VerificationMainBanner";

export type VerificationState = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const VerificationPromotionScreen: React.FC = () => {
    const [status, setStatus] = useState<VerificationState | null>(null);
    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState<'EMAIL' | 'DOCUMENT' | null | undefined>(null);
    const router = useRouter();
    const params = useLocalSearchParams<{ routeToMain?: string }>();

    // Fetch status on mount
    useEffect(() => {
        setLoading(true);
        getVerificationStatus('promotion-verification')
            .then(res => {
                setStatus(res.status)
                setMethod(res.method);
                console.log(res);
            })
            .catch(() => Alert.alert('Error', 'Could not load verification status.'))
            .finally(() => setLoading(false));
    }, []);


    const renderStatus = () => {
        switch (status) {
            case 'APPROVED':
                return (
                    <VerificationMainBanner
                        icon={<Icon name="check" color={colors.white} size={52}/>}
                        bg={colors.primaryGreen}
                        text="Your account is verified."
                    />
                );
            case 'PENDING':
                return method && method === 'EMAIL' ?
                    <VerificationMainBanner
                        icon={<Icon name="clock-outline" color={colors.white} size={52}/>}
                        bg={colors.warning}
                        text="You have requested verification via e-mail. Please check your inbox or spam."
                    /> : <VerificationMainBanner
                        icon={<Icon name="clock-outline" color={colors.white} size={52}/>}
                        bg={colors.warning}
                        text="We are reviewing your documents. Please wait for approval."
                    />
            case 'REJECTED':
                return (
                    <VerificationMainBanner
                        icon={<Icon name="close" color={colors.white} size={52}/>}
                        bg={colors.error}
                        text="Verification rejected. Please try again."
                    />
                );
            case 'NONE':
            default:
                return (
                    <VerificationMainBanner
                        icon={<Image source={require('@/assets/verify.png')} style={styles.bannerImage}/>}
                        bg={colors.background}
                        text="
                    To verify your profile, we need to be 100% sure
                    it's you. Simply follow the provided steps
                    to build a secure system together."
                    />
                );
        }
    };


    if (loading) return <ContentLoader/>;

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            {params?.routeToMain === 'true' ? (
                <GoBackButton specificScreen="/"/>
            ) : (
                <GoBackButton/>
            )}
            <View style={styles.screen}>


                {/* STATUS BANNER */}
                {renderStatus()}
                {((status === 'PENDING' && method === 'EMAIL') || status === 'NONE') &&
                    <TouchableOpacity style={styles.optionCard}
                                      onPress={() => {
                                          if (status === 'PENDING') {
                                              router.push('/profile/settings/account/account-info/verification/email/code')
                                          } else {
                                              router.push('/profile/settings/account/account-info/verification/email');
                                          }
                                      }}
                                      activeOpacity={0.85}>
                        <View style={styles.optionLeft}>
                            <Icon name="email-outline" size={26} color={colors.primaryGreen}/>
                        </View>
                        <View>
                            <Text style={styles.optionTitle}>Verify via e‑mail</Text>
                            <Text style={styles.optionDesc}>Recommended</Text>
                        </View>
                    </TouchableOpacity>}

                {status !== 'APPROVED' && status !== 'PENDING' && <TouchableOpacity
                    style={styles.optionCard}
                    onPress={() => router.push('/profile/settings/account/account-info/verification/choose-document')}
                    activeOpacity={0.85}
                >
                    <View style={styles.optionLeft}>
                        <Icon name="file-document-outline" size={26} color={colors.primaryGreen}/>
                    </View>
                    <Text style={styles.optionTitle}>Verify by uploading a document</Text>
                </TouchableOpacity>}
            </View>
        </View>
    );
};

export default VerificationPromotionScreen;

/* -------------------------------------------------------------------------- */
/* Styles                                                                      */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    bannerImage: {
        width: 128,
        height: 128,
        resizeMode: 'contain',
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.grayBackground,
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 14,
    },
    optionLeft: {
        marginRight: 14,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    optionDesc: {
        fontSize: 13,
        color: colors.secondaryBlack,
    },

});
