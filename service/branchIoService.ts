import branch from 'react-native-branch';
import {useEffect} from "react";

let branchReady: Promise<void> | null = null;
export function ensureBranchReady(): Promise<void> {
    if (!branchReady) {
        branchReady = new Promise(res => {
            const unsub = branch.subscribe(() => {
                unsub();          // ← ініціалізувалось – відписались
                res();
            });
        });
    }
    return branchReady;
}

export function useBranchDeepLinking() {
    useEffect(() => {
        const unsubscribe = branch.subscribe(({error, params}) => {
            if (error) {
                console.error('Branch error:', error);
                return;
            }
            console.log(params);

            // if (params && params['+clicked_branch_link'] && params.offerId) {
            //     const offerId = typeof params.offerId === 'string'
            //         ? params.offerId
            //         : String(params.offerId);
            //     navigate('PromotionOfferDetailsScreen', {offerId});
            // }
        });
        return () => unsubscribe();
    }, []);
}
