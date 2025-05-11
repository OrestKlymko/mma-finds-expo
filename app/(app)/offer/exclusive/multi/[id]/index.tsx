import {useAuth} from "@/context/AuthContext";
import {PromotionMultiFightOffer} from "@/components/offers/public/PromotionMultiFightOffer";
import {ManagerMultiFightOffer} from "@/components/offers/public/ManagerMultiFightOffer";

export default function Index() {
    const {role} = useAuth();
    if (role === 'PROMOTION'||role==='PROMOTION_EMPLOYEE'){
        return <PromotionMultiFightOffer/>
    }else {
        return <ManagerMultiFightOffer/>
    }
}
