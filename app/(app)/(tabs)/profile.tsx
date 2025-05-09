
import ManagerProfile from "@/components/ManagerProfile";
import {PromotionProfile} from "@/components/PromotionProfile";
import {useAuth} from "@/context/AuthContext";
import {PromotionEmployeeProfile} from "@/components/PromotionEmployeeProfile";

export default function Profile() {
    const {role} = useAuth();
    switch (role) {
        case 'PROMOTION':
            return <PromotionProfile/>
        case 'PROMOTION_EMPLOYEE':
            return <PromotionEmployeeProfile/>
        case 'MANAGER':
            return <ManagerProfile/>
        default:
            return null;
    }
}
