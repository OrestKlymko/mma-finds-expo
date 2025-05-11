import {Slot} from 'expo-router';
import React from 'react';
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
import {useBranchDeepLinking} from "@/service/branchIoService";


export default function RootLayout() {
    useBranchDeepLinking();

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
