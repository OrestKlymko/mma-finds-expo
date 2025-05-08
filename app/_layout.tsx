import {Slot} from 'expo-router';
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


export default function RootLayout() {
    return (
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
    );
}
