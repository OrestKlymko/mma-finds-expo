import {Slot} from 'expo-router';
import {AuthProvider} from '@/context/AuthContext';
import 'react-native-get-random-values';   // ← MUST come before any uuid import

export default function RootLayout() {
    return (
        <AuthProvider>
           <Slot />
        </AuthProvider>
    );
}
