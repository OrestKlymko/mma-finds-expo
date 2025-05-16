import React from 'react';
import {Alert, Dimensions, Image, Linking, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import colors from "@/styles/colors";
import {ImageSelectorComponentProps} from "@/models/model";
import ImageCropPicker from 'react-native-image-crop-picker';


export function ImageSelectorComponent({
                                           image,
                                           setPhoto,
                                           hasSubmitted,
                                           isPoster = false,
                                       }: ImageSelectorComponentProps) {
    const hasError = hasSubmitted && !image;

    const onAddImage = async () => {
        /** 1. Перевірка permission – залишаємо, як є */
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please allow access to your media library to continue.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
            return;
        }

        try {
            /** 2. POSTER: звичайний ImagePicker (4:3) */
            if (isPoster) {
                const res = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });

                if (!res.canceled && res.assets.length) {
                    const a = res.assets[0];
                    setPhoto({
                        uri: a.uri,
                        type: a.mimeType ?? 'image/jpeg',
                        name: a.fileName ?? `poster_${Date.now()}.jpg`,
                    });
                }
            }
            /** 3. AVATAR: колове обрізання через ImageCropPicker */
            else {
                const img = await ImageCropPicker.openPicker({
                    width: 400,
                    height: 400,
                    cropping: true,
                    cropperCircleOverlay: true,   // ← коло!
                    mediaType: 'photo',
                    compressImageQuality: 0.8,
                });

                setPhoto({
                    uri: img.path,
                    type: img.mime ?? 'image/jpeg',
                    name: img.filename ?? `avatar_${Date.now()}.jpg`,
                });
            }
        } catch (e) {
            console.warn('Image picker error:', e);
        }
    };


    return (
        <View>
            <TouchableOpacity
                style={[
                    isPoster ? styles.posterPlaceholder : styles.imagePlaceholder,
                    hasError && styles.errorBorder,
                ]}
                onPress={onAddImage}>
                {image?.uri ? (
                    <Image
                        source={{uri: image.uri}}
                        style={isPoster ? styles.posterImage : styles.profileImage}
                        resizeMode="cover"
                    />
                ) : (
                    <Icon name="tray-arrow-up" size={35} color={colors.gray}/>
                )}
            </TouchableOpacity>
        </View>
    );
}

const screenWidth = Dimensions.get('window').width;
const POSTER_SIZE = screenWidth * 0.8;

const styles = StyleSheet.create({
    imagePlaceholder: {
        width: 74,
        height: 74,
        backgroundColor: '#fff',
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    posterPlaceholder: {
        width: POSTER_SIZE,
        height: POSTER_SIZE,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    posterImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    errorBorder: {
        borderColor: colors.error,
        borderWidth: 1,
    },
});
