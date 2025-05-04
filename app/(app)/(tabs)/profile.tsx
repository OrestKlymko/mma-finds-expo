import {useAuth} from "@/context/AuthContext";
import {PromotionProfile} from "@/app/(app)/profile/(component)/PromotionProfile";
import ManagerProfile from "@/app/(app)/profile/(component)/ManagerProfile";

export default function Profile() {
    // const {role} = useAuth();
    // if (role === 'PROMOTION') {
    //     return <PromotionProfile/>
    // } else if(role === 'MANAGER') {
    //     return <ManagerProfile />
    // }

    return <ManagerProfile />
}
