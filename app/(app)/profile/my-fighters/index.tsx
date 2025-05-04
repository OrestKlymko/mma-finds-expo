import {StyleSheet, Text, TextInput, View} from 'react-native'
import React, { useState } from 'react'
import colors from "@/styles/colors";
import {useFocusEffect, useRouter} from "expo-router";
import { ShortInfoFighter } from '@/service/response';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {getShortInfoFightersByManager} from "@/service/service";
import ContentLoader from "@/components/ContentLoader";
import GoBackButton from "@/components/GoBackButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import FighterList from "@/app/(app)/manager/fighter/list";

const MyFighters = () => {
    const router = useRouter();
    const [fighters, setFighters] = useState<ShortInfoFighter[]>([]);
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [contentLoading, setContentLoading] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            setContentLoading(true);
            getShortInfoFightersByManager()
                .then(response => {
                    setFighters(response);
                })
                .finally(() => setContentLoading(false));
        }, []),
    );

    const handleClickOnFighter = (fighter: ShortInfoFighter) => {
        router.push(`/(app)/manager/fighter/${fighter.id}`);
    };

    const filteredFighters = fighters.filter(fighter => {
        if (searchQuery && !fighter.name.includes(searchQuery)) return false;
        return true;
    });

    if (contentLoading) {
        return <ContentLoader />;
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom + 42}]}>
                {/* Back Button */}

                {/* Title */}
                <Text style={styles.title}>My Fighters</Text>

                {/* Fighters List */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for a fighter..."
                        placeholderTextColor={colors.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search" size={24} color={colors.gray} />
                </View>


                <FighterList
                    handleChooseFighter={handleClickOnFighter}
                    fighters={filteredFighters}
                />
            </View>
        </View>
    );
}
export default MyFighters
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 24,
    },
    /* Title */
    title: {
        fontSize: 25,
        fontFamily: 'Roboto',
        fontWeight: '500',
        lineHeight: 29.3,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 44,
    },

    /* Continue Text */
    continueText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        lineHeight: 18.75,
        textAlign: 'center',
        color: colors.secondaryBlack,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        paddingVertical: 20,
        paddingHorizontal: 8,
        height: 56,
    },
});
