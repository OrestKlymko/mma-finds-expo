import React, {useState} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

import FloatingLabelInput from "./FloatingLabelInput";
import colors from "@/styles/colors";

interface SocialMediaModalProps {
    socialList?: { network: string; link: string }[];
    setSocialList: (list: { network: string; link: string }[]) => void;
}

const ICONS_MAP: Record<string, keyof typeof Icon.glyphMap> = {
    Facebook: 'facebook',
    Instagram: 'instagram',
    Twitter: 'twitter',
    Snapchat: 'snapchat',
};

const SOCIAL_MEDIA_OPTIONS = [
    {
        name: 'Facebook',
        icon: 'facebook',
        color: '#3b5998',
        pattern: /^https?:\/\/(www\.)?facebook\.com\/[\w.-]+\/?$/,
    },
    {
        name: 'Instagram',
        icon: 'instagram',
        color: '#E1306C',
        pattern: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+\/?$/,
    },
    {
        name: 'Twitter',
        icon: 'twitter',
        color: '#1DA1F2',
        pattern: /^https?:\/\/(www\.)?twitter\.com\/[\w.-]+\/?$/,
    },
    {
        name: 'Snapchat',
        icon: 'snapchat',
        color: '#FFFC00',
        pattern: /^https?:\/\/(www\.)?snapchat\.com\/add\/[\w.-]+\/?$/,
    },
];

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({
                                                               socialList,
                                                               setSocialList,
                                                           }) => {
    const [selectedSocial, setSelectedSocial] = useState<string | null>(
        'Facebook',
    );
    const [socialLink, setSocialLink] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [visible, setSocialMediaModalVisible] = useState(false);

    const handleAdd = () => {
        if (!selectedSocial || !socialLink || errorMessage) return;

        const alreadyExists = socialList?.some(
            item => item.network === selectedSocial,
        );
        if (alreadyExists) {
            setErrorMessage(`${selectedSocial} is already added`);
            return;
        }
        if (socialList) {
            setSocialList([
                ...socialList,
                {network: selectedSocial, link: socialLink},
            ]);
        }

        setSelectedSocial(null);
        setSocialLink('');
        setErrorMessage(null);
        setSocialMediaModalVisible(false);
    };

    const handleRemoveSocial = (index: number) => {
        const newList = socialList?.filter((_, i) => i !== index);
        if (newList) {
            setSocialList(newList);
        }
    };

    const validateLink = (link: string) => {
        if (!selectedSocial) return;

        const selectedPlatform = SOCIAL_MEDIA_OPTIONS.find(
            option => option.name === selectedSocial,
        );
        if (!selectedPlatform) return;

        const isValid = selectedPlatform.pattern.test(link.trim());
        setErrorMessage(
            isValid
                ? null
                : `Invalid ${selectedSocial} URL. Example: https://${selectedPlatform.name.toLowerCase()}.com/yourusername`,
        );
    };

    const handleLinkChange = (text: string) => {
        setSocialLink(text);
        validateLink(text);
    };

    const renderSocialItem = ({
                                  item,
                              }: {
        item: (typeof SOCIAL_MEDIA_OPTIONS)[0];
    }) => {
        const isSelected = selectedSocial === item.name;

        return (
            <TouchableOpacity
                style={[styles.socialItem, isSelected && styles.selectedItem]}
                onPress={() => {
                    setSelectedSocial(item.name);
                    setSocialLink('');
                    setErrorMessage(null);
                }}>
                <Icon
                    name={ICONS_MAP[item.icon]}
                    size={28}
                    color={item.color}
                    style={styles.socialIcon}
                />
                <Text style={styles.socialItemText}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styles.socialMediaContainer}>
                <TouchableOpacity
                    style={styles.socialMediaField}
                    onPress={() => setSocialMediaModalVisible(true)}>
                    <Text style={styles.socialMediaPlaceholder}>Social Media</Text>
                    <Icon name="chevron-right" size={24} color={colors.primaryBlack}/>
                </TouchableOpacity>

                {socialList?.map((item, idx) => (
                    <View key={idx} style={styles.socialItemCard}>
                        <View style={styles.socialItemInfo}>
                            <Icon
                                name={ICONS_MAP[item.network.toLowerCase()]}
                                size={24}
                                color={colors.primaryGreen}
                            />
                            <Text style={styles.socialItemLink}>{item.link.slice(0, 28) + '...'}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleRemoveSocial(idx)}>
                            <Icon name="close-circle" size={24} color={colors.error} style={styles.iconDelete}/>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setSocialMediaModalVisible(false)}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Social Media</Text>

                        <FlatList
                            data={SOCIAL_MEDIA_OPTIONS}
                            keyExtractor={item => item.name}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderSocialItem}
                            contentContainerStyle={styles.socialListContainer}
                        />

                        <FloatingLabelInput
                            label="Link to your profile"
                            value={socialLink}
                            onChangeText={handleLinkChange}
                        />
                        {errorMessage && (
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        )}

                        {/* Buttons row */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[
                                    styles.addButton,
                                    (!socialLink || !!errorMessage) && styles.disabledButton,
                                ]}
                                onPress={handleAdd}
                                disabled={!socialLink || !!errorMessage}>
                                <Text style={styles.addButtonText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setSocialMediaModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default SocialMediaModal;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
        color: colors.primaryBlack,
    },
    socialListContainer: {
        paddingVertical: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        width: '100%',
    },

    socialItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 67,
        height: 56,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.gray,
    },
    selectedItem: {
        borderColor: colors.primaryGreen,
        backgroundColor: '#EEF7F0',
    },
    socialIcon: {
        marginBottom: 6,
    },
    socialItemText: {
        fontSize: 10,
        fontWeight: '500',
        color: colors.primaryBlack,
    },
    linkInput: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        marginTop: 20,
        marginBottom: 5,
        fontSize: 15,
        color: colors.primaryBlack,
    },
    errorInput: {
        borderColor: colors.error,
    },
    errorText: {
        marginTop: 5,
        color: colors.error,
        fontSize: 12,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    addButton: {
        backgroundColor: colors.primaryGreen,
        borderRadius: 8,
        paddingHorizontal: 20,
        flex: 1,
        marginRight: 8,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: colors.gray,
    },
    addButtonText: {
        color: colors.white,
        fontWeight: '500',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#b22e2e',
        borderRadius: 8,
        paddingHorizontal: 20,
        flex: 1,
        marginLeft: 8,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: colors.white,
        fontWeight: '500',
        textAlign: 'center',
    },
    socialMediaField: {
        borderWidth: 1,
        borderColor: colors.primaryBlack,
        borderRadius: 9,
        paddingHorizontal: 12,
        height: 56,
        color: colors.primaryBlack,
        marginBottom: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    socialMediaPlaceholder: {
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '400',
        color: colors.primaryBlack,
    },
    socialMediaContainer: {},
    socialItemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray,
        padding: 10,
        height: 56,
        marginBottom: 15,
    },
    socialItemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    socialItemLink: {
        fontSize: 16,
        color: colors.primaryBlack,
        marginLeft: 8,
        flexShrink: 1,
    },
    iconDelete: {
        position: 'absolute',
        right: 0,
        bottom: -13,
    }
});
