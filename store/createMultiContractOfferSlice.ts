import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CreateDocumentOfferRequest} from "@/service/request";
import {WeightClassResponse} from "@/service/response";

interface SportType {
  id: string;
  name: string;
}

interface PurseValues {
  fight: string;
  win: string;
  bonus: string;
}

export type PurseValuesMulti = {index: number; values: PurseValues};

export type OfferData = {
  fighterId?: string;
  fighterName?: string;
  weightClass?: WeightClassResponse[];
  sportType: SportType[];
  purseValues: PurseValuesMulti[];
  months?: string;
  numberOfFights?: string;
  currency?: string;
  addMoreInfo?: string;
  exclusivity?: string;
  isExclusive?: boolean;
  choosenDocument: string[];
  newDocument: CreateDocumentOfferRequest[];
  addNewDocumentToProfile: boolean;
  dueDateDocument: string | null;
};

const initialState: OfferData = {
  currency: 'EUR',
  sportType: [],
  purseValues: [] as PurseValuesMulti[],
  numberOfFights: '',
  addMoreInfo: '',
  fighterId: '',
  fighterName: '',
  weightClass: [],
  months: '',
  exclusivity: '',
  isExclusive: false,
  choosenDocument: [],
  newDocument: [],
  addNewDocumentToProfile: false,
  dueDateDocument: null,
};

const createMultiContractOfferSlice = createSlice({
  name: 'createMultiContractOffer',
  initialState,
  reducers: {
    setFighterId: (state, action: PayloadAction<string>) => {
      state.fighterId = action.payload;
    },
    setFighterName: (state, action: PayloadAction<string>) => {
      state.fighterName = action.payload;
    },
    setWeightClass: (state, action: PayloadAction<WeightClassResponse[]>) => {
      state.weightClass = action.payload;
    },
    setSportType: (state, action: PayloadAction<SportType[]>) => {
      state.sportType = action.payload;
    },
    setPurseValues(state, action: PayloadAction<PurseValuesMulti>) {
      const {index} = action.payload;
      if (state.purseValues.length <= index) {
        state.purseValues.length = index + 1;
      }
      state.purseValues[index] = action.payload;
    },
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
    setNumberOfFights: (state, action: PayloadAction<string>) => {
      state.numberOfFights = action.payload;
    },
    setAddMoreInfo: (state, action: PayloadAction<string>) => {
      state.addMoreInfo = action.payload;
    },
    setExclusivity: (state, action: PayloadAction<string>) => {
      state.exclusivity = action.payload;
    },
    setExclusivityEnabled: (state, action: PayloadAction<boolean>) => {
      state.isExclusive = action.payload;
    },
    setMonths: (state, action: PayloadAction<string>) => {
      state.months = action.payload;
    },
    setChoosenDocument: (state, action: PayloadAction<string[]>) => {
      state.choosenDocument = action.payload;
    },
    setNewDocument: (state, action: PayloadAction<CreateDocumentOfferRequest[]>) => {
      state.newDocument = action.payload;
    },
    setAddNewDocumentToProfile: (state, action: PayloadAction<boolean>) => {
      state.addNewDocumentToProfile = action.payload;
    },
    setDueDateDocument: (state, action: PayloadAction<string | null>) => {
      state.dueDateDocument = action.payload;
    },

    resetOffer: () => {
      return initialState;
    },
  },
});

export const {
  setFighterId,
  setFighterName,
  setWeightClass,
  setSportType,
  setPurseValues,
  setNumberOfFights,
  setCurrency,
  setAddMoreInfo,
  setExclusivity,
  setExclusivityEnabled,
  setMonths,
  setChoosenDocument,
  setNewDocument,
  setAddNewDocumentToProfile,
  setDueDateDocument,
  resetOffer,
} = createMultiContractOfferSlice.actions;

export default createMultiContractOfferSlice.reducer;
