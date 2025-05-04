import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import DropdownModal from '@/components/DropdownModal';
import {getNationalities} from '@/service/service';
import {NationalityResponse} from '@/service/response'; // шлях адаптуй

interface NationalityDropdownProps {
    nationality: NationalityResponse | null;
    setNationality: (value: NationalityResponse) => void;
    hasSubmitted: boolean;
    title?: string;
}

export const NationalityDropdown = ({
                                        nationality,
                                        setNationality,
                                        hasSubmitted,
                                        title,
                                    }: NationalityDropdownProps) => {
    const [showNationalityList, setShowNationalityList] = React.useState(false);
    return (
        <>
            <TouchableOpacity
                style={[
                    styles.dropdownButton,
                    hasSubmitted && !nationality && {borderColor: colors.error},
                ]}
                onPress={() => setShowNationalityList(!showNationalityList)}>
                <Text
                    style={[
                        styles.dropdownButtonText,
                        hasSubmitted && !nationality && {color: colors.error},
                    ]}>
                    {nationality?.name ||title || 'Nationality*'}
                </Text>
                <Icon
                    name={showNationalityList ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={colors.gray}
                />
            </TouchableOpacity>

            {showNationalityList && (
                <DropdownModal
                    visible={showNationalityList}
                    onClose={() => setShowNationalityList(false)}
                    onSelect={nat => setNationality(nat)}
                    selectedItemId={nationality?.id}
                    title="Nationality"
                    fetchData={getNationalities}
                    searchPlaceholder="Search nationality..."
                />
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
});
