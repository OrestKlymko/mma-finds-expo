import {Slot} from 'expo-router';
import React, {useEffect} from 'react';
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
import {ClerkProvider} from "@clerk/clerk-expo";
import {tokenCache} from "@clerk/clerk-expo/token-cache";
import {StripeProvider} from "@stripe/stripe-react-native";
import {useBranchDeepLinking, useReferralParams} from "@/service/branchIoService";
import {usePushNotifications} from "@/hooks/usePushNotifications";
import {GoogleSignin} from "@react-native-google-signin/google-signin";


export default function RootLayout() {
    useBranchDeepLinking();
    useReferralParams();
    usePushNotifications();

    useEffect(() => {
        GoogleSignin.configure({
            iosClientId: "712660973446-q1o7h9v7nk36d2bdict84nfn8o6ackcg.apps.googleusercontent.com",
            webClientId: "712660973446-9t222hmquqadadee9a3d31dqrhka89s5.apps.googleusercontent.com",
            profileImageSize: 150
        })
    },[])
    return (
        <StripeProvider
            publishableKey="pk_test_51PDR6jRxes7eHgo9gthYYUPzuYs4hRSkNh90LUWIFKFDahVlq7xfrPvxE4qPA8NQl46UwYefTor8AzYot2XdJSky00GA1iREea"
            merchantIdentifier="merchant.com.youApp">
            <ReduxProvider store={store}>
                <ClerkProvider tokenCache={tokenCache}>
                    <CountryModalProvider>
                        <AuthProvider>
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
                </ClerkProvider>
            </ReduxProvider>
        </StripeProvider>
    );
}
