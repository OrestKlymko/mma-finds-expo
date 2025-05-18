import GoBackButton from '@/components/GoBackButton';
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useAuth} from '@/context/AuthContext';
import {Image} from "expo-image";
import {useRouter} from "expo-router";

type Props = {
  eventImageLink: string | undefined;
};

export const EventPosterImage = ({eventImageLink}: Props) => {
  const router = useRouter();
  return (
    <View style={styles.imageWrapper}>
      <Image
        source={{
          uri: eventImageLink || 'https://via.placeholder.com/400x200',
        }}
        style={styles.eventImage}
      />
      <GoBackButton
        color={'white'}
        style={{position: 'absolute', left: 10}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    aspectRatio: 1,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
