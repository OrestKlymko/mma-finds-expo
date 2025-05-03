import React, {createContext, useContext, useState} from 'react';
import {SubmittedFilterFighter} from "@/context/model/model";

type FilterContextType = {
  availableFilters: SubmittedFilterFighter;
  setAvailableFilters: React.Dispatch<
    React.SetStateAction<SubmittedFilterFighter>
  >;
};

const SubmittedFilterFighterContext = createContext<FilterContextType | null>(
  null,
);

export const SubmittedFilterFighterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [availableFilters, setAvailableFilters] =
    useState<SubmittedFilterFighter>({
      locations: [],
      foundationStyle: [],
      offerId: null,
      withTapology: false,
    });
  return (
    <SubmittedFilterFighterContext.Provider
      value={{availableFilters, setAvailableFilters}}>
      {children}
    </SubmittedFilterFighterContext.Provider>
  );
};

export const useSubmittedFilterFighter = (): FilterContextType => {
  const context = useContext(SubmittedFilterFighterContext);
  if (!context) {
    throw new Error(
      'useSubmittedFilterFighter must be used within a SubmittedFilterFighterProvider',
    );
  }
  return context;
};
