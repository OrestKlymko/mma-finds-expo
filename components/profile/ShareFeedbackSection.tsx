import {Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import React, {useState} from 'react';
import colors from "@/styles/colors";
import {useRouter} from "expo-router";

export const ShareFeedbackSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const openFeedback = () => setIsVisible(true);
  const closeFeedback = () => setIsVisible(false);
  const router = useRouter();
  return (
    <>
      <View style={{paddingHorizontal: 30, marginBottom: 90}}>
        <TouchableOpacity style={styles.item} onPress={openFeedback}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.iconContainer}>
              <Icon
                name="lightbulb-outline"
                size={21}
                color={colors.primaryGreen}
                style={styles.icon}
              />
            </View>
            <Text style={styles.itemText}>Share Feedback!</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Feedback Modal */}
      <Modal
        visible={isVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeFeedback}>
        <TouchableWithoutFeedback onPress={closeFeedback}>
          <View style={styles.feedbackOverlay}>
            <View style={styles.feedbackContainer}>
              {/* 🌟 Share an Idea */}
              <TouchableOpacity
                style={styles.feedbackItem}
                onPress={() => {
                  closeFeedback();
                  router.push('/(app)/profile/help/share-idea')
                }}>
                <Icon
                  name="lightbulb-outline"
                  size={24}
                  color={colors.primaryBlack}
                />
                <View style={styles.feedbackTextContainer}>
                  <Text style={styles.feedbackItemTitle}>Share an Idea</Text>
                  <Text style={styles.feedbackItemSubtitle}>
                    I&apos;d like to propose an idea or request a new feature.
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={24}
                  color={colors.primaryGreen}
                />
              </TouchableOpacity>

              {/* 🐞 Report a Bug */}
              <TouchableOpacity
                style={styles.feedbackItem}
                onPress={() => {
                  closeFeedback();
                  router.push('/(app)/profile/help/report-bug')
                }}>
                <Icon
                  name="bug-outline"
                  size={24}
                  color={colors.primaryBlack}
                />
                <View style={styles.feedbackTextContainer}>
                  <Text style={styles.feedbackItemTitle}>Report a Bug</Text>
                  <Text style={styles.feedbackItemSubtitle}>
                    Experiencing an issue or unexpected behavior? Let us know!
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={24}
                  color={colors.primaryGreen}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={closeFeedback}>
                <Text style={styles.closeButton}>
                  For inquiries or questions about your account, please reach
                  out to us through the{' '}
                  <Text
                    style={styles.supportLink}
                    onPress={() => {
                      closeFeedback();
                      router.push('/(app)/profile/help/support')
                    }}>
                    Support zone
                  </Text>
                  .
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  /** ITEM **/
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'white',
    marginRight: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.primaryBlack,
  },
  icon: {
    marginLeft: 4,
  },
  feedbackButton: {
    marginVertical: 16,
    alignItems: 'center',
  },
  feedbackButtonText: {
    fontSize: 16,
    color: colors.primaryGreen,
  },
  feedbackOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  feedbackContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 16,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  feedbackTextContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginRight: 24,
    marginLeft: 20,
  },
  feedbackItemTitle: {
    fontWeight: '400',
    fontSize: 16,
    marginBottom: 4,
  },
  feedbackItemSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.primaryBlack,
  },
  closeButton: {
    marginTop: 12,
    paddingHorizontal: 10,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: colors.primaryBlack,
    marginBottom: 36,
  },
  supportLink: {
    color: colors.primaryGreen,
    fontWeight: '500',
  },
});
