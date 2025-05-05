import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import React from 'react';
import colors from '@/styles/colors';
import {FighterInfoResponse} from '@/service/response';
import {Image} from "expo-image";
import {useRouter} from "expo-router";

type FighterAndManagerHeaderProps = {
    fighter: FighterInfoResponse | undefined | null;
};
export const FighterAndManagerHeader = ({
                                            fighter,
                                        }: FighterAndManagerHeaderProps) => {
    const router = useRouter();
    return (
        <View style={styles.headerContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: fighter?.imageLink || 'https://via.placeholder.com/80x80',
                    }}
                    style={styles.profileImage}
                />
            </View>
            <Text style={styles.fighterName}>{fighter?.name || 'Fighter Name'}</Text>
            <TouchableOpacity
                style={styles.managerButton}
                onPress={() => {
                    router.push(`/(app)/manager/${fighter?.managerId}`)
                }
                }>
                <Text style={styles.managerName}>
                    Manager:{' '}
                    <Text style={styles.managerLink}>
                        {fighter?.managerName || 'Manager Name'}
                    </Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    imageContainer: {
        width: 120,
        height: 120,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 60, // для круглої картинки
    },

    fighterName: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    managerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    managerName: {
        fontWeight: '400',
        fontSize: 16,
        color: colors.primaryBlack,
        marginBottom: 15,
    },
    managerLink: {
        color: colors.primaryGreen,
        fontWeight: '400',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
