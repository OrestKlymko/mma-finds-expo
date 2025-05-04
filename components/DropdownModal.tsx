import React, {useEffect, useState} from 'react';
import {FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';

interface DropdownItem {
    id: string;
    name: string;
}

interface DropdownModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (item: DropdownItem) => void;
    selectedItemId?: string;
    title: string;
    fetchData: () => Promise<DropdownItem[]>;
    searchPlaceholder?: string;
}

const DropdownModal: React.FC<DropdownModalProps> = ({
                                                         visible,
                                                         onClose,
                                                         onSelect,
                                                         selectedItemId,
                                                         title,
                                                         fetchData,
                                                         searchPlaceholder = 'Search...',
                                                     }) => {
    const [selected, setSelected] = useState<string | null | undefined>(
        selectedItemId,
    );
    const [items, setItems] = useState<DropdownItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<DropdownItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        fetchData()
            .then(data => {
                setItems(data);
                setFilteredItems(data);
            })
            .catch(error => {
                console.error('Failed to fetch data:', error);
            });
    }, [fetchData]);

    // Фільтрація за пошуком
    useEffect(() => {
        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredItems(filtered);
    }, [searchQuery, items]);

    const handleSelect = (item: DropdownItem) => {
        setSelected(item.id);
        onSelect(item);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{title}</Text>

                    <TextInput
                        style={styles.searchInput}
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={colors.gray}
                    />

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={filteredItems}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={[
                                    styles.item,
                                    selected === item.id && styles.itemSelected,
                                ]}
                                onPress={() => handleSelect(item)}>
                                <Text
                                    style={[
                                        styles.itemText,
                                        selected === item.id && styles.itemTextSelected,
                                    ]}>
                                    {item.name}
                                </Text>
                                {selected === item.id && (
                                    <Icon
                                        name="check-circle"
                                        size={20}
                                        color={colors.primaryGreen}
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default DropdownModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        textAlign: 'center',
        color: colors.primaryBlack,
    },
    searchInput: {
        height: 40,
        borderColor: colors.gray,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 15,
        color: colors.primaryBlack,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    itemSelected: {
        backgroundColor: colors.whiteGray,
    },
    itemText: {
        fontSize: 16,
        color: colors.primaryBlack,
    },
    itemTextSelected: {
        fontWeight: 'bold',
        color: colors.primaryGreen,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: colors.primaryBlack,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },
    closeButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});
