import {useAuth} from "@/context/AuthContext";
import {PromotionMultiFightOffer} from "@/components/offers/public/PromotionMultiFightOffer";

export default function Index() {
    const {role} = useAuth();
    if (role === 'PROMOTION'||role==='PROMOTION_EMPLOYEE'){
        return <PromotionMultiFightOffer/>
    }
}
