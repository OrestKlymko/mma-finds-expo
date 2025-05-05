import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import {MaterialIcons as Icon} from '@expo/vector-icons';
import React, {useEffect} from 'react';
import {getSportTypes} from '@/service/service';
import {SportTypeResponse} from '@/service/response';


export const SportTypeMultiChoose = ({
                                         hasSubmit,
                                         selectedSportTypes = [], // Значення за замовчуванням – порожній масив
                                         setSelectedSportTypes,
                                     }: {
    hasSubmit: boolean;
    selectedSportTypes?: SportTypeResponse[];
    setSelectedSportTypes: (value: SportTypeResponse[]) => void;
}) => {
    const [showSportList, setShowSportList] = React.useState(false);
    const [sportTypes, setSportTypes] = React.useState<SportTypeResponse[]>([]);

    useEffect(() => {
        getSportTypes()
            .then(setSportTypes)
            .catch(error =>
                console.error('Помилка завантаження типів спорту:', error),
            );
    }, []);

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.dropdownButton,
                    hasSubmit &&
                    selectedSportTypes.length === 0 && {borderColor: colors.error},
                ]}
                onPress={() => setShowSportList(!showSportList)}>
                <Text
                    style={[
                        styles.dropdownButtonText,
                        hasSubmit &&
                        selectedSportTypes.length === 0 && {color: colors.error},
                    ]}>
                    {selectedSportTypes.length > 0
                        ? selectedSportTypes?.map(s => s.name).join(', ')
                        : 'Sport*'}
                </Text>
                <Icon
                    name={showSportList ? 'chevron-up' : 'chevron-right'}
                    size={24}
                    color={colors.gray}
                />
            </TouchableOpacity>
            {showSportList && (
                <View style={styles.dropdownList}>
                    {sportTypes.map(fs => {
                        const isSelected = selectedSportTypes?.some(s => s.id === fs.id);
                        return (
                            <TouchableOpacity
                                key={fs.id}
                                onPress={() => {
                                    if (isSelected) {
                                        setSelectedSportTypes(
                                            selectedSportTypes.filter(s => s.id !== fs.id)
                                        );
                                    } else {
                                        setSelectedSportTypes([...selectedSportTypes, fs]);
                                    }
                                }}

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
    dropdownItemContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayBackground,
        flexDirection: 'column',
    },
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
    dropdownItem: {
        padding: 12,
        fontSize: 16,
        color: colors.primaryBlack,
    },
    selectedItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
