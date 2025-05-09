import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import GoBackButton from '@/components/GoBackButton';
import ContentLoader from '@/components/ContentLoader';
import colors from '@/styles/colors';
import {getShortInfoPromotionForCard} from '@/service/service';
import {PromotionResponse} from '@/service/response';
import {PromotionList} from "@/components/PromotionList";

const AllPromotionsScreen = () => {
    const [promotions, setPromotions] = useState<PromotionResponse[]>([]);
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [contentLoading, setContentLoading] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            setContentLoading(true);
            getShortInfoPromotionForCard()
                .then(response => {
                    setPromotions(response);
                })
                .finally(() => setContentLoading(false));
        }, []),
    );

    const filteredPromotions = promotions.filter(promotion => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        const name = promotion.name?.toLowerCase() || '';
        const country = promotion.country?.toLowerCase() || '';

        return name.includes(query) || country.includes(query);
    });

    if (contentLoading) {
        return <ContentLoader />;
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom + 42}]}>
                <Text style={styles.title}>All promotions</Text>

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for a promotion..."
                        placeholderTextColor={colors.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Icon name="magnify" size={24} color={colors.gray} />
                </View>

                <PromotionList promotions={filteredPromotions} />
            </View>
        </View>
    );
};

export default AllPromotionsScreen;

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
