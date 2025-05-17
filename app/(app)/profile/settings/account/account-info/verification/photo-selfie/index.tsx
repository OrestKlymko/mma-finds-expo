import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import {
    CameraView,
    useCameraPermissions,
} from 'expo-camera';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useLocalSearchParams, useRouter} from 'expo-router';
import GoBackButton from '@/components/GoBackButton';
import colors from '@/styles/colors';
import {sendVerificationDataForManager} from '@/service/service';

type Params = {
    documentPhoto: string;
    documentType: string;
};

export default function VerifyAccountSelfieScreen() {
    const router = useRouter();
    const {documentPhoto, documentType} = useLocalSearchParams<Params>();

    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [busy, setBusy] = useState(false);
    const [selfie, setSelfie] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    useEffect(() => {
        if (selfie) {
            setLoading(true);
            const formData = new FormData();
            formData.append('typeOfDocument', documentType);
            formData.append('document', {
                uri: documentPhoto,
                type: 'image/jpeg',
                name: 'document.jpg',
            } as any);
            formData.append('selfie', {
                uri: selfie,
                type: 'image/jpeg',
                name: 'selfie.jpg',
            } as any);

            sendVerificationDataForManager(formData).then(() => {
                Alert.alert('Success', 'Verification data sent successfully.');
                setSelfie(null);
                router.push('/(app)/(tabs)');
            }).catch(() => {
                Alert.alert('Error', 'Failed to send verification data.');
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [selfie]);

    if (!permission)
        return (
            <View style={styles.centered}>
                <Text>Requesting camera permission…</Text>
            </View>
        );

    if (!permission.granted)
        return (
            <View style={styles.centered}>
                <Text style={styles.msg}>Camera access is required to continue.</Text>
                <TouchableOpacity style={styles.grantBtn} onPress={requestPermission}>
                    <Text style={styles.btnTxt}>Grant permission</Text>
                </TouchableOpacity>
            </View>
        );


    const takeSelfie = async () => {
        if (!cameraRef.current || busy) return;
        setBusy(true);
        try {
            const {uri} = await cameraRef.current.takePictureAsync({quality: 0.8});
            setSelfie(uri);

        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Failed to capture selfie.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <GoBackButton/>
            <View style={[styles.main, {paddingBottom: insets.bottom}]}>
                <View style={styles.body}>
                    <Text style={styles.title}>Take a Selfie</Text>
                    <Text style={styles.subtitle}>Ensure your face is well‑lit and clearly visible.</Text>

                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing={'front'}
                    />

                    <TouchableOpacity style={styles.captureBtn} onPress={takeSelfie} disabled={busy || loading}>
                        {(busy || loading) ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.btnTxt}>Capture Selfie</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {flex: 1, backgroundColor: colors.background, paddingHorizontal: 20},
    centered: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    body: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    title: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '500',
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
        marginTop: 20,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    grantBtn: {
        backgroundColor: colors.primaryGreen,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
    },
    btnTxt: {color: colors.white, fontSize: 16, fontWeight: '500'},
    msg: {fontSize: 16, textAlign: 'center', color: colors.primaryBlack},
});
