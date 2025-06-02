import {Text, TouchableOpacity} from "react-native";
import colors from "@/styles/colors";
import React from "react";
import {useRouter} from "expo-router";

export const LogInAndSubmitFighterButton = () => {
    const router = useRouter();

        return <TouchableOpacity
            onPress={() => router.push('/sign-up/manager')}
            style={{
                backgroundColor: colors.primaryGreen,
                padding: 10,
                borderRadius: 20,
                height: 56,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Text style={{color: colors.white, fontSize: 14, fontWeight: '500'}}>
                Log in to submit your fighter
            </Text>
        </TouchableOpacity>
};
