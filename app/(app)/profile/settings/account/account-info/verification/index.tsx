import {useAuth} from "@/context/AuthContext";
import VerificationManager from "@/components/VerificationManager";
import VerificationPromotion from "@/components/VerificationPromotion";
import {Text, View} from "react-native";

export default function Verification() {
    const {role} = useAuth();
    if (role === 'MANAGER') {
        return <VerificationManager/>
    } else if (role === 'PROMOTION') {
        return <VerificationPromotion/>
    } else return <View>
        <Text>Your role is not required for verification</Text>
    </View>
}
