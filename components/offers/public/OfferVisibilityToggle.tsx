import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import colors from '@/styles/colors';

interface OfferVisibilityToggleProps {
    visibleToAll: boolean;
    onChange: (visibleToAll: boolean) => void;
}

const OfferVisibilityToggle: React.FC<OfferVisibilityToggleProps> = ({visibleToAll, onChange}) => {
    return (
        <View style={styles.container}>
            <View style={styles.segmentedControl}>
                <TouchableOpacity
                    style={[styles.segment, !visibleToAll && styles.segmentSelected]}
                    onPress={() => onChange(false)}
                >
                    <View style={styles.labelRow}>
                        <Text style={[styles.segmentText, !visibleToAll ? styles.textSelected : styles.textUnselected]}>
                            Private
                        </Text>
                        <Icon
                            name="information-outline"
                            size={18}
                            color={!visibleToAll ? colors.white : colors.primaryBlack}
                            onPress={() =>
                                Alert.alert(
                                    'Private Offer',
                                    'Only users you explicitly share this offer with will see it.'
                                )
                            }
                            style={styles.icon}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.segment, visibleToAll && styles.segmentSelected]}
                    onPress={() => onChange(true)}
                >
                    <View style={styles.labelRow}>
                        <Text style={[styles.segmentText, visibleToAll ? styles.textSelected : styles.textUnselected]}>
                            All Managers
                        </Text>
                        <Icon
                            name="information-outline"
                            size={18}
                            color={visibleToAll ? colors.white : colors.primaryBlack}
                            onPress={() =>
                                Alert.alert(
                                    'All Managers',
                                    'Every manager in the app will have access to this offer.'
                                )
                            }
                            style={styles.icon}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    segmentedControl: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.grayBackground,
    },
    segment: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56
    },
    segmentSelected: {
        backgroundColor: colors.primaryGreen,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 6,
    },
    textSelected: {
        color: colors.white,
    },
    textUnselected: {
        color: colors.primaryBlack,
    },
    icon: {
        marginLeft: 4,
    },
});

export default OfferVisibilityToggle;
