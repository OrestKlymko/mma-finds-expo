import {StyleSheet, Text, View} from "react-native";

import React from "react";
import {Image} from "expo-image";

type AvatarSectionProps = {
    avatar?: string;
    senderName?: string;
}

export const AvatarSection = (
    {avatar, senderName}: AvatarSectionProps,
) => {
    return <View style={styles.avatarBlock}>
        <View style={styles.avatarContainer}>
            <Image
                source={{
                    uri:
                        avatar ||
                        'https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png',
                }}
                style={styles.avatar}
            />
        </View>
        <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{senderName}</Text>
        </View>
    </View>;
};

const styles = StyleSheet.create({
    avatarBlock: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusText: {
        fontSize: 25,
        fontWeight: '500',
        marginRight: 6,
    },
});
