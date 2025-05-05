import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '@/styles/colors';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import {DocumentRequiredResponse} from '@/service/response';
import {useRouter} from "expo-router";

interface RequiredDocumentListProps {
    documents: DocumentRequiredResponse[];
    setDocuments: (documents: DocumentRequiredResponse[]) => void;
}

export const RequiredDocumentList = ({
                                         documents,
                                         setDocuments,
                                     }: RequiredDocumentListProps) => {
    const router = useRouter();
    const [newDocName, setNewDocName] = React.useState('');
    const [selectedType, setSelectedType] = React.useState<'Text' | 'File'>(
        'Text',
    );
    const [addCustomDocument, setAddCustomDocument] = React.useState(false);
    const mapToBackendType = (type: 'Text' | 'File'): 'TEXT' | 'FILE' =>
        type === 'Text' ? 'TEXT' : 'FILE';
    const toggleAllCheckbox = () => {
        if (checkAllSelected()) {
            const updated = documents?.map(doc => ({...doc, selected: false}));
            setDocuments(updated);
            return;
        } else {
            const allSelected = !documents?.find(doc => doc.id === 'all')?.selected;
            const updated = documents?.map(doc => ({...doc, selected: allSelected}));
            setDocuments(updated);
        }
    };
    const toggleCheckbox = (id: string) => {
        if (id === 'all') {
            const allSelected = !documents?.find(doc => doc.id === 'all')?.selected;
            const updated = documents?.map(doc => ({...doc, selected: allSelected}));
            setDocuments(updated);
        } else {
            const updated = documents?.map(doc =>
                doc.id === id ? {...doc, selected: !doc.selected} : doc,
            );

            const allSelected = updated
                .filter(doc => doc.id !== 'all')
                .every(doc => doc.selected);

            const final = updated.map(doc =>
                doc.id === 'all' ? {...doc, selected: allSelected} : doc,
            );

            setDocuments(final);
        }
    };

    const removeDocument = (id: string) => {
        setDocuments(documents.filter(doc => doc.id !== id));
    };

    const checkAllSelected = () => {
        return documents
            ?.filter(doc => doc.id !== 'all')
            .every(doc => doc.selected);
    };

    const addDocumentForm = () => {
        return (
            <View style={{marginTop: 20}}>
                <FloatingLabelInput
                    style={styles.input}
                    label="Document name"
                    placeholderTextColor={colors.gray}
                    value={newDocName}
                    onChangeText={setNewDocName}
                />
                <View style={styles.typeRow}>
                    {['Text', 'File'].map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.typeButton,
                                selectedType === type && styles.activeTypeButton,
                            ]}
                            onPress={() => setSelectedType(type as any)}>
                            <Text
                                style={[
                                    styles.typeButtonText,
                                    selectedType === type && styles.activeTypeText,
                                ]}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.addButton} onPress={handleAddDocument}>
                    <Text style={styles.addButtonText}>Add Document</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleAddDocument = () => {
        if (newDocName.trim() === '') return;

        const newDocument: DocumentRequiredResponse = {
            id: Date.now().toString(),
            documentName: newDocName,
            documentType: mapToBackendType(selectedType),
            isCustom: true,
            selected: true,
        };

        setNewDocName('');
        setDocuments([...documents, newDocument]);
        setSelectedType('Text');
    };

    const renderItem = ({item}: {item: DocumentRequiredResponse}) => (
        <View style={styles.row}>
            <TouchableOpacity
                onPress={() => toggleCheckbox(item.id)}
                style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                <View style={[styles.checkbox, item.selected && styles.checkedBox]}>
                    {item.selected && (
                        <Icon name="check" size={16} color={colors.primaryGreen} />
                    )}
                </View>
                <Text style={styles.label}>{item.documentName}</Text>
            </TouchableOpacity>

            {item.isCustom && (
                <TouchableOpacity
                    onPress={() => removeDocument(item.id)}
                    style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {documents && documents.length > 0 ? (
                <>
                    <TouchableOpacity onPress={toggleAllCheckbox} style={styles.row}>
                        <View
                            style={[
                                styles.checkbox,
                                checkAllSelected() && styles.checkedBox,
                            ]}>
                            {checkAllSelected() && (
                                <Icon name="check" size={16} color={colors.primaryGreen} />
                            )}
                        </View>
                        <Text style={styles.label}>Select All Documents</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <FlatList
                        data={documents}
                        scrollEnabled={false}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                    {addCustomDocument && addDocumentForm()}
                    {!addCustomDocument && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setAddCustomDocument(true)}>
                            <Text style={styles.addButtonText}>Add Document</Text>
                        </TouchableOpacity>
                    )}
                </>
            ) : (
                <View>
                    <TouchableOpacity
                        style={styles.addMoreDocumentButton}
                        onPress={() => {
                            router.push('/profile/offer-documents')
                        }}>
                        <Text style={styles.addMoreButtonText}>Add Default Documents</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderColor: colors.primaryBlack,
        borderRadius: 4,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedBox: {
        backgroundColor: '#fff',
        borderColor: colors.primaryGreen,
    },
    label: {
        flex: 1,
        fontSize: 16,
        color: colors.primaryBlack,
    },
    removeText: {
        color: colors.darkError,
        fontSize: 14,
    },
    separator: {
        height: 1,
        backgroundColor: '#EAEAEA',
        marginVertical: 5,
    },
    addButton: {
        backgroundColor: colors.primaryBlack,
        borderRadius: 10,
        marginBottom: 15,
        marginTop: 15,
        paddingVertical: 16,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },
    addButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    addMoreDocumentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        backgroundColor: colors.gray,
        borderRadius: 8,
        padding: 14,
        marginBottom: 30,
        justifyContent: 'center',
        height: 56,
    },
    addMoreButtonText: {
        color: colors.white,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500',
    },
    input: {
        fontSize: 16,
    },
    typeRow: {
        flexDirection: 'row',
        marginBottom: 16,
        marginTop: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
        height: 56,
        justifyContent: 'center',
    },
    activeTypeButton: {
        backgroundColor: colors.primaryGreen,
    },
    typeButtonText: {
        color: colors.primaryBlack,
        fontSize: 14,
    },
    activeTypeText: {
        color: colors.white,
        fontWeight: '600',
    },
});
