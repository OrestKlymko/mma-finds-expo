import React from 'react';
import {Alert, Dimensions, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {ProfileCard} from './ProfileCard';
import {USER_ROLE, UserInfoResponse} from "@/service/response";
import {useAuth} from "@/context/AuthContext";
import {ChangeProfileRequest} from "@/service/request";
import {changeProfile} from "@/service/service";
import colors from "@/styles/colors";
import {useRouter} from "expo-router";

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  userInfo?: UserInfoResponse | null;
};

export const ProfileSwitcherBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  userInfo,
}) => {
  const {role, setRole, setToken, setMethodAuth, setEntityId} = useAuth();
  const router = useRouter();
  const chooseAnotherProfile = async (switchToRole: USER_ROLE) => {
    if (switchToRole === role) {
      onClose();
      return;
    }

    // 2) close the sheet immediately
    onClose();

    try {
      const data: ChangeProfileRequest = {
        switchToRole,
        entityId:
          switchToRole === 'MANAGER'
            ? userInfo?.managerId
            : userInfo?.promotionId,
      };
      const response = await changeProfile(data);
      // 3) update your auth‐context
      setToken(response.token);
      setRole(response.role);
      setMethodAuth(response.methodAuth);
      setEntityId(response.entityId);

      router.replace('/(app)/(tabs)');
    } catch (e) {
      console.error('failed to switch profile', e);
      Alert.alert('Error', 'Could not switch profile. Please try again.');
    }
  };

  const onAddProfile = () => {
    onClose();
    if (role === 'MANAGER') {
      router.push({pathname: '/(auth)/sign-up/promotion', params: {secondProfile: 'true'}})
    } else {
      router.push({pathname: '/(auth)/sign-up/manager', params: {secondProfile: 'true'}})
    }
  };

  const canAddProfile =
    (role === 'MANAGER' && !userInfo?.promotionId) ||
    (role === 'PROMOTION' && !userInfo?.managerId);

  const addProfileLabel =
    role === 'MANAGER' ? 'Add Promotion Profile' : 'Add Manager Profile';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      {/* backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}></Pressable>
      <View style={styles.sheet}>
        <View style={styles.grabber} />

        <Text style={styles.title}>Choose Your Profile</Text>
        {userInfo?.managerId && (
          <ProfileCard
            label={'Manager'}
            onPress={() => chooseAnotherProfile('MANAGER')}
            isActive={role === 'MANAGER'}
          />
        )}
        {userInfo?.promotionId && (
          <ProfileCard
            label={'Promotion'}
            onPress={() => chooseAnotherProfile('PROMOTION')}
            isActive={role === 'PROMOTION'}
          />
        )}
        {canAddProfile && (
          <TouchableOpacity
            style={styles.addProfileButton}
            activeOpacity={0.8}
            onPress={onAddProfile}>
            <Text style={styles.addProfileText}>{addProfileLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const SHEET_HEIGHT = SCREEN_HEIGHT * 0.8;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: SHEET_HEIGHT,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    elevation: 14, // Android
    shadowColor: '#000', // iOS
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: -3},
  },

  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray,
    marginBottom: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryBlack,
    marginBottom: 12,
  },

  /* ---------- ADD PROFILE BUTTON ---------- */
  addProfileButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: colors.primaryGreen,
    borderRadius: 10,
    paddingVertical: 12,
    height: 56,
  },
  addProfileText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
