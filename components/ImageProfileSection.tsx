import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ImageSelectorComponent} from '@/components/ImageSelectorComponent';
import {Photo} from "@/models/model";

interface ProfileSectionProps {
  profileImage: Photo | null | undefined;
  setProfileImage: (image: Photo | null) => void;
  hasSubmitted: boolean;
}

const ImageProfileSection: React.FC<ProfileSectionProps> = ({
  profileImage,
  setProfileImage,
  hasSubmitted,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Profile Picture*</Text>
        <Text style={styles.subtitle}>Please insert your logo or photo.</Text>
      </View>
      <ImageSelectorComponent
        image={profileImage}
        setPhoto={setProfileImage}
        hasSubmitted={hasSubmitted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    color: 'rgb(19, 19, 19)',
  },
  subtitle: {
    fontSize: 11,
    color: 'rgb(61, 61, 61)',
    marginBottom: 10,
  },
});

export default ImageProfileSection;
