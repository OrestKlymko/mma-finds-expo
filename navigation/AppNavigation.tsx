import { Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function AppNavigation() {
    const { token, isLoading } = useAuth();
    if (isLoading) return null; // або <ActivityIndicator />
    const art=null
    return (
        <Stack>
            <Stack.Screen
                name={art!==null ? "(tabs)" : "welcome/index"}
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
