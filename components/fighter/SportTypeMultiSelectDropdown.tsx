import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {SportTypeResponse} from "@/service/response";
import {getSportTypes} from "@/service/service";
import colors from "@/styles/colors";
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';


interface Props {
    selectedSportTypes: SportTypeResponse[];
    setSelectedSportTypes : (sportTypes: SportTypeResponse[]) => void;
    hasSubmitted: boolean;
}

export const SportTypeMultiSelectDropdown = ({
                                                 selectedSportTypes,
                                                 setSelectedSportTypes,
                                                 hasSubmitted,
                                             }: Props) => {
    const [sportTypes, setSportTypes] = React.useState<SportTypeResponse[]>([]);
    const [showSportList, setShowSportList] = React.useState(false);
    useEffect(() => {
        getSportTypes().then(setSportTypes);
    }, []);

    const toggleSelection = (item: SportTypeResponse) => {
        const isSelected = selectedSportTypes.some(s => s.id === item.id);
        if (isSelected) {
            setSelectedSportTypes(selectedSportTypes.filter(s => s.id !== item.id));
        } else {
            setSelectedSportTypes([...selectedSportTypes, item]);
        }
    };

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.dropdownButton,
                    hasSubmitted &&
                    selectedSportTypes.length === 0 && {borderColor: colors.error},
                ]}
                onPress={() => setShowSportList(!showSportList)}>
                <Text
                    style={[
                        styles.dropdownButtonText,
                        hasSubmitted &&
                        selectedSportTypes.length === 0 && {color: colors.error},
                    ]}>
                    {selectedSportTypes.length > 0
                        ? selectedSportTypes.map(s => s.name).join(', ')
                        : 'Sport*'}
                </Text>
                <Icon
                    name={showSportList ? 'chevron-down' : 'chevron-right'}
                    size={24}
                    color={colors.gray}
                />
            </TouchableOpacity>

            {showSportList && (
                <View style={styles.dropdownList}>
                    {sportTypes.map(fs => {
                        const isSelected = selectedSportTypes.some(s => s.id === fs.id);
                        return (
                            <TouchableOpacity
                                key={fs.id}
                                onPress={() => toggleSelection(fs)}
                                style={[
                                    styles.dropdownItemContainer,
                                    isSelected && styles.selectedItem,
                                ]}>
                                <Text style={[styles.dropdownItem, {padding: 4}]}>
                                    {fs.name}
                                </Text>
                                {isSelected && (
                                    <Icon name="check" size={20} color={colors.primaryGreen} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        height: 56,
        backgroundColor: colors.white,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        backgroundColor: colors.white,
        marginBottom: 15,
    },
    dropdownItemContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItem: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    selectedItem: {
        backgroundColor: colors.whiteGray,
    },
});
