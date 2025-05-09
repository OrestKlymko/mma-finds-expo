import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';


import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {sendFeedback} from '@/service/service';
import {useNavigation} from '@react-navigation/native';
import * as DocumentPicker from "expo-document-picker";
import {useRouter} from "expo-router";

const TABS = [
    'My Account',
    'My Fighters',
    'Credits',
    'Submissions',
    'Settings',
];

const ShareAnIdeaScreen = () => {
    const [activeTab, setActiveTab] = useState('My Account');
    const [idea, setIdea] = useState('');
    const [fileAttached, setFileAttached] = useState(null); // Об'єкт файлу
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const navigation = useNavigation();
    // 📂 **Функція для прикріплення файлу**

    const handleAttachFile = async () => {
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

            setFileAttached({
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/octet-stream',
            });
        } catch (error) {
            Alert.alert('Error', 'Unknown error while attaching the file.');
        }
    };

    // 🚀 **Функція для надсилання даних**
    const handleSubmit = () => {
        if (!idea) {
            Alert.alert('Error', 'Please share your innovative idea!');
            return;
        }

        router.push('/login')


        const data = new FormData();
        setLoading(true);
        data.append('subject', activeTab);
        data.append('description', idea);
        data.append('type', 'BUG');
        if (fileAttached) {
            data.append('attachment', {
                uri: fileAttached.uri,
                type: fileAttached.type,
                name: fileAttached.name,
            });
        }

        sendFeedback(data)
            .then(() => {
                Alert.alert('Success', 'Your bug has been successfully submitted!');
                setIdea('');
                setFileAttached(null);
                navigation.goBack();
            })
            .catch(err => {
                Alert.alert('Error', 'Failed to submit your bug');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={{backgroundColor:colors.background,flex:1}}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={[styles.container, {paddingBottom: insets.bottom}]}
                contentContainerStyle={styles.scrollContent}>
                {/* Go Back Button */}
                <View>

                    {/* Title */}
                    <Text style={styles.title}>Report a Bug</Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        We are thrilled to continuously improve our app, and your bug reports
                        are invaluable in this journey. Your keen observations help us enhance
                        the user experience.
                    </Text>

                    {/* Tabs */}
                    <Text style={styles.label}>
                        Which part of the app did you encounter the issue?
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.tabsContainer}>
                        {TABS.map((tab, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.tab, activeTab === tab && styles.activeTab]}
                                onPress={() => setActiveTab(tab)}>
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === tab && styles.activeTabText,
                                    ]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Idea Input */}
                    <Text style={styles.label}>Tell us what happened!</Text>

                    <TextInput
                        style={styles.textArea}
                        placeholder="Providing a detailed description of the problem."
                        placeholderTextColor={colors.gray}
                        value={idea}
                        multiline
                        onChangeText={setIdea}
                    />

                    {/* Attach File */}
                    <TouchableOpacity
                        style={styles.attachButton}
                        onPress={handleAttachFile}>
                        <Icon name="paperclip" size={20} color={colors.primaryBlack} />
                        <Text style={styles.attachButtonText}>
                            {fileAttached ? `Attached: ${fileAttached.name}` : 'Attach a File'}
                        </Text>
                    </TouchableOpacity>

                    {/* Submit Button */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        {loading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default ShareAnIdeaScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },

    /** Header **/
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    /** Title **/
    title: {
        fontSize: 25,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 50,
        color: colors.primaryBlack,
    },

    /** Description **/
    description: {
        fontSize: 12,
        fontFamily: 'Roboto',
        textAlign: 'center',
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 24,
    },

    /** Tabs **/
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },

    tab: {
        paddingVertical: 15,
        paddingHorizontal: 16,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
    },

    activeTab: {
        backgroundColor: colors.primaryGreen,
    },

    tabText: {
        fontSize: 9,
        color: colors.primaryBlack,
        fontWeight: '400',
    },

    activeTabText: {
        color: colors.white,
    },

    /** Label **/
    label: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 16,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: colors.primaryGreen,
    },

    /** Text Area **/
    textArea: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 14,
        fontSize: 14,
        height: 120,
        textAlignVertical: 'top',
        marginBottom: 16,
    },

    /** Attach File **/
    attachButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGray,
        paddingVertical: 15,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        height: 56,
    },

    attachButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primaryBlack,
        marginLeft: 8,
    },

    /** Submit Button **/
    submitButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 15,
        height: 56,
        alignItems: 'center',
    },

    submitButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
});
