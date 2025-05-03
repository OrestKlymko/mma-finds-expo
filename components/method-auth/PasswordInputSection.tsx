import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '../../styles/colors';
import FloatingLabelInput from "@/components/FloatingLabelInput";


interface PasswordInputSectionProps {
  onValidationChange: (isValid: boolean) => void;
  onPasswordChange: (password: string, confirmPassword: string) => void;
  titleFirst?: string;
  hasSubmitted?: boolean;
}

const checkRequirements = (password: string) => {
  const lengthReq = password.length >= 8 && password.length <= 20;
  const uppercaseReq = /[A-Z]/.test(password);
  const digitReq = /\d/.test(password);

  return {
    lengthReq,
    uppercaseReq,
    digitReq,
  };
};

const getStrengthLevel = (password: string): number => {
  if (password.length === 0) return 0;
  if (password.length < 8) return 1;
  if (password.length < 12) return 2;
  return 3;
};

const getStrengthLabel = (level: number): string => {
  if (level === 1) return 'Very Weak';
  if (level === 2) return 'Good';
  if (level === 3) return 'Great';
  return '';
};

const PasswordInputSection: React.FC<PasswordInputSectionProps> = ({
  onValidationChange,
  onPasswordChange,
  titleFirst,
  hasSubmitted,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [isConfirmTouched, setIsConfirmTouched] = useState(false); // Новий стан для відстеження завершення вводу

  const {lengthReq, uppercaseReq, digitReq} = checkRequirements(password);
  const strengthLevel = getStrengthLevel(password);
  const strengthLabel = getStrengthLabel(strengthLevel);

  useEffect(() => {
    onPasswordChange(password, confirmPassword);
    validatePasswords(password, confirmPassword);
  }, [password, confirmPassword]);

  const validatePasswords = (pass: string, conf: string) => {
    const match = pass === conf && lengthReq && uppercaseReq && digitReq;
    setPasswordsMatch(match);
    onValidationChange(match);
  };

  const getBarStyle = (barIndex: number) => {
    if (strengthLevel === 1 && barIndex === 1) return styles.activeWeak;
    if (strengthLevel === 2 && barIndex <= 2) return styles.activeGood;
    if (strengthLevel === 3 && barIndex <= 3) return styles.activeGreat;
    return null;
  };

  return (
    <View>
      {/* Password Field */}
      <View style={styles.inputContainer}>
        <View style={styles.passwordRow}>
          <FloatingLabelInput
            isRequired={true}
            hasSubmitted={hasSubmitted}
            label={titleFirst || 'Password*'}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={!passwordVisible}
            containerStyle={styles.floatingPasswordContainer}
          />
          <TouchableOpacity
            style={styles.eyeIconButton}
            onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={colors.primaryBlack}
            />
          </TouchableOpacity>
        </View>

        {/* Strength Bar */}
        <View style={styles.strengthBarContainer}>
          <View style={[styles.strengthSegment, getBarStyle(1)]} />
          <View style={[styles.strengthSegment, getBarStyle(2)]} />
          <View style={[styles.strengthSegment, getBarStyle(3)]} />
        </View>
        <Text style={styles.strengthText}>{strengthLabel}</Text>
      </View>

      {/* Password Requirements */}
      <View style={styles.reqContainer}>
        <Text style={styles.requirementsTitle}>
          Your password must contain:
        </Text>
        <View style={styles.requirementRow}>
          <Icon
            name={lengthReq ? 'check-circle' : 'close-circle'}
            size={18}
            color={lengthReq ? colors.primaryGreen : colors.error}
          />
          <Text style={styles.requirementText}>
            Between 8 and 20 characters
          </Text>
        </View>
        <View style={styles.requirementRow}>
          <Icon
            name={uppercaseReq ? 'check-circle' : 'close-circle'}
            size={18}
            color={uppercaseReq ? colors.primaryGreen : colors.error}
          />
          <Text style={styles.requirementText}>1 upper-case letter</Text>
        </View>
        <View style={styles.requirementRow}>
          <Icon
            name={digitReq ? 'check-circle' : 'close-circle'}
            size={18}
            color={digitReq ? colors.primaryGreen : colors.error}
          />
          <Text style={styles.requirementText}>1 or more numbers</Text>
        </View>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <View style={styles.passwordRow}>
          <FloatingLabelInput
            isRequired={true}
            hasSubmitted={hasSubmitted}
            label="Confirm Password*"
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              setIsConfirmTouched(true);
            }}
            secureTextEntry={!confirmVisible}
            containerStyle={styles.floatingPasswordContainer}
          />
          <TouchableOpacity
            style={styles.eyeIconButton}
            onPress={() => setConfirmVisible(!confirmVisible)}>
            <Icon
              name={confirmVisible ? 'eye-off' : 'eye'}
              size={20}
              color={colors.primaryBlack}
            />
          </TouchableOpacity>
        </View>
        {isConfirmTouched && passwordsMatch === false && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )}
      </View>
    </View>
  );
};

export default PasswordInputSection;

const styles = StyleSheet.create({
  inputContainer: {marginBottom: 15},
  passwordRow: {flexDirection: 'row', alignItems: 'center'},
  floatingPasswordContainer: {flex: 1},
  eyeIconButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -10}],
  },
  strengthBarContainer: {flexDirection: 'row', marginTop: 10},
  strengthSegment: {
    flex: 1,
    height: 6,
    backgroundColor: colors.gray,
    marginHorizontal: 2,
  },
  activeWeak: {backgroundColor: 'rgb(192, 24, 24)'},
  activeGood: {backgroundColor: 'rgb(159, 184, 93)'},
  activeGreat: {backgroundColor: 'rgb(77, 184, 71)'},
  strengthText: {fontSize: 12, textAlign: 'right', marginTop: 5},
  reqContainer: {marginBottom: 15},
  requirementsTitle: {fontWeight: 'bold', marginBottom: 5},
  requirementRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 5},
  requirementText: {marginLeft: 8},
  errorText: {color: colors.error, marginTop: 5, marginBottom: 5},
});
