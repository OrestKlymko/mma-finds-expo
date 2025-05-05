import {Slot} from 'expo-router';
import {AuthProvider} from '@/context/AuthContext';
import 'react-native-get-random-values';   // ← MUST come before any uuid import
import {store} from '@/store/store';
import {Provider as ReduxProvider} from 'react-redux';
import {FilterProvider} from "@/context/FilterContext";
import {ExclusiveOfferFilterProvider} from "@/context/ExclusiveOfferFilterContext";
import {SubmittedFilterFighterProvider} from "@/context/SubmittedFilterFighterContext";
import {FilterFighterProvider} from "@/context/FilterFighterContext";


export default function RootLayout() {
    return (
        <ReduxProvider store={store}>
            <AuthProvider>
                <FilterProvider>
                    <ExclusiveOfferFilterProvider>
                        <SubmittedFilterFighterProvider>
                            <FilterFighterProvider>
                                <Slot/>
                            </FilterFighterProvider>
                        </SubmittedFilterFighterProvider>
                    </ExclusiveOfferFilterProvider>
                </FilterProvider>
            </AuthProvider>
        </ReduxProvider>
    );
}
