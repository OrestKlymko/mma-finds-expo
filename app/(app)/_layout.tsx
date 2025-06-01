import { Redirect, Stack, useSegments } from 'expo-router';
import { Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout() {
    const { role, isLoading } = useAuth();
    const segments = useSegments();   // ['(public)', 'offer', 'exclusive', …]

    if (isLoading) return <Text>Loading…</Text>;

    // визначаємось, у яку групу зайшли
    const group = segments[0] ?? '';   // '', '(public)', '(private)', '(auth)'

    // ----- RULE 1: гість -----
    if (!role || role === 'ANONYMOUS') {
        //  дозволяємо тільки (public) та (auth)
        if (group !== '(public)' && group !== '(auth)') {
            return <Redirect href="/(auth)/welcome" />;
        }
    }

    // ----- RULE 2: авторизований, але роль не має доступу -----
    // Наприклад, якщо вам потрібно відсікти MANAGER від екранів PROMOTION
    //   можна додати додаткові перевірки тут.

    // ----- OK -----
    return <Stack screenOptions={{ headerShown: false }} />;
}
