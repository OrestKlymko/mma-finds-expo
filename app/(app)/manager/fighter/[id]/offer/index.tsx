import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {getFullInfoAboutFighter} from '@/service/service';
import ContentLoader from '@/components/ContentLoader';
import {FighterInfoResponse} from '@/service/response';
import {Image} from "expo-image";
import {FighterCharacters} from "@/components/fighter/FighterCharacters";
import {useLocalSearchParams} from "expo-router";

const PromotionFighterDetailOfferScreen = () => {
    const insets = useSafeAreaInsets();
    const [fighter, setFighter] = useState<FighterInfoResponse | null>(null);
    const {id} = useLocalSearchParams<{id: string}>();
    const [contentLoading, setContentLoading] = useState(false);
    useEffect(() => {
        setContentLoading(true);
        getFullInfoAboutFighter(id)
            .then(res => {
                setFighter(res);
            })
            .finally(() => {
                setContentLoading(false);
            });
    }, [id]);

    if (contentLoading) {
        return <ContentLoader />;
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                {/* Fighter Name and Manager */}
                <View style={styles.headerContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{
                                uri: fighter?.imageLink || 'https://via.placeholder.com/80x80',
                            }}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.fighterName}>
                        {fighter?.name || 'Fighter Name'}
                    </Text>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text style={styles.managerName}>
                            Manager:{' '}
                            <Text style={styles.managerLink}>
                                {fighter?.managerName || 'Manager Name'}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* About the Fighter */}
                <Text style={styles.sectionTitle}>About the Fighter</Text>
                <Text style={styles.fighterDescription}>
                    {fighter?.description || 'No description provided. '}
                </Text>

                {/* Fighter Details */}
                <FighterCharacters fighter={fighter} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    imageContainer: {
        width: 120,
        height: 120,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 60,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 24,
    },
    fighterName: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    managerName: {
        fontWeight: '400',
        fontSize: 16,
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
        marginBottom: 15,
    },
    managerLink: {
        color: colors.primaryGreen,
        fontWeight: '400',
        fontFamily: 'Roboto',
        fontSize: 16,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    selectButton: {
        flex: 1,
        backgroundColor: colors.primaryGreen,
        paddingVertical: 17,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    selectButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        fontFamily: 'Roboto',
    },
    contactButton: {
        flex: 1,
        backgroundColor: colors.lightGray,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    contactButtonText: {
        color: colors.primaryBlack,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        fontFamily: 'Roboto',
    },
    sectionTitle: {
        fontSize: 12,
        marginTop: 14,
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 8,
    },
    fighterDescription: {
        fontSize: 11,
        color: colors.gray,
        fontFamily: 'Roboto',
        fontWeight: '400',
        lineHeight: 17,
        marginBottom: 16,
        textAlign: 'justify',
    },
    detailsContainer: {
        borderRadius: 8,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    zebraLight: {
        backgroundColor: colors.white,
    },
    zebraDark: {
        backgroundColor: colors.lightGray,
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    detailValue: {
        fontSize: 12,
        color: colors.primaryBlack,
    },
    linkValue: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.primaryGreen,
        textDecorationLine: 'underline',
    },
    nextMatchButton: {
        backgroundColor: colors.gray,
        borderRadius: 8,
        paddingVertical: 17,
        alignItems: 'center',
        marginTop: 16,
    },
    nextMatchButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PromotionFighterDetailOfferScreen;
