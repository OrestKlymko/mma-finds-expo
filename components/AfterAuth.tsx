import React, {useState, useEffect} from 'react';
import {useRouter} from 'expo-router';
import {useAuth} from '@/context/AuthContext';
import ContentLoader from '@/components/ContentLoader';
import appsFlyer, {InitSDKOptions} from 'react-native-appsflyer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AfterAuth() {
    const {setRole, role} = useAuth();
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const afOptions: InitSDKOptions = {
            devKey: '9HiahBKEZuYX7PhdpkzUge',
            appId: '6740005810',
            isDebug: true,
        };
        appsFlyer.initSdk(
            afOptions,
            () => {
            },
            () => {
            },
        );
        appsFlyer.setOneLinkCustomDomains(['links.mmafinds.com'], () => {
        }, () => {
        });
        appsFlyer.setAppInviteOneLinkID('sfst', () => {
        });

        appsFlyer.onInstallConversionData(({data}) => {
            const id = data?.userId;
            AsyncStorage.setItem('referralUserId', id!);
        });
        appsFlyer.onDeepLink((res) => {
            if (res.deepLinkStatus === 'FOUND') {
                const {userId} = res.data;
                AsyncStorage.setItem('referralUserId', userId!);
            }
        });

        // Сам deep-link
        const subOpen = appsFlyer.onAppOpenAttribution(async (res) => {
            if(res.data?.offerId){
                const offerId: string = res.data.offerId;
                const type: string = res.data.type;
                await AsyncStorage.setItem('offerIdToSubmit', offerId);
                await AsyncStorage.setItem('typeOffer', type);
            }
            if (res?.data?.af_dp) {
                const dp: string = res.data.af_dp;
                const idx = dp.indexOf('/offer');
                if (idx !== -1) {
                    const path = dp.substring(idx);
                    if (!role) {
                        const storedRole = await AsyncStorage.getItem('authRole');
                        if (!storedRole) {
                            setRole('ANONYMOUS');
                            await AsyncStorage.setItem('authRole', 'ANONYMOUS');
                        }
                    }

                    router.push(path);
                }
            }
        });

        setReady(true);
        return () => {
            subOpen();
        };
    }, []);

    if (!ready) return <ContentLoader/>;
}
