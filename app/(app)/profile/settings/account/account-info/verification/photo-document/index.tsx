import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera, CameraType, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import colors from '@/styles/colors';
import GoBackButton from '@/components/GoBackButton';

type Params = { documentType: string };

export default function VerifyAccountDocumentScreen() {
    const router = useRouter();
    const { documentType } = useLocalSearchParams<Params>();

    const [perm, requestPerm] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [busy, setBusy] = useState(false);
    const insets = useSafeAreaInsets();

    if (!perm) return null;
    if (!perm.granted) {
        return (
            <View style={styles.centered}>
                <Text style={styles.msg}>Camera access is required.</Text>
                <TouchableOpacity style={styles.grantBtn} onPress={requestPerm}>
                    <Text style={styles.btnTxt}>Grant permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const shoot = async () => {
        if (!cameraRef.current || busy) return;
        setBusy(true);
        try {
            const { uri } = await cameraRef.current.takePictureAsync({ quality: 0.8 });
            router.push({
                pathname: '/profile/settings/account/account-info/verification/photo-selfie',
                params: { documentPhoto: uri, documentType },
            });
        } catch {
            Alert.alert('Error', 'Failed to capture document.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <View style={[styles.main, { paddingBottom: insets.bottom }]}>
            <GoBackButton />
            <View style={styles.body}>
                <Text style={styles.title}>Take a Photo of Your {documentType}</Text>
                <Text style={styles.subtitle}>Ensure your document is visible and clear.</Text>

                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={'back'}
                />

                <TouchableOpacity style={styles.captureBtn} onPress={shoot} disabled={busy}>
                    <Text style={styles.btnTxt}>{busy ? 'Capturing…' : 'Capture Document'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ─── styles ─── */
const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: colors.background },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 22, fontWeight: '500', textAlign: 'center', color: colors.primaryBlack, marginBottom: 10 },
    subtitle: { fontSize: 14, textAlign: 'center', color: colors.primaryBlack, marginBottom: 20 },
    camera: { width: '100%', height: 400, borderRadius: 10, overflow: 'hidden', marginBottom: 20 },
    captureBtn: { backgroundColor: colors.primaryGreen, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
    grantBtn: { backgroundColor: colors.primaryGreen, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 16 },
    btnTxt: { color: colors.white, fontSize: 16, fontWeight: '500' },
    msg: { fontSize: 16, color: colors.primaryBlack, textAlign: 'center' },
});
