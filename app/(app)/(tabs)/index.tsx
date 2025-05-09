import {useAuth} from "@/context/AuthContext";
import HomePromotion from "@/components/home/HomePromotion";
import HomeManager from "@/components/home/HomeManager";
import HomePromotionEmployee from "@/components/home/HomePromotionEmployee";

export default function Index() {
    const {role} = useAuth();
    switch (role) {
        case 'MANAGER':
            return <HomeManager/>;
        case 'PROMOTION':
            return <HomePromotion/>;
        case 'PROMOTION_EMPLOYEE':
            return <HomePromotionEmployee/>;
        default:
            return null;
    }
}
