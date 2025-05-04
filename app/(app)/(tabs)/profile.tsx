import {Text, View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import {PromotionProfile} from "@/app/(app)/profile/(component)/PromotionProfile";

export default function Profile() {
    const {role} = useAuth();
    if (role === 'PROMOTION') {
        return <PromotionProfile/>
    }
}
