import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getFilterForPublicOffers, getFilterForPublicOffersManager,} from '@/service/service';
import {useFilter} from '@/context/FilterContext';
import {useAuth} from '@/context/AuthContext';
import ContentLoader from '@/components/ContentLoader';

const FilterFullListWeightClassScreen = () => {
    const insets = useSafeAreaInsets();
    const [weightClasses, setWeightClasses] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const {role} = useAuth();

    const {selectedFilters, setSelectedFilters} = useFilter();
    const [contentLoading, setContentLoading] = useState(false);

    useEffect(() => {
        setContentLoading(true);
        if (role === 'MANAGER') {
            getFilterForPublicOffersManager()
                .then(res => {
                    setWeightClasses(res.weightClasses);
                })
                .finally(() => {
                    setContentLoading(false);
                });
        } else {
            getFilterForPublicOffers()
                .then(res => {
                    setWeightClasses(res.weightClasses);
                })
                .finally(() => {
                    setContentLoading(false);
                });
        }
    }, [role]);

    const toggleWeightClassSelection = (weightClass: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            weightClass: prev.weightClass.includes(weightClass)
                ? prev.weightClass.filter(item => item !== weightClass)
                : [...prev.weightClass, weightClass],
        }));
    };

    if (contentLoading) {
        return <ContentLoader />;
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton />
            <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Weight Classes</Text>
                    <TouchableOpacity
                        onPress={() =>
                            setSelectedFilters(prev => ({...prev, weightClass: []}))
                        }
                        style={styles.clearButton}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor={colors.gray}
                        style={styles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                    />
                    <Icon name="magnify" size={20} color={colors.gray} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    {weightClasses
                        .filter(wc => {
                            return wc.toLowerCase().includes(search.toLowerCase());
                        })
                        .map((weightClass, index) => {
                            const isSelected =
                                selectedFilters.weightClass.includes(weightClass);
                            const backgroundColor =
                                index % 2 === 0 ? '#F2F2F2' : colors.white;

                            return (
                                <TouchableOpacity
                                    key={weightClass}
                                    style={[styles.weightClassItem, {backgroundColor}]}
                                    onPress={() => toggleWeightClassSelection(weightClass)}>
                                    <Text style={styles.weightClassText}>{weightClass}</Text>
                                    <View style={styles.checkbox}>
                                        {isSelected && (
                                            <Icon
                                                name="check"
                                                size={14}
                                                color={colors.primaryGreen}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 20,
    },
    headerContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryBlack,
        textAlign: 'center',
    },
    clearButton: {
        position: 'absolute',
        right: 0,
    },
    clearText: {
        color: colors.primaryGreen,
        fontSize: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 8,
        height: 56,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
    },
    weightClassItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 7,
    },
    weightClassText: {
        fontSize: 11,
        fontWeight: '400',
        color: colors.primaryBlack,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButton: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
        height: 56,
        justifyContent: 'center',
        marginBottom: 20,
    },
    applyText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
});

export default FilterFullListWeightClassScreen;
