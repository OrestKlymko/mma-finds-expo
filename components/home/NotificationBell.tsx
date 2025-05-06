import LogoBlack from "@/assets/logo-black.svg";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons as Icon} from "@expo/vector-icons";
import colors from "@/styles/colors";
import React from "react";
import {useRouter} from "expo-router";

type NotificationBellProps = {
    newNotification: number;
}
export const NotificationBell = (
    {newNotification}: NotificationBellProps
) => {
    const router = useRouter();
    return <View style={[styles.header]}>
        <LogoBlack width={240} height={40} />
        <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
                router.push('/notification')
            }}>
            <Icon name="bell-outline" size={24} color={colors.primaryBlack} />
            {newNotification > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{newNotification}</Text>
                </View>
            )}
        </TouchableOpacity>
    </View>
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButton: {
        padding: 4,
        position: 'absolute',
        right: 0,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: colors.error,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
})
