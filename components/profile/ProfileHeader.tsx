import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

import React, {useState} from 'react';
import {ProfileSwitcherBottomSheet} from './ProfileSwitcherBottomSheet';
import {Image} from "expo-image";
import {UserInfoResponse} from "@/service/response";
import colors from "@/styles/colors";
import {useRouter} from "expo-router";

type ProfileHeaderProps = {
  userInfo: UserInfoResponse | null;
};

export const ProfileHeader = ({userInfo}: ProfileHeaderProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  return (
    <View style={styles.profileHeader}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push('/notification')}>
        <Icon name="bell-outline" size={24} color={colors.white} />
      </TouchableOpacity>
      <View style={styles.profileImageContainer}>
        <Image
          source={{uri: userInfo?.imageLink}}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.profileTitleContainer}>
          <Text style={styles.title}>{userInfo?.name}</Text>

          {userInfo?.isVerified && (
            <Icon
              name="check-circle"
              size={20}
              color={colors.white}
              style={styles.icon}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.switchProfileButton}
          onPress={()=>setModalVisible(true)}>
          <Text style={styles.switchProfileText}>Switch Profile</Text>
          <Icon
            name="swap-horizontal"
            size={18}
            color={colors.primaryBlack}
            style={styles.switchIcon}
          />
        </TouchableOpacity>
      </View>
      <ProfileSwitcherBottomSheet
        userInfo={userInfo}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    paddingTop: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: colors.primaryGreen,
    position: 'relative',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#ccc',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.white,
    marginRight: 8,
  },

  iconButton: {
    padding: 0,
    position: 'absolute',
    right: 30,
    top: 60,
  },
  icon: {
    marginLeft: 4,
  },
  switchProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderColor: colors.primaryGreen,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    width: '100%',
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start', // щоб кнопка не тягнулась по ширині
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // для Android
  },

  switchProfileText: {
    fontSize: 14,
    color: colors.primaryBlack,
    fontWeight: '500',
  },

  switchIcon: {
    marginLeft: 6,
    marginTop: 1, // вирівнює з текстом
  },
});
