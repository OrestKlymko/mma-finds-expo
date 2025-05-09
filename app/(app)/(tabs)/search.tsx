import {useAuth} from "@/context/AuthContext";
import PromotionAllFighterMainList from "@/components/fighter/PromotionAllFighterList";
import FighterOfferFeedScreen from "@/components/offers/FighterOfferFeedScreen";

export default function Search() {
    const {role} = useAuth();
    if (role === 'PROMOTION'||role==='PROMOTION_EMPLOYEE'){
        return <PromotionAllFighterMainList/>
    } else {
        return <FighterOfferFeedScreen />
    }
}
