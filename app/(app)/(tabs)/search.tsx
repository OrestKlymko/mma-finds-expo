import {useAuth} from "@/context/AuthContext";
import PromotionAllFighterMainList from "@/components/fighter/PromotionAllFighterList";

export default function Search() {
    const {role} = useAuth();
    if (role === 'PROMOTION') {
        return <PromotionAllFighterMainList/>
    }
}
