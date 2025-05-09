import {useAuth} from "@/context/AuthContext";
import {PromotionSingleOffer} from "@/components/offers/exclusive-single/PromotionSingleOffer";

export default function Index() {
    const {role} = useAuth();
    if (role === 'PROMOTION'||role==='PROMOTION_EMPLOYEE'){
        return <PromotionSingleOffer/>
    }
}
