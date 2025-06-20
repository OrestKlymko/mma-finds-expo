import {StyleSheet, Text, View} from "react-native";
import React from "react";
import colors from "@/styles/colors";

type VerificationMainBannerProps = {
    icon: JSX.Element;
    bg: string;
    text: string;
}

export default function VerificationMainBanner(
    {icon, bg, text}: VerificationMainBannerProps
) {
    return (
        <View style={styles.bannerWrapper}>
            <View style={[styles.bannerCircle, {backgroundColor: bg}]}>{icon}</View>
            <Text style={styles.bannerText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bannerWrapper: {
        alignItems: 'center',
        marginBottom: 32,
    },
    bannerCircle: {
        width: 148,
        height: 148,
        borderRadius: 74,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    bannerText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: colors.primaryBlack,
        lineHeight: 24,
    },

});

