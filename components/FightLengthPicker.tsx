import React, {useEffect, useState} from 'react';
import {Modal, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle,} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import colors from '@/styles/colors';

type FightLength = {
    minutes: number;
    rounds: number;
};

interface Props {
    fightLength: FightLength | null;
    setFightLength: (value: FightLength) => void;
    hasError?: boolean;
    label?: string;
    style?: StyleProp<ViewStyle>;
}

const FightLengthPicker: React.FC<Props> = ({
                                                fightLength,
                                                setFightLength,
                                                hasError = false,
                                                label = 'Fight Length*',
                                                style,
                                            }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedMinutes, setSelectedMinutes] = useState(5);
    const [selectedRounds, setSelectedRounds] = useState(3);

    const minutesOptions = ['1','2','3','4','5','6','7','8','9','10'];
    const roundsOptions = ['1','2','3','4','5','6','7','8','9','10'];

    useEffect(() => {
        if (isModalVisible && fightLength) {
            setSelectedMinutes(fightLength.minutes);
            setSelectedRounds(fightLength.rounds);
        }
    }, [isModalVisible, fightLength]);

    const handleConfirm = () => {
        setFightLength({
            minutes: selectedMinutes,
            rounds: selectedRounds,
        });
        setModalVisible(false);
    };

    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={[styles.inputRow, hasError && styles.errorBorder, style]}
                onPress={() => setModalVisible(true)}
            >
                <Text
                    style={[
                        styles.inputText,
                        fightLength && { color: colors.primaryBlack },
                        hasError && styles.errorText,
                    ]}
                >
                    {fightLength
                        ? `${fightLength.rounds} rounds : ${fightLength.minutes} minutes`
                        : 'Fight Length'}
                </Text>
                <Icon name="chevron-right" size={24} color={colors.primaryBlack} />
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Rounds</Text>
                            <Text style={styles.headerText}>Minutes</Text>
                        </View>

                        <View style={styles.pickerContainer}>
                            <WheelPickerExpo
                                height={180}
                                width={100}
                                initialSelectedIndex={roundsOptions.indexOf(selectedRounds.toString())}
                                items={roundsOptions.map(o => ({ label: o, value: o }))}
                                onChange={({ item }) =>
                                    setSelectedRounds(parseInt(item.value, 10))
                                }
                            />

                            <WheelPickerExpo
                                height={180}
                                width={100}
                                initialSelectedIndex={minutesOptions.indexOf(selectedMinutes.toString())}
                                items={minutesOptions.map(o => ({ label: o, value: o }))}
                                onChange={({ item }) =>
                                    setSelectedMinutes(parseInt(item.value, 10))
                                }
                            />
                        </View>

                        <TouchableOpacity style={styles.okButton} onPress={handleConfirm}>
                            <Text style={styles.okButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default FightLengthPicker;

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '400',
        color: colors.primaryBlack,
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        marginBottom: 20,
        height: 56,
    },
    inputText: {
        fontSize: 16,
        color: colors.gray,
    },
    errorBorder: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '70%',
        backgroundColor: colors.white,
        borderRadius: 15,
        paddingVertical: 20,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        paddingBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primaryBlack,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        paddingBottom: 20,
    },
    okButton: {
        width: '50%',
        backgroundColor: colors.primaryGreen,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
    },
    okButtonText: {
        fontSize: 18,
        color: colors.white,
        fontWeight: 'bold',
    },
});
