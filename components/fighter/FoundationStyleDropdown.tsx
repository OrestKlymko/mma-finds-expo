import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {FoundationStyleResponse} from "@/service/response";
import {getFoundationStyles} from "@/service/service";
import colors from "@/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";



interface Props {
    setFoundationStyle: (style: FoundationStyleResponse) => void;
    foundationStyle: FoundationStyleResponse| null| undefined;
    hasSubmitted: boolean;
}

export const FoundationStyleDropdown = ({
                                            setFoundationStyle,
                                            foundationStyle,
                                            hasSubmitted,
                                        }: Props) => {

    const [foundationStyles, setFoundationStyles] = React.useState<FoundationStyleResponse[]>([]);
    const [showFoundationList, setShowFoundationList] = React.useState(false);
    useEffect(() => {
        getFoundationStyles().then(setFoundationStyles);
    }, []);

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.dropdownButton,
                    hasSubmitted && !foundationStyle && {borderColor: colors.error},
                ]}
                onPress={() => setShowFoundationList(!showFoundationList)}>
                <Text
                    style={[
                        styles.dropdownButtonText,
                        hasSubmitted && !foundationStyle && {color: colors.error},
                    ]}>
                    {foundationStyle?.name || 'Foundation Style*'}
                </Text>
                <Ionicons
                    name={showFoundationList ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={colors.gray}
                />
            </TouchableOpacity>

            {showFoundationList && (
                <View style={styles.dropdownList}>
                    {foundationStyles.map(fs => (
                        <TouchableOpacity
                            key={fs.id}
                            onPress={() => {
                                setFoundationStyle(fs);
                                setShowFoundationList(false);
                            }}>
                            <Text style={styles.dropdownItem}>{fs.name}</Text>
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