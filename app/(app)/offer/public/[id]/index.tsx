// if (role === 'PROMOTION') {
//     navigation.navigate('PromotionOfferDetailsScreen', {
//         offerId: item.offerId,
//     });
//     router.push(`/offer/public/${item.offerId}`)
// // } else {
// //     navigation.navigate('ManagerPublicOfferDetailsScreen', {
// //         offerId: item.offerId,
// //     });
// // }
import {useAuth} from "@/context/AuthContext";
import PromotionPublicOffer from "@/components/offers/public/PromotionPublicOffer";
import {ManagerOfferDetailScreen} from "@/components/offers/public/ManagerPublicOffer";

export default function PublicOfferDetails() {
    const {role} = useAuth();
    if (role === 'PROMOTION'||role==='PROMOTION_EMPLOYEE') {
        return <PromotionPublicOffer/>
    } else {
        return <ManagerOfferDetailScreen />
    }
}
