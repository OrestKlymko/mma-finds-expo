import React, {createContext, useContext, useState} from 'react';
import {FilterFighter} from "@/context/model/model";

type FilterContextType = {
  selectedFilters: FilterFighter;
  setSelectedFilters: React.Dispatch<React.SetStateAction<FilterFighter>>;
};

const FilterFighterContext = createContext<FilterContextType | null>(null);

export const FilterFighterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterFighter>({
    fighterLocation: [],
    foundationStyle: [],
    managerLocation: [],
    matchType: 'All',
    promotion: [],
    withTapology: false,
  });

  return (
    <FilterFighterContext.Provider
      value={{selectedFilters, setSelectedFilters}}>
      {children}
    </FilterFighterContext.Provider>
  );
};

export const useFilterFighter = (): FilterContextType => {
  const context = useContext(FilterFighterContext);
  if (!context) {
    throw new Error(
      'useFilterFighter must be used within a FilterFighterProvider',
    );
  }
  return context;
};
