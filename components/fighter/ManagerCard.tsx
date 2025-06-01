import {Image} from "expo-image";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons as Icon} from "@expo/vector-icons";
import colors from "@/styles/colors";
import React from "react";

type ManagerCardProps = {
    item: {
        managerId: string;
        name: string;
        imageLink: string;
        companyName?: string;
        countryName: string;
    },
    handleChooseFighter: (item: any) => void,
    selectedInList?: boolean
}

export const ManagerCard = (
    {item, handleChooseFighter, selectedInList}: ManagerCardProps
) => {
    return (
        <TouchableOpacity
            style={[styles.fighterCard,
                selectedInList && {backgroundColor: colors.lightPrimaryGreen}]}
            onPress={() => handleChooseFighter(item)}>
            <Image
                source={{uri: item.imageLink}}
                style={styles.fighterImage}
            />
            <View style={styles.fighterDetails}>
                <Text style={styles.fighterName}>{item.name}</Text>
                {item?.companyName && (
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.fighterInfo}>Company Name: </Text>
                        <Text style={[styles.fighterInfo, {fontWeight: '400'}]}>
                            {item?.companyName}
                        </Text>
                    </View>
                )}
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.fighterInfo}>Based In: </Text>
                    <Text style={[styles.fighterInfo, {fontWeight: '400'}]}>
                        {item.countryName}
                    </Text>
                </View>
            </View>
            <Icon
                name="chevron-right"
                size={30}
                color={colors.primaryGreen}
                style={styles.arrowIcon}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

    // Картка файтера
    fighterCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        position: 'relative',
    },
    fighterImage: {
        width: 65,
        height: 65,
        borderRadius: 30,
        marginRight: 16,
    },
    fighterDetails: {
        flex: 1,
        paddingRight: 25, // щоб текст не ліз під іконку стрілки
    },
    fighterName: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
        color: colors.primaryGreen,
    },
    fighterInfo: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 2,
        color: colors.primaryBlack,
    },
    arrowIcon: {
        position: 'absolute',
        right: 10,
        alignSelf: 'center',
    },

    // Відмітка Featured
    featuredTag: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.yellow,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopRightRadius: 8,
    },
    featuredTagText: {
        fontWeight: '500',
        fontSize: 10,
    },
})
