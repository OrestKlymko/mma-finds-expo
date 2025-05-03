import React, {createContext, useContext, useState} from 'react';
import {Filter} from "@/context/model/model";

type FilterContextType = {
  selectedFilters: Filter;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Filter>>;
};

const FilterContext = createContext<FilterContextType | null>(null);

export const FilterProvider = ({children}: {children: React.ReactNode}) => {
  const [selectedFilters, setSelectedFilters] = useState<Filter>({
    eventPlace: [],
    promotion: [],
    rules: [],
    weightClass: [],
    eventName: [],
    activeTab: 'Public',
    fighterName: [],
    offerType: [],
  });

  return (
    <FilterContext.Provider value={{selectedFilters, setSelectedFilters}}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
