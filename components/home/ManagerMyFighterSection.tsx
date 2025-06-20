import {FlatList, StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import {CardInfoFighterResponse} from "@/service/response";
import {useRouter} from "expo-router";
import colors from "@/styles/colors";


type ManagerMyFighterSectionProps = {
    fighters: CardInfoFighterResponse[];
};

export const ManagerMyFighterSection = ({
                                            fighters,
                                        }: ManagerMyFighterSectionProps) => {
    const router = useRouter();
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Fighters</Text>
                <TouchableOpacity
                    onPress={() => router.push(('/(app)/(tabs)/feed'))}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={fighters}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => {
                            router.push(`/(app)/manager/fighter/${item.id}`);
                        }}>
                        <View style={styles.fighterCard}>
                            <Image
                                source={{uri: item.imageLink}}
                                style={styles.fighterImage}
                            />
                            <Text style={styles.fighterNameText}>
                                {item.name.length > 17
                                    ? item.name.slice(0, 17) + '...'
                                    : item.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600',
        color: colors.primaryBlack,
    },
    seeAll: {
        fontSize: 17,
        fontWeight: '500',
        color: colors.primaryGreen,
        paddingRight: 20,
    },
    fighterCard: {
        width: 115,
        backgroundColor: colors.lightGray,
        borderRadius: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    fighterImage: {
        width: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        height: 100,
        marginBottom: 10,
    },

    fighterNameText: {
        fontSize: 10,
        fontWeight: '500',
        color: colors.primaryGreen,
        textAlign: 'center',
    },
});
