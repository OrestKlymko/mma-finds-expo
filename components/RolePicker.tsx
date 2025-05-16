import React, { useState } from 'react';
import {
    Modal,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/styles/colors';

export interface RoleItem {
    id: 'MANAGER' | 'PROMOTION' | 'PROMOTION_EMPLOYEE';
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const roles: RoleItem[] = [
    { id: 'MANAGER', label: 'Manager', icon: 'account-tie' },
    { id: 'PROMOTION', label: 'Promotion', icon: 'office-building' },
    { id: 'PROMOTION_EMPLOYEE', label: 'Matchmaker', icon: 'account-group' },
];

interface Props {
    value: string | null;
    onChange: (rol: 'MANAGER' | 'PROMOTION' | 'PROMOTION_EMPLOYEE') => void;
}

export default function RolePicker({ value, onChange }: Props) {
    const [modalVisible, setModalVisible] = useState(false);
    const selectedRole = roles.find(r => r.id === value);

    return (
        <>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons
                    name={selectedRole?.icon || 'account'}
                    size={20}
                    color={colors.primaryGreen}
                    style={styles.icon}
                />
                <Text style={styles.selectedText}>
                    {selectedRole?.label || 'Select role'}
                </Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choose a Role</Text>
                        <FlatList
                            data={roles}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                        onChange(item.id);
                                        setModalVisible(false);
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name={item.icon}
                                        size={20}
                                        color={colors.primaryGreen}
                                        style={styles.icon}
                                    />
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    selector: {
        height: 56,
        borderColor: colors.primaryGreen,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    selectedText: {
        fontSize: 16,
        color: colors.primaryBlack,
        fontFamily: 'Roboto',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000088',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '50%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: colors.primaryBlack,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        paddingHorizontal: 10,
    },
    optionText: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginLeft: 8,
    },
    cancelBtn: {
        marginTop: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        color: colors.primaryGreen,
    },
});
