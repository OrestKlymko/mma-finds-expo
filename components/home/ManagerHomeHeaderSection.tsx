import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

import React from 'react';
import {useRouter} from "expo-router";
import colors from "@/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import LogoBlack from "@/assets/logo-black.svg";


export const ManagerHomeHeaderSection = () => {
    const router = useRouter();
    return (
        <View style={[styles.section, {paddingRight: 20}]}>
            <View style={styles.header}>
                <LogoBlack width={240} height={40} />
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push('/(app)/notification')}>
                    <Ionicons name="notifications-outline" size={24} color={colors.primaryBlack} />
                </TouchableOpacity>
            </View>
            <View style={[styles.searchContainer]}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for an offer..."
                    placeholderTextColor={colors.gray}
                    onFocus={() => router.push('/(app)/offer')} //TODO: Check correct fighter offer screen
                />
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color={colors.primaryBlack} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 15,
        marginBottom: 20,
        height: 56,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        marginRight: 10,
    },
    header: {
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    iconButton: {
        padding: 4,
        position: 'absolute',
        right: 0,
    },
});