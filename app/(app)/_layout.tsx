import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import {useAuth} from "@/context/AuthContext";

export default function AppLayout() {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!token) {
          return <Redirect href="/(auth)/welcome" />;
    }

    return <Stack />;
}
