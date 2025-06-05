import React, {createContext, useContext, useState} from 'react';
import {SubmittedFighterStore} from "@/context/model/model";

type FilterContextType = {
    store: SubmittedFighterStore;
    setStore: React.Dispatch<
        React.SetStateAction<SubmittedFighterStore>
    >;
    clearStore: () => void;
};

const SubmittedFighterContext = createContext<FilterContextType | null>(
    null,
);

export const SubmittedFighterProvider = ({
                                                   children,
                                               }: {
    children: React.ReactNode;
}) => {
    const [store, setStore] =
        useState<SubmittedFighterStore>({
            offerId: null,
            excludeFighterId: undefined,
            eligibleToSelect: undefined,
            offerType: null,
        });
    const clearStore = () => {
        setStore({
            offerId: null,
            excludeFighterId: undefined,
            eligibleToSelect: undefined,
            offerType: null,
        });
    }
    return (
        <SubmittedFighterContext.Provider
            value={{store, setStore,clearStore}}>
            {children}
        </SubmittedFighterContext.Provider>
    );
};

export const useSubmittedFighter = (): FilterContextType => {
    const context = useContext(SubmittedFighterContext);
    if (!context) {
        throw new Error(
            'useSubmittedFighter must be used within a SubmittedFilterFighterProvider',
        );
    }
    return context;
};
