import React, {useCallback, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../../../styles/colors';
import {OfferList} from "@/components/offers/OfferList";
import GoBackButton from "@/components/GoBackButton";
import {PublicOfferInfo} from "@/service/response";
import {useRouter} from "expo-router";

const RecentlySavedOfferScreen = () => {
    const [publicOffers, setPublicOffers] = useState<PublicOfferInfo[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const refreshFavorites = async () => {
        const storedFavorites = await AsyncStorage.getItem('favoriteOffers');
        if (storedFavorites) {
            setPublicOffers(JSON.parse(storedFavorites));
        }
    };

    useFocusEffect(
        useCallback(() => {
            refreshFavorites();
        }, []),
    );

    const renderContent = () => {
        return publicOffers.length > 0 ? (
            <OfferList
                offers={publicOffers}
                isFavorite={true}
                refreshFavorites={refreshFavorites}
                onClick={offerId =>
                    router.push(`/offers/public/${offerId}`)
                }
            />
        ) : (
            <Text style={styles.noOffersText}>No Public Offers Available</Text>
        );
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                {/* Title */}
                <Text style={styles.title}>Recently Saved</Text>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <View style={styles.searchContainerCommon}>
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Find fight offer..."
                                placeholderTextColor={colors.gray}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <TouchableOpacity>
                                <Icon name="magnify" size={24} color={colors.primaryBlack} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Content */}
                {renderContent()}
            </View>
        </View>
    );
};

export default RecentlySavedOfferScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        fontStyle: 'normal',
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: colors.primaryBlack,
        marginBottom: 10,
        marginTop: 10,
    },

    searchContainer: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
        marginRight: 10,
    },

    searchContainerCommon: {
        flexDirection: 'row',
        gap: 10,
    },
    searchBar: {
        marginBottom: 20,
        marginTop: 30,
    },
    noOffersText: {
        textAlign: 'center',
        fontSize: 14,
        color: colors.gray,
    },
});
