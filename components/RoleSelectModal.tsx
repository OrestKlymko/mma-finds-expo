import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
} from 'react-native';
import colors from '@/styles/colors';

export type UserRole = 'MANAGER' | 'PROMOTION' | 'PROMOTION_EMPLOYEE';

interface Props {
    visible: boolean;
    roles: UserRole[];
    onSelect: (role: UserRole) => void;
    onClose: () => void;
}

const labels: Record<UserRole, string> = {
    MANAGER: 'Manager',
    PROMOTION: 'Promotion',
    PROMOTION_EMPLOYEE: 'Promotion Employee',
};

const RoleSelectModal: React.FC<Props> = ({
                                              visible,
                                              roles,
                                              onSelect,
                                              onClose,
                                          }) => (
    <Modal
        key={roles.join('-')}
        transparent
        statusBarTranslucent
        presentationStyle="overFullScreen"
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}
    >
        {/* =====  ПОВНОЕКРАННИЙ КОНТЕЙНЕР  ===== */}
        <View style={styles.overlay}>
            {/* напівпрозорий фон */}
            <Pressable style={styles.backdrop} onPress={onClose} />

            {/* панель унизу */}
            <View style={styles.sheet}>
                <Text style={styles.title}>Choose your role</Text>

                {roles.map(role => (
                    <TouchableOpacity
                        key={role}
                        style={styles.roleBtn}
                        onPress={() => onSelect(role)}
                    >
                        <Text style={styles.roleText}>{labels[role]}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,                   // ⬅️ важливо: дає висоту/ширину всьому екрану
        justifyContent: 'flex-end' // “sheet” прилипає донизу
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheet: {
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: colors.white,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primaryBlack,
        marginBottom: 16,
    },
    roleBtn: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    roleText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default RoleSelectModal;
