import React, {useEffect, useState} from 'react';
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DocumentRequiredResponse} from "@/service/response";
import {
    deleteRequiredDocumentByPromotion,
    getAllRequiredDocumentByPromotion,
    saveRequiredDocumentByPromotion
} from "@/service/service";
import {CreateDocumentOfferRequest} from "@/service/request";
import GoBackButton from "@/components/GoBackButton";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import colors from "@/styles/colors";


export default function Index() {
    const insets = useSafeAreaInsets();
    const [documents, setDocuments] = useState<DocumentRequiredResponse[]>([]);
    const [newDocName, setNewDocName] = useState('');
    const [selectedType, setSelectedType] = useState<'Text' | 'File'>('Text');
    const mapToBackendType = (type: 'Text' | 'File'): 'TEXT' | 'FILE' =>
        type === 'Text' ? 'TEXT' : 'FILE';

    const getRequiredDocuments = () => {
        getAllRequiredDocumentByPromotion().then((response: DocumentRequiredResponse[]) => {
            setDocuments(response);
        });
    };

    useEffect(() => {
        getRequiredDocuments();
    }, []);

    const handleAddDocument = () => {
        if (newDocName.trim() === '') return;

        const newDocument: CreateDocumentOfferRequest = {
            name: newDocName,
            type: mapToBackendType(selectedType),
        };
        console.log(newDocument);
        saveRequiredDocumentByPromotion(newDocument).then(() => {
            getRequiredDocuments();
            setNewDocName('');
            setSelectedType('Text');
        });
    };

    const removeDocument = (id: string) => {
        deleteRequiredDocumentByPromotion(id).then(() => {
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        });
    };

    useEffect(() => {
    }, []);

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.background}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled">
                    <GoBackButton/>
                    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
                        <Text style={styles.title}>Required documents</Text>
                        <Text style={styles.subtitle}>
                            Add documents fighters must submit {'\n'}if they&apos;re chosen for the
                            fight.
                        </Text>

                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={documents}
                            scrollEnabled={false}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => (
                                <View style={styles.documentRow}>
                                    <Text style={styles.documentName}>
                                        {item.documentName}{' '}
                                        <Text style={styles.docType}>
                                            ({item.documentType === 'FILE' ? 'File' : 'Text'})
                                        </Text>
                                    </Text>
                                    <TouchableOpacity onPress={() => removeDocument(item.id)}>
                                        <Icon
                                            name="close"
                                            size={22}
                                            color="#fff"
                                            style={styles.iconButton}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            ListFooterComponent={
                                <>
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

                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={handleAddDocument}>
                                        <Text style={styles.addButtonText}>Add Document</Text>
                                    </TouchableOpacity>
                                </>
                            }
                            style={{marginBottom: 20}}
                        />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: colors.white,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primaryBlack,
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: colors.secondaryBlack,
        marginBottom: 20,
        textAlign: 'center',
    },
    documentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        marginBottom: 12,
    },
    documentName: {
        flex: 1,
        fontSize: 15,
        color: colors.primaryBlack,
    },
    docType: {
        fontSize: 12,
        color: colors.gray,
    },
    iconButton: {
        marginLeft: 10,
        backgroundColor: colors.gray,
        borderRadius: 8,
        padding: 6,
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
    addButton: {
        backgroundColor: colors.primaryBlack,
        borderRadius: 10,
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
    emptyText: {
        color: colors.gray,
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
    },
});
