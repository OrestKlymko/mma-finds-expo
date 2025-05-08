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
import {useEffect} from "react";
import {GoogleSignin} from "@react-native-google-signin/google-signin";


export default function RootLayout() {

    useEffect(() => {
        GoogleSignin.configure({
            iosClientId: '712660973446-q1o7h9v7nk36d2bdict84nfn8o6ackcg.apps.googleusercontent.com',
            webClientId: '712660973446-9t222hmquqadadee9a3d31dqrhka89s5.apps.googleusercontent.com',
        })
    });
    return (
        <ReduxProvider store={store}>
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
        </ReduxProvider>
    );
}
