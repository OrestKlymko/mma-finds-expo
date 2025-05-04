import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRouter} from "expo-router";
import {createTicket} from "@/service/service";
import colors from "@/styles/colors";
import GoBackButton from "@/components/GoBackButton";


const SUBJECTS = [
    'Account Details',
    'Change Password',
    'Fighter Profile',
    'Credit History',
    'Purchase Credits',
    'Notification Settings',
    'Others',
];

const TicketSubmissionScreen = () => {
    const insets = useSafeAreaInsets();

    // Стейти
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [fileAttached, setFileAttached] = useState<any>(null);
    const [isSubjectModalVisible, setSubjectModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSendRequest = () => {
        if (!subject || !description) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }


        const data = new FormData();
        data.append('subject', subject);
        data.append('description', description);
        if (fileAttached) {
            data.append('file', fileAttached as any);
        }
        setLoading(true);
        createTicket(data)
            .then(res => {
                Alert.alert('Success', 'Your request has been sent successfully!');
                setSubject('');
                setDescription('');
                setFileAttached(null);
                router.back();
            })
            .catch(err => {
                Alert.alert('Error', 'Failed to send request');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Вибір файлу
    const handleFileAttach = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets?.[0]) return;

            const file = result.assets[0];

            if (file.size && file.size > 30 * 1024 * 1024) {
                Alert.alert('Error', 'File size should not exceed 30MB');
                return;
            }

            setFileAttached(file);
            Alert.alert('File Attached', `File: ${file.name}`);
        } catch {
            Alert.alert('Error', 'An unknown error occurred');
        }
    };

    // Вибір Subject
    const selectSubject = (selectedSubject: string) => {
        setSubject(selectedSubject);
        setSubjectModalVisible(false);
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={[
                    styles.container,
                    {paddingBottom: insets.bottom},
                ]}
                contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>

                    {/* Title */}
                    <Text style={styles.title}>Ticket Submission</Text>

                    {/* Description */}
                    {/*<Text style={styles.description}>*/}
                    {/*  If you couldn’t find the answers you were looking for in our FAQs,*/}
                    {/*  don’t worry – we're here to help! Simply create a support ticket, and*/}
                    {/*  our dedicated team will promptly assist you with your inquiry.*/}
                    {/*</Text>*/}
                    <Text style={styles.description}>
                        We&apos;re here to help! Simply create a support ticket, and
                        our dedicated team will promptly assist you with your inquiry.
                    </Text>

                    {/* Subject Picker */}
                    <TouchableOpacity
                        style={styles.inputBox}
                        onPress={() => setSubjectModalVisible(true)}>
                        <Text style={styles.placeholder}>
                            {subject || 'Choose a Subject*'}
                        </Text>
                        <Icon name="chevron-right" size={24} color={colors.gray}/>
                    </TouchableOpacity>

                    {/* Description Input */}
                    <View style={styles.textAreaContainer}>
                        <TextInput
                            style={styles.textArea}
                            multiline
                            placeholder="For a swift resolution to your concern, providing a detailed description of the problem is key."
                            placeholderTextColor={colors.gray}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    {/* Attach File */}
                    <TouchableOpacity
                        style={styles.attachButton}
                        onPress={handleFileAttach}>
                        <Icon name="paperclip" size={20} color={colors.primaryBlack}/>
                        <Text style={styles.attachButtonText}>
                            {fileAttached ? fileAttached?.name : 'Attach a File'}
                        </Text>
                    </TouchableOpacity>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSendRequest}
                        disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={colors.white}/>
                        ) : (
                            <Text style={styles.submitButtonText}>Send Request</Text>
                        )}
                    </TouchableOpacity>

                    {/* Modal for Subject Selection */}
                    <Modal visible={isSubjectModalVisible} transparent animationType="fade">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Choose a Subject</Text>
                                <FlatList
                                    data={SUBJECTS}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({item}) => (
                                        <TouchableOpacity
                                            style={styles.modalItem}
                                            onPress={() => selectSubject(item)}>
                                            <Text style={styles.modalItemText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity
                                    onPress={() => setSubjectModalVisible(false)}
                                    style={styles.closeModalButton}>
                                    <Text style={styles.closeModalText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </View>
    );
};

export default TicketSubmissionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 18,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    faqText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryGreen,
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '500',
        marginTop: 50,
    },
    description: {
        fontSize: 14,
        marginBottom: 30,
    },
    inputBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
        marginBottom: 16,
    },
    placeholder: {
        fontSize: 14,
    },
    textAreaContainer: {
        marginBottom: 16,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
        height: 120,
    },
    attachButton: {
        flexDirection: 'row',
        padding: 12,
        paddingVertical: 14,
        backgroundColor: colors.lightGray,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    attachButtonText: {
        textAlign: 'center',
        marginLeft: 8,
        fontWeight: '500',
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 16,
        borderRadius: 8,
    },
    submitButtonText: {
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'center',
        color: colors.white,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 8,
    },
    modalItem: {
        paddingVertical: 12,
    },
    modalItemText: {
        fontSize: 14,
    },
    closeModalText: {
        textAlign: 'center',
        marginTop: 12,
        fontSize: 14,
        color: colors.primaryGreen,
    },
    closeModalButton: {
        borderTopWidth: 1,
        borderColor: colors.lightGray,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 16,
        textAlign: 'center',
    },
});
