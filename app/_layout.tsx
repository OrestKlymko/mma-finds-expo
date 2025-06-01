import {Slot, useRouter} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {AuthProvider} from '@/context/AuthContext';
import 'react-native-get-random-values';   // ← MUST come before any uuid import
import {store} from '@/store/store';
import {Provider as ReduxProvider} from 'react-redux';
import {FilterProvider} from "@/context/FilterContext";
import {ExclusiveOfferFilterProvider} from "@/context/ExclusiveOfferFilterContext";
import {SubmittedFilterFighterProvider} from "@/context/SubmittedFilterFighterContext";
import {FilterFighterProvider} from "@/context/FilterFighterContext";
import {NotificationProvider} from "@/context/NotificationContext";
import {CountryModalProvider} from "react-native-country-picker-modal";
import {StripeProvider} from "@stripe/stripe-react-native";
import {usePushNotifications} from "@/hooks/usePushNotifications";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import ContentLoader from "@/components/ContentLoader";
import AfterAuth from "@/components/AfterAuth";


export default function RootLayout() {
    usePushNotifications();
    const [contentLoading, setContentLoading] = useState(false);


    useEffect(() => {
        setContentLoading(true);
        GoogleSignin.configure({
            iosClientId: "712660973446-q1o7h9v7nk36d2bdict84nfn8o6ackcg.apps.googleusercontent.com",
            webClientId: "712660973446-9t222hmquqadadee9a3d31dqrhka89s5.apps.googleusercontent.com",
            profileImageSize: 150
        })

        setContentLoading(false);
        return () => {
            setContentLoading(false);
        };
    }, []);

    if (contentLoading) {
        return <ContentLoader/>;
    }
    return (
        <StripeProvider
            publishableKey="pk_test_51RTR3zRvBlhBqGC0txGeKmwc8U8MwVZZcPzGdm8MNaDLyTO4bLiQFxPzXL282CkGoza3ltPdx4FZ3u2XVsjmgdNh00fdCThgIR"
            merchantIdentifier="merchant.com.mmafinds.payment"
            urlScheme="com.mmafinds.app"
        >
            <ReduxProvider store={store}>
                <CountryModalProvider>
                    <AuthProvider>
                        <AfterAuth/>
                        <NotificationProvider>
                            <FilterProvider>
                                <ExclusiveOfferFilterProvider>
                                    <SubmittedFilterFighterProvider>
                                        <FilterFighterProvider>
                                            <Slot/>
                                        </FilterFighterProvider>
                                    </SubmittedFilterFighterProvider>
                                </ExclusiveOfferFilterProvider>
                            </FilterProvider>
                        </NotificationProvider>
                    </AuthProvider>
                </CountryModalProvider>
            </ReduxProvider>
        </StripeProvider>
    );
}
