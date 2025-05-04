import {Slot} from 'expo-router';
import {AuthProvider} from '@/context/AuthContext';
import 'react-native-get-random-values';   // ← MUST come before any uuid import
import {store} from '@/store/store';
import {Provider as ReduxProvider} from 'react-redux';


export default function RootLayout() {
    return (
        <ReduxProvider store={store}>
        <AuthProvider>
           <Slot />
        </AuthProvider>
        </ReduxProvider>
    );
}
