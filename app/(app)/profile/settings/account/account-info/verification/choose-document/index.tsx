import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from "expo-router";

const VerifyAccountChooseDoc = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const handleSelection = (type: string) => {
        router.push({
            pathname: '/profile/settings/account/account-info/verification/photo-document', params: {
                documentType: type,
            }
        })
    };

    return (
        <View style={[styles.mainContainer, {paddingBottom: insets.bottom}]}>
            <GoBackButton/>
            <View style={styles.container}>
                {/* Title */}
                <Text style={styles.title}>
                    Select the type of document you wish to upload.
                </Text>
                <Text style={styles.subtitle}>
                    Selecting the document type ensures accurate identity verification and
                    enhances the security of your account.
                </Text>

                {/* Document Type Buttons */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSelection('Identity Card')}>
                    <Text style={styles.buttonText}>Identity Card</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSelection('Driver License')}>
                    <Text style={styles.buttonText}>Driver License</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSelection('Passport')}>
                    <Text style={styles.buttonText}>Passport</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VerifyAccountChooseDoc;
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: colors.background,
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 60,
        alignItems: 'center',
    },

    // Back Button
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    backText: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginLeft: 8,
        fontFamily: 'Roboto',
        fontWeight: '400',
    },

    // Title and Subtitle
    title: {
        fontSize: 22,
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.primaryBlack,
        marginTop: 40,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 30,
        lineHeight: 20,
    },

    // Document Buttons
    button: {
        backgroundColor: colors.lightGray,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.primaryBlack,
    },
});
