import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from "@/styles/colors";
import {useExclusiveOfferFilter} from "@/context/ExclusiveOfferFilterContext";
import {ExclusiveOfferFilter} from "@/context/model/model";
import {AntDesign, Entypo} from "@expo/vector-icons";


const OFFER_TYPE_DISPLAY = {
    EXCLUSIVE: 'Single Bout',
    MULTI: 'Multi-Fight',
};

export const ActiveFilterList = () => {
    const {selectedExOfferFilters, setSelectedExOfferFilters} =
        useExclusiveOfferFilter();


    const removeFilter = (
        category: keyof ExclusiveOfferFilter,
        value: string,
    ) => {
        const current = selectedExOfferFilters[category];
        if (Array.isArray(current)) {
            setSelectedExOfferFilters(prev => ({
                ...prev,
                [category]: current.filter(item => item !== value),
            }));
        }
    };


    const filters = [
        ...selectedExOfferFilters.eventName.map(f => ({
            category: 'eventName',
            value: f,
        })),
        ...selectedExOfferFilters.offerType.map(f => ({
            category: 'offerType',
            value:
                f in OFFER_TYPE_DISPLAY
                    ? OFFER_TYPE_DISPLAY[f as keyof typeof OFFER_TYPE_DISPLAY]
                    : f,
        })),
        ...selectedExOfferFilters.fighterName.map(f => ({
            category: 'fighterName',
            value: f,
        })),
    ];

    if (filters.length === 0) return null;

    return (
        <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}>
            {filters.map((filter, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.filterChip}
                    onPress={() =>
                        removeFilter(
                            filter.category as keyof ExclusiveOfferFilter,
                            filter.value,
                        )
                    }>
                    <Text style={styles.filterText}>{filter.value.split(',')[0]}</Text>
                    <AntDesign name="close" size={14} color={colors.white} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primaryGreen,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
        marginRight: 5,
        height: 56,
    },
    filterText: {
        fontSize: 14,
        color: colors.white,
    },
});
