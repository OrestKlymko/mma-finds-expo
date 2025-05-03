import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import colors from "@/styles/colors";
import {useRouter} from "expo-router";

interface FooterSignUpProps {
  colorText?: string;
}

export const FooterSignUp = ({colorText}: FooterSignUpProps) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRoleSelection = (role: string) => {
    setIsModalVisible(false);
    if (role === 'manager') {
      router.push({pathname: '/sign-up/manager', params: {secondProfile: 'false'}});
    } else if (role === 'promotion') {
      router.push({pathname: '/sign-up/promotion', params: {secondProfile: 'false'}});
    }
  };

  return (
    <View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            {color: colorText === 'white' ? colors.white : colors.primaryBlack},
          ]}>
          Don’t have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push('/welcome')}>
          <Text style={styles.footerLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for role selection */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Your Role</Text>
            <Pressable
              style={[
                styles.modalButton,
                {backgroundColor: colors.primaryGreen},
              ]}
              onPress={() => handleRoleSelection('manager')}>
              <Text style={styles.modalButtonText}>I&apos;m Manager</Text>
            </Pressable>
            <Pressable
              style={[
                styles.modalButton,
                {backgroundColor: colors.secondaryBlack},
              ]}
              onPress={() => handleRoleSelection('promotion')}>
              <Text style={styles.modalButtonText}>I&apos;m Promotion</Text>
            </Pressable>
            <Pressable onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 16,
    color: colors.primaryBlack,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '500',
    lineHeight: 16,
    color: colors.primaryGreen,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginBottom: 20,
    color: colors.primaryBlack,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: colors.white,
  },
  modalCancel: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: '400',
    color: colors.error,
  },
});

export default FooterSignUp;
