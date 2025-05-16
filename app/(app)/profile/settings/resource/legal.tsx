import React from 'react';
import {Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";

const LegalScreen = () => {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
                styles.container,
                {paddingBottom: insets.bottom},
            ]}>
            <GoBackButton/>

            {/* Title */}
            <Text style={styles.title}>Legal</Text>

            {/* Preferences Options */}
            <View style={styles.section}>
                <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('https://www.mmafinds.com/terms-and-conditions/')}>
                    <Text style={styles.itemText}>Terms and Conditions</Text>
                    <Icon name="chevron-right" size={24} color={colors.gray} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('https://www.mmafinds.com/privacy-policy/')}>
                    <Text style={styles.itemText}>Privacy Policy</Text>
                    <Icon name="chevron-right" size={24} color={colors.gray} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default LegalScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        marginBottom: 32,
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
