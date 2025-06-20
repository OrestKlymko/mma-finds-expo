import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
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

    const [busy, setBusy]   = useState(false);    // робимо фото
    const [photo, setPhoto] = useState<string | null>(null); // превʼю

    const insets = useSafeAreaInsets();

    /* ─── запит дозволу ─── */
    if (!perm) return null;
    if (!perm.granted)
        return (
            <View style={styles.centered}>
                <Text style={styles.msg}>Camera access is required.</Text>
                <TouchableOpacity style={styles.grantBtn} onPress={requestPerm}>
                    <Text style={styles.btnTxt}>Grant permission</Text>
                </TouchableOpacity>
            </View>
        );

    /* ─── зйомка ─── */
    const shoot = async () => {
        if (!cameraRef.current || busy) return;
        setBusy(true);
        try {
            const { uri } = await cameraRef.current.takePictureAsync({ quality: 0.8 });
            setPhoto(uri);                       // показуємо превʼю
        } catch {
            Alert.alert('Error', 'Failed to capture document.');
        } finally {
            setBusy(false);
        }
    };

    /* ─── підтвердження ─── */
    const confirm = () => {
        if (!photo) return;
        router.push({
            pathname: '/profile/settings/account/account-info/verification/photo-selfie',
            params: { documentPhoto: photo, documentType },
        });
    };

    return (
        <View style={[styles.main, { paddingBottom: insets.bottom }]}>
            <GoBackButton />
            <View style={styles.body}>
                <Text style={styles.title}>Take a Photo of Your {documentType}</Text>
                <Text style={styles.subtitle}>Ensure your document is visible and clear.</Text>

                {/* --- Камера або превʼю --- */}
                {!photo ? (
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing="back"
                    />
                ) : (
                    <Image source={{ uri: photo }} style={styles.camera} />
                )}

                {/* --- Кнопки --- */}
                {photo ? (
                    <>
                        <TouchableOpacity style={styles.captureBtn} onPress={confirm}>
                            <Text style={styles.btnTxt}>Confirm & Continue</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.captureBtn, styles.retakeBtn]}
                            onPress={() => setPhoto(null)}
                        >
                            <Text style={styles.btnTxt}>Retake</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.captureBtn} onPress={shoot} disabled={busy}>
                        <Text style={styles.btnTxt}>{busy ? 'Capturing…' : 'Capture Document'}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

/* ─── styles ─── */
const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: colors.background },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: {
        fontSize: 22,
        fontWeight: '500',
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.primaryBlack,
        marginBottom: 20,
    },
    camera: {
        width: '100%',
        height: 400,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    captureBtn: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 12,
        height:56,
        justifyContent: 'center',
    },
    retakeBtn: { backgroundColor: colors.primaryBlack },
    grantBtn: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
    },
    btnTxt: { color: colors.white, fontSize: 16, fontWeight: '500' },
    msg: { fontSize: 16, color: colors.primaryBlack, textAlign: 'center' },
});
