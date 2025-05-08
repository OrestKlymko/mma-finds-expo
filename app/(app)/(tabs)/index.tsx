import {useAuth} from "@/context/AuthContext";
import HomePromotion from "@/components/home/HomePromotion";
import HomeManager from "@/components/home/HomeManager";

export default function Index() {
    const {role} = useAuth();
    if (role === 'PROMOTION') {
        return <HomePromotion/>
    } else if (role === 'MANAGER') {
        return <HomeManager />
    }
}
