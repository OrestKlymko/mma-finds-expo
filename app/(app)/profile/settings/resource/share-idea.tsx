import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import GoBackButton from "@/components/GoBackButton";
import {sendFeedback} from "@/service/service";
import colors from "@/styles/colors";
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
    const [fileAttached, setFileAttached] = useState<any>(null); // Об'єкт файлу
    const insets = useSafeAreaInsets();
    const {token, methodAuth} = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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

        if (!token || !methodAuth) {
            Alert.alert('Error', 'You are not authorized to send feedback.');
            router.push('/login');
            return;
        }

        const data = new FormData();
        setLoading(true);
        data.append('subject', activeTab);
        data.append('description', idea);
        data.append('type', 'IDEA');
        if (fileAttached) {
            data.append('attachment', {
                uri: fileAttached.uri,
                type: fileAttached.type,
                name: fileAttached.name,
            } as any);
        }

        sendFeedback(data)
            .then(() => {
                Alert.alert('Success', 'Your idea has been successfully submitted!');
                setIdea('');
                setFileAttached(null);
                router.back();
            })
            .catch(err => {
                Alert.alert('Error', 'Failed to submit your idea');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={{backgroundColor: colors.background, flex: 1}}>
            <GoBackButton />
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={[styles.container, {paddingBottom: insets.bottom}]}
                contentContainerStyle={styles.scrollContent}>
                {/* Go Back Button */}
                <View>
                    {/* Title */}
                    <Text style={styles.title}>Share an Idea</Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        We are truly grateful for any innovative ideas that enhance the
                        overall experience of our app users, as your insights play a vital
                        role in shaping and enriching our platform!
                    </Text>

                    {/* Tabs */}
                    <Text style={styles.label}>To which area is your idea related?</Text>

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
                    <Text style={styles.label}>Tell us about your idea!</Text>

                    <TextInput
                        style={styles.textArea}
                        placeholder="Share your innovative idea here..."
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
                            {fileAttached
                                ? `Attached: ${fileAttached.name}`
                                : 'Attach a File'}
                        </Text>
                    </TouchableOpacity>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Idea</Text>
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
        fontSize: 15,
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
        fontSize: 14,
        fontWeight: '500',
        color: colors.primaryBlack,
        marginLeft: 8,
    },

    /** Submit Button **/
    submitButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        height: 56,
        justifyContent: 'center',
    },

    submitButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },
});
