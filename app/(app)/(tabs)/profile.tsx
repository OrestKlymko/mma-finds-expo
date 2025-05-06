
import ManagerProfile from "@/components/ManagerProfile";
import {PromotionProfile} from "@/components/PromotionProfile";
import {useAuth} from "@/context/AuthContext";

export default function Profile() {
    const {role} = useAuth();
    if (role === 'PROMOTION') {
        return <PromotionProfile/>
    } else if(role === 'MANAGER') {
        return <ManagerProfile />
    }
}
