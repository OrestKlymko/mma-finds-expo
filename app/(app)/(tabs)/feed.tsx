import {useAuth} from "@/context/AuthContext";
import PromotionMyOfferList from "@/components/offers/PromotionMyOfferList";
import MyOffersScreen from "@/app/(app)/manager/submissions/manage-my-submission";
import MyFighters from "@/app/(app)/profile/my-fighters";

export default function Feed() {
    const {role} = useAuth();

    if (role === 'MANAGER') {
        return <MyFighters />
    } else
        return <PromotionMyOfferList/>
}
