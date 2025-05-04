import {StyleSheet, Text, View} from "react-native";
import {ImageSelectorComponent} from "@/components/ImageSelectorComponent";
import React from "react";

type EventPosterProps = {
    profileImage: string;
    setProfileImage: (image: string) => void;
    hasSubmitted: boolean;
}

export const EventPoster = (
    {profileImage, setProfileImage, hasSubmitted}: EventPosterProps
) => {

    return <>
        <View style={styles.imageContainer}>
            <View>
                <Text style={styles.titleProfile}>Event Poster*</Text>
                <Text style={styles.subtitleProfile}>
                    Please insert event photo or poster. Required resolution: 1080x1080.
                </Text>
            </View>
        </View>
        <ImageSelectorComponent
            image={profileImage}
            setPhoto={setProfileImage}
            hasSubmitted={hasSubmitted}
            isPoster={true}
        />
    </>;
};
const styles = StyleSheet.create({
    imageContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 40,
    },
    titleProfile: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 19,
        marginBottom: 12,
        color: 'rgb(19, 19, 19)',
    },
    subtitleProfile: {
        fontSize: 11,
        fontWeight: '400',
        lineHeight: 13,
        color: 'rgb(61, 61, 61)',
    },
});
