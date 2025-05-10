import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FighterInfoResponse} from "@/service/response";
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Image} from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "@/styles/colors";


type ManageFighterHeaderAndButtonsProps = {
    fighter: FighterInfoResponse |undefined|null;
};

export const ManageFighterHeaderAndButtons = ({
                                                  fighter,
                                              }: ManageFighterHeaderAndButtonsProps) => {
   const router= useRouter();
    const {id} = useLocalSearchParams<{id: string}>();
    const onEdit = () => {
        if (!fighter) {
            console.error('Fighter data is not available');
            return;
        }
        router.push(`/(app)/manager/fighter/${id}/edit`)
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: fighter?.imageLink || 'https://via.placeholder.com/80x80',
                    }}
                    style={styles.profileImage}
                />
                <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                    <Ionicons name="pencil" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.fighterName}>{fighter?.name || 'Fighter Name'}</Text>
            <Text style={styles.managerName}>
                Manager:{' '}
                <Text style={styles.managerLink}>
                    {fighter?.managerName || 'Manager Name'}
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 24,
    },
    fighterName: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    managerName: {
        fontWeight: '400',
        fontSize: 16,
        fontFamily: 'Roboto',
        color: colors.primaryBlack,
        marginBottom: 15,
    },
    managerLink: {
        color: colors.primaryGreen,
        fontWeight: '400',
        fontFamily: 'Roboto',
        fontSize: 16,
    },

    editButton: {
        position: 'absolute',
        right: 10,
        bottom: 0,
        backgroundColor: colors.primaryGreen,
        padding: 5,
        borderRadius: 60,
    },
    contactButton: {
        flex: 1,
        backgroundColor: colors.lightGray,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    contactButtonText: {
        color: colors.primaryBlack,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        fontFamily: 'Roboto',
    },
    imageContainer: {
        width: 120,
        height: 120,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 60,
        position: 'relative',
    },
});
