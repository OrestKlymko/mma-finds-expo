import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';
import React, {useState} from 'react';

interface TitleWithActionProps {
    title?: string;
    onEdit?: () => void;
}

export const TitleWithAction = ({title, onEdit}: TitleWithActionProps) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const handleEditEvent = () => {
        onEdit && onEdit();
        setMenuVisible(false);
    };

    return (
        <View style={styles.headerRow}>
            <Text style={styles.eventTitle}>{title}</Text>
            {menuVisible && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleEditEvent}>
                        <Icon name="pencil-outline" size={20} color={colors.primaryBlack} />
                        <Text style={styles.menuItemText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
        marginTop: 20,
        zIndex: 10,
    },
    eventTitle: {
        fontSize: 25,
        fontWeight: '500',
        color: colors.primaryGreen,
    },
    // Three-dot menu
    menuContainer: {
        position: 'absolute',
        top: 30,
        right: 0,
        backgroundColor: colors.white,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 2},
        paddingVertical: 5,
        zIndex: 99,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 10,
        color: colors.primaryBlack,
    },
});
