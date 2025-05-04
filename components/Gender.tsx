import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React from 'react';

interface GenderProps {
    gender: string | null;
    hasSubmitted: boolean;
    showGenderList?: boolean;
    setGender: (value: string) => void;
    title?: string;
}

export const Gender = ({
                           showGenderList,
                           setGender,
                           gender,
                           hasSubmitted,
                           title,
                       }: GenderProps) => {
    const [localShowGenderList, setLocalShowGenderList] = React.useState(
        showGenderList || false,
    );

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.dropdownButton,
                    hasSubmitted && !gender && {borderColor: colors.error},
                ]}
                onPress={() => setLocalShowGenderList(prev => !prev)}>
                <Text
                    style={[
                        styles.dropdownButtonText,
                        hasSubmitted && !gender && {color: colors.error},
                    ]}>
                    {gender || title || 'Gender*'}
                </Text>
                <Icon
                    name={localShowGenderList ? 'chevron-up' : 'chevron-right'}
                    size={24}
                    color={colors.gray}
                />
            </TouchableOpacity>

            {localShowGenderList && (
                <View style={styles.dropdownList}>
                    {['Male', 'Female'].map(g => (
                        <TouchableOpacity
                            key={g}
                            onPress={() => {
                                setGender(g);
                                setLocalShowGenderList(false);
                            }}>
                            <Text style={styles.dropdownItem}>{g}</Text>
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
    dropdownItem: {
        padding: 12,
        fontSize: 16,
        color: colors.primaryBlack,
    },
});
