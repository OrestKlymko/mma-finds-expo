import React, {useEffect} from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Image} from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import {MaterialIcons} from '@expo/vector-icons';
import colors from '@/styles/colors';
import {FighterInfoResponse, VerificationState} from '@/service/response';

type ManageFighterHeaderAndButtonsProps = {
    fighter: FighterInfoResponse | undefined | null;
};

const STATE_CONFIG: Record<
    VerificationState | 'NONE',
    { label: string; icon: React.ComponentProps<typeof MaterialIcons>['name']; bg: string; fg: string }
> = {
    APPROVED: {
        label: 'Approved',
        icon: 'check-circle',
        bg: colors.primaryGreen,
        fg: colors.white,
    },
    PENDING: {
        label: 'Pending',
        icon: 'hourglass-full',
        bg: colors.orange,
        fg: colors.white,
    },
    REJECTED: {
        label: 'Rejected',
        icon: 'cancel',
        bg: colors.darkError,
        fg: colors.white,
    },
    NONE: {
        label: 'Not Verified',
        icon: 'help-outline',
        bg: colors.lightGray,
        fg: colors.primaryBlack,
    },
};

export const ManageFighterHeaderAndButtons = ({
                                                  fighter,
                                              }: ManageFighterHeaderAndButtonsProps) => {
    const router = useRouter();
    const {id} = useLocalSearchParams<{id: string}>();



    const onEdit = () => {
        if (!fighter) {
            console.error('Fighter data is not available');
            return;
        }
        router.push(`/(app)/manager/fighter/${id}/edit`);
    };

    // Pick config for current state (fallback to NONE)
    const {label, icon, bg, fg} =
        STATE_CONFIG[fighter?.verificationState ?? 'NONE'];

    return (
        <View style={styles.headerContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: fighter?.imageLink || 'https://via.placeholder.com/120',
                    }}
                    style={styles.profileImage}
                />
                <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                    <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.nameRow}>
                <Text style={styles.fighterName}>
                    {fighter?.name || 'Fighter Name'}
                </Text>
                <View style={[styles.statusBadge, {backgroundColor: bg}]}>
                    <MaterialIcons name={icon} size={16} color={fg} />
                    <Text style={[styles.statusText, {color: fg}]}>{label}</Text>
                </View>
            </View>

            <Text style={styles.managerName}>
                Manager:{' '}
                <Text style={styles.managerLink}>
                    {fighter?.managerName || 'Manager Name'}
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        marginVertical: 24,
    },
    imageContainer: {
        position: 'relative',
        width: 120,
        height: 120,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    editButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: colors.primaryGreen,
        padding: 6,
        borderRadius: 20,
    },

    nameRow: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 16,
    },
    fighterName: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    statusText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '500',
    },

    managerName: {
        marginTop: 8,
        fontSize: 16,
        color: colors.primaryBlack,
    },
    managerLink: {
        color: colors.primaryGreen,
        fontWeight: '500',
    },
});

export default ManageFighterHeaderAndButtons;
