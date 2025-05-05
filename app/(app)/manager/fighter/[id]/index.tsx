import {useAuth} from "@/context/AuthContext";
import PromotionFighterDetails from "@/components/fighter/PromotionFighterDetails";

export default function Index() {
    const {role} = useAuth();
    if (role === 'PROMOTION') {
        return <PromotionFighterDetails/>
    }
}
