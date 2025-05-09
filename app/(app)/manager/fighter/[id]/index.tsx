import {useAuth} from "@/context/AuthContext";
import PromotionFighterDetails from "@/components/fighter/PromotionFighterDetails";
import ManagerFighterDetails from "@/components/fighter/ManagerFighterDetails";

export default function Index() {
    const {role} = useAuth();
    if (role === 'PROMOTION'||role==='PROMOTION_EMPLOYEE'){
        return <PromotionFighterDetails/>
    } else if(role === 'MANAGER') {
        return <ManagerFighterDetails />
    }
}
