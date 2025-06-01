import React, {createContext, useContext, useState} from 'react';
import {ExclusiveOfferFilter} from "@/context/model/model";

type FilterContextType = {
  selectedExOfferFilters: ExclusiveOfferFilter;
  setSelectedExOfferFilters: React.Dispatch<
      React.SetStateAction<ExclusiveOfferFilter>
  >;
};

const FilterExclusiveOfferContext = createContext<FilterContextType | null>(null);

export const ExclusiveOfferFilterProvider = ({
                                               children,
                                             }: {
  children: React.ReactNode;
}) => {
  const [selectedExOfferFilters, setSelectedExOfferFilters] =
      useState<ExclusiveOfferFilter>({
        activeTab: 'Private',
        eventName: [],
        fighterName: [],
        offerType: [],
      });

  return (
      <FilterExclusiveOfferContext.Provider
          value={{selectedExOfferFilters, setSelectedExOfferFilters}}>
        {children}
      </FilterExclusiveOfferContext.Provider>
  );
};

export const useExclusiveOfferFilter = (): FilterContextType => {
  const context = useContext(FilterExclusiveOfferContext);
  if (!context) {
    throw new Error(
        'useExclusiveOfferFilter must be used within an ExclusiveOfferFilterProvider',
    );
  }
  return context;
};
