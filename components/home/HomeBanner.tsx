import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React from 'react';
import colors from '@/styles/colors';
import {Image} from 'expo-image';

interface HomeBannerProps {
    title?: string;
    image?: any;
    description?: string;
    buttonText?: string;
    onPress?: () => any;
    mainText?: string;
}

export const HomeBanner = ({
                               title,
                               image,
                               description,
                               buttonText,
                               onPress,
                               mainText,
                           }: HomeBannerProps) => {
    return (
        <View style={[styles.section, { paddingRight: 15 }]}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                <View style={[styles.banner, styles.inviteBanner]}>
                    <Image
                        source={image}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover" // ✅ аналог resizeMode
                        transition={300}   // опціонально — плавна поява
                    />
                    <View style={styles.bannerContent}>
                        <Text style={styles.titleOnBanner}>{mainText}</Text>
                        <Text style={styles.bannerText}>{description}</Text>
                        <View style={styles.ctaWrapper}>
                            <Text style={styles.bannerCTA}>{buttonText}</Text>
                            <Icon name="chevron-right" size={24} color="#fff" />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    banner: {
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden', // важливо, щоб не обрізалося
        backgroundColor: colors.grayBackground,
    },
    inviteBanner: {
        height: 150,
    },
    bannerContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    titleOnBanner: {
        fontSize: 15,
        color: '#fff',
        marginBottom: 8,
        textAlign: 'left',
        lineHeight: 24,
        fontWeight: '600',
    },
    bannerText: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 8,
        textAlign: 'left',
        lineHeight: 24,
        fontWeight: '400',
    },
    bannerCTA: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff',
    },
    ctaWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
