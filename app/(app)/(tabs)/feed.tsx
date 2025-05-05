import {Text, View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import PromotionMyOfferList from "@/components/offers/PromotionMyOfferList";

export default function Feed() {
    const {role} = useAuth();

    if (role === 'MANAGER') {
        return <>
            <View>
                <Text>
                    Feed for Manager
                </Text>
            </View>
        </>
    } else
        return <PromotionMyOfferList/>
}
