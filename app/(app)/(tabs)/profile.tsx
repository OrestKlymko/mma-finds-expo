import {useAuth} from "@/context/AuthContext";
import {PromotionProfile} from "@/components/PromotionProfile";
import ManagerProfile from "@/components/ManagerProfile";

export default function Profile() {
    // const {role} = useAuth();
    // if (role === 'PROMOTION') {
    //     return <PromotionProfile/>
    // } else if(role === 'MANAGER') {
    //     return <ManagerProfile />
    // }

    return <ManagerProfile />
}
