import React from 'react';
import RNPickerSelect, {PickerSelectProps} from 'react-native-picker-select';
import {StyleSheet, View} from 'react-native';
import colors from '@/styles/colors';
import {MaterialCommunityIcons} from "@expo/vector-icons";

interface Props {
    value: string | null;
    onChange(value: string): void;
}

export default function RolePicker({value, onChange}: Props) {
    const roles = [
        {id: 'MANAGER', label: 'Manager', icon: 'account-tie'},
        {id: 'PROMOTION', label: 'Promotion', icon: 'office-building'},
        {id: 'PROMOTION_EMPLOYEE', label: 'Matchmaker', icon: 'account-group'},
    ];
    const items: PickerSelectProps['items'] = roles.map(r => ({
        label: r.label,
        value: r.id,
    }));

    return (
        <View pointerEvents="box-none">
            <RNPickerSelect
                items={items}
                value={value}
                onValueChange={onChange}
                style={pickerStyles}
                useNativeAndroidPickerStyle={false}
            />
            <MaterialCommunityIcons name={roles.find(i => i.id === value)?.icon} size={24} color={colors.primaryGreen}
                                    style={{position: 'absolute', left: 10, top: 15}}/>
        </View>
    );
}

const pickerStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderWidth: 1,
        borderColor: colors.primaryBlack,
        borderRadius: 8,
        color: colors.primaryBlack,
        backgroundColor: colors.white,
        height: 56,
        position: 'relative',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 40,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.primaryGreen,
        borderRadius: 8,
        color: colors.primaryBlack,
        backgroundColor: colors.white,
        height: 56,
        position: 'relative',
    },
});
