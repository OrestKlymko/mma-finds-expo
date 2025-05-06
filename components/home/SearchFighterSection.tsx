import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React from 'react';
import {useRouter} from "expo-router";

export const SearchFighterSection = () => {

    const router = useRouter();
    return (
        <View style={[styles.searchContainer, styles.section, {marginTop: 20}]}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search for a fighter..."
                placeholderTextColor={colors.gray}
                onFocus={() => {
                    //ROUTER TO MAIN LIST OF FIGHTER AND MANAGER
                }}
            />
            <TouchableOpacity>
                <Icon name="magnify" size={24} color={colors.primaryBlack} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 15,
        height: 56,
    },
    section: {
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        marginRight: 10,
    },
});
