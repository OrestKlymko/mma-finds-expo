import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";
import {useRouter} from "expo-router";

const PreferencesScreen = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}>
                {/* Title */}
                <Text style={styles.title}>Preferences</Text>

                {/* Preferences Options */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => router.push('/profile/settings/preferences/notifications/push')}>
                        <Text style={styles.itemText}>Push Notifications</Text>
                        <Icon name="chevron-right" size={24} color={colors.gray} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default PreferencesScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },

    /** Title **/
    title: {
        fontSize: 25,
        fontWeight: '500',
        fontFamily: 'Roboto',
        lineHeight: 30,
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 22,
    },

    /** Preferences Items **/
    section: {
        marginBottom: 32,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Roboto',
        lineHeight: 24,
        color: colors.primaryBlack,
    },
});
