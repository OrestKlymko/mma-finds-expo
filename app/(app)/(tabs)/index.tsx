import {Text, View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import HomePromotion from "@/components/home/HomePromotion";

export default function Index() {
    const {role} = useAuth();
    if (role === 'PROMOTION') {
        return <HomePromotion/>
    }
    // return (
    //           <HomeManagerScreen/>
    // );

    return <>
        <View>
            <Text>
                Index
            </Text>
        </View>
    </>
}
