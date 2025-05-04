import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {getSportTypes} from '@/service/service';
import colors from '@/styles/colors';
import {SportTypeResponse} from '@/service/response';


interface Props {
    selectedSportType: SportTypeResponse | null | undefined;
    setSelectedSportType: (type: SportTypeResponse) => void;
    hasSubmitted?: boolean;
}

export const SportTypeSingleSelectDropdown = ({
                                                  selectedSportType,
                                                  setSelectedSportType,
                                                  hasSubmitted = false,
                                              }: Props) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [sportTypes, setSportTypes] = useState<SportTypeResponse[]>([]);

    useEffect(() => {
        getSportTypes().then(setSportTypes).catch(console.error);
    }, []);

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.dropdownButton,
                    hasSubmitted && !selectedSportType && {borderColor: colors.error},
                ]}
                onPress={() => setShowDropdown(!showDropdown)}>
                <Text
                    style={[
                        styles.dropdownButtonText,
                        hasSubmitted && !selectedSportType && {color: colors.error},
                    ]}>
                    {selectedSportType?.name || 'Sport*'}
                </Text>
                <Icon
                    name={showDropdown ? 'chevron-up' : 'chevron-right'}
                    size={24}
                    color={colors.gray}
                />
            </TouchableOpacity>

            {showDropdown && (
                <View style={styles.dropdownList}>
                    {sportTypes.map(type => (
                        <TouchableOpacity
                            key={type.id}
                            onPress={() => {
                                setSelectedSportType(type);
                                setShowDropdown(false);
                            }}
                            style={styles.dropdownItemContainer}>
                            <Text style={styles.dropdownItem}>{type.name}</Text>
                            {selectedSportType?.id === type.id && (
                                <Icon name="check" size={20} color={colors.primaryGreen} />
                            )}
                        </TouchableOpacity>
                    ))}
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
        borderBottomColor: colors.grayBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItem: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
});
