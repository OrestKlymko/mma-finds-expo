import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useRouter} from "expo-router";
import colors from "@/styles/colors";

interface FooterSignUpProps {
    colorText?: string;
}

export const FooterSignIn = ({colorText}: FooterSignUpProps) => {
const route = useRouter();
    return (
        <View>
            <View style={styles.footer}>
                <Text
                    style={[
                        styles.footerText,
                        {color: colorText === 'white' ? colors.white : colors.primaryBlack},
                    ]}>
                    Already have an account?
                </Text>
                <TouchableOpacity onPress={() => route.push('/login')}>
                    <Text style={styles.footerLink}> Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    footerText: {
        fontSize: 15,
        fontFamily: 'Roboto',
        fontWeight: '400',
        lineHeight: 16,
        color: colors.primaryBlack,
    },
    footerLink: {
        fontSize: 15,
        fontFamily: 'Roboto',
        fontWeight: '500',
        lineHeight: 16,
        color: colors.primaryGreen,
    },
});

export default FooterSignIn;
