import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {getPublicOffers} from "@/service/service";
import GoBackButton from "@/components/GoBackButton";
import colors from "@/styles/colors";
import ContentLoader from "@/components/ContentLoader";
import {OfferList} from "@/components/offers/OfferList";

const YourFeaturedOffersScreen = () => {
    const [publicOffers, setPublicOffers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();
    const [contentLoading, setContentLoading] = useState(false);
    useFocusEffect(
        useCallback(() => {
            setContentLoading(true)
            getPublicOffers().then(res => {
                setPublicOffers(
                    res.filter(
                        (offer: any) => offer.isOfferFeatured,
                    ),
                );
            }).finally(()=>setContentLoading(false));
        }, []),
    );

    const renderContent = () => {
        return <OfferList offers={publicOffers} />;
    };

    if(contentLoading){
        return <ContentLoader/>
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton/>
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>

                {/* Title */}
                <Text style={styles.title}>Featured Offers</Text>
                <Text style={styles.subtitle}>
                    None of your offers are currently featured!
                </Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for an offer..."
                        placeholderTextColor={colors.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity>
                        <Icon name="magnify" size={24} color={colors.primaryBlack} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {renderContent()}
            </View>
        </View>
    );
};

export default YourFeaturedOffersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 10,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        color: colors.primaryBlack,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '400',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 17,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        marginHorizontal: 4,
    },
    tabActive: {
        backgroundColor: colors.primaryGreen,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    tabTextActive: {
        color: colors.white,
    },
    searchContainer: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        marginRight: 10,
    },
    noOffersText: {
        textAlign: 'center',
        fontSize: 14,
        color: colors.gray,
    },
    createButton: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
        height: 56,
        justifyContent: 'center',
        marginBottom: 50,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
});
