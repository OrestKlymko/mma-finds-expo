import {useAuth} from "@/context/AuthContext";
import PromotionMyOfferList from "@/components/offers/PromotionMyOfferList";
import MyOffersScreen from "@/app/(app)/manager/submissions/manage-my-submission";

export default function Feed() {
    const {role} = useAuth();

    if (role === 'MANAGER') {
        return <MyOffersScreen />
    } else
        return <PromotionMyOfferList/>
}
