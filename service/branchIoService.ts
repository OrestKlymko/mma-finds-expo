import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import branch, { BranchParams } from 'react-native-branch';
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useBranchDeepLinking() {
    const router = useRouter();

    useEffect(() => {
        let didNavigate = false;

        // 1) Cold-start: check if we have params from when app launched
        branch
            .getLatestReferringParams()
            .then((params) => {
                if (params['+clicked_branch_link']) {
                    didNavigate = true;
                    handleRouting(params);
                }
            })
            .catch(console.error);

        // 2) Hot-start: listen for links while app is open
        const unsubscribe = branch.subscribe(({ error, params }) => {
            if (error) {
                console.error('🔗 Branch error', error);
                return;
            }
            console.log('🔗 Branch params', params);
            if (params['+clicked_branch_link']) {
                // protect against double-navigate on cold start
                if (!didNavigate) {
                    handleRouting(params);
                }
            }
        });

        return () => unsubscribe();
    }, [router]);

    function handleRouting(
        params: BranchParams & {
            offerId?: string;
            typeOffer?: 'public' | 'exclusive' | 'multi';
            path?: string;
        }
    ) {
        const { offerId, typeOffer, path } = params;
        console.log('🔗 Branch params', params);
        if (typeOffer === 'public' && offerId) {
            router.push(`/offer/public/${offerId}`);
        } else if (typeOffer === 'exclusive' && offerId) {
            router.push(`offer/exclusive/single/${offerId}`);
        } else if (typeOffer === 'multi' && offerId) {
            router.push(`/exclusive/multi/${offerId}`);
        } else if (path) {
            router.push(`/${path}`);
        } else {
            console.warn('No routing info in Branch params:', params);
        }
    }
}

export function useReferralParams() {
    useEffect(() => {
        branch.getFirstReferringParams()
            .then(params => {
                if (params.userId) {
                    AsyncStorage.setItem('referralUserId', String(params.userId));
                }
            })
            .catch(console.error);
    }, []);
}
