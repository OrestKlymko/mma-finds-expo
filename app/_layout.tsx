import {Slot, Redirect} from 'expo-router';
import {useAuth, AuthProvider} from '@/context/AuthContext';

function RootLayoutInner() {
    const {token} = useAuth();

    if (token) {
        return <Redirect href="/welcome"/>;
    }

    return <Slot/>;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutInner/>
        </AuthProvider>
    );
}
