import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FightLength} from "@/models/model";
import {BenefitsSelection, EventDetailsResponse, NationalityResponse, WeightClassResponse} from "@/service/response";


interface PurseValues {
  from: string;
  to: string;
}

interface SportType {
  id: string;
  name: string;
}

export type OfferData = {
  offerId?: string;
  event?: EventDetailsResponse;
  sportType?: SportType;
  fightLength?: FightLength;
  mmaRule?: 'Amateur' | 'Professional';
  isTitleFight?: boolean;
  purseType?: string;
  purseValues?: PurseValues;
  currency?: string;
  benefits?: BenefitsSelection;
  gender?: string;
  weightClass?: WeightClassResponse;
  minFights?: string;
  maxFights?: string;
  minWin?: string;
  minLoss?: string;
  opponentTapology?: string;
  addMoreInfo?: string;
  opponentName?: string;
  proWin?: string;
  proLoss?: string;
  proDraw?: string;
  amateurWin?: string;
  amateurLoss?: string;
  amateurDraw?: string;
  opponentGender: string;
  opponentAge?: string;
  opponentNationality?: NationalityResponse;
  opponentCountry?: string;
  opponentContinent?: string;
  showToAllManagers: boolean;
};

const initialState: OfferData = {
  mmaRule: 'Amateur',
  isTitleFight: false,
  purseType: 'Between',
  purseValues: {from: '', to: ''},
  currency: 'EUR',
  opponentName: '',
  opponentTapology: '',
  minFights: '',
  maxFights: '',
  minWin: '',
  minLoss: '',
  addMoreInfo: '',
  event: undefined,
  sportType: undefined,
  showToAllManagers: false,
  fightLength: {minutes: 5, rounds: 3},
  opponentGender: ''
};

const createPublicOfferSlice = createSlice({
  name: 'createPublicOffer',
  initialState,
  reducers: {
    setEvent: (state, action: PayloadAction<EventDetailsResponse>) => {
      state.event = action.payload;
    },
    setSportType: (state, action: PayloadAction<SportType>) => {
      state.sportType = action.payload;
    },
    setFightLength: (state, action: PayloadAction<FightLength>) => {
      state.fightLength = action.payload;
    },
    setMmaRule: (state, action: PayloadAction<'Amateur' | 'Professional'>) => {
      state.mmaRule = action.payload;
    },
    setIsTitleFight: (state, action: PayloadAction<boolean>) => {
      state.isTitleFight = action.payload;
    },
    setPurseType: (state, action: PayloadAction<string>) => {
      state.purseType = action.payload;
    },
    setPurseValues: (
      state,
      action: PayloadAction<{from: string; to: string}>,
    ) => {
      state.purseValues = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setBenefits: (state, action: PayloadAction<BenefitsSelection>) => {
      state.benefits = action.payload;
    },
    setGender: (state, action: PayloadAction<string>) => {
      state.gender = action.payload;
    },
    setWeightClass: (state, action: PayloadAction<WeightClassResponse>) => {
      state.weightClass = action.payload;
    },
    setMinFights: (state, action: PayloadAction<string>) => {
      state.minFights = action.payload;
    },
    setMaxFights: (state, action: PayloadAction<string>) => {
      state.maxFights = action.payload;
    },
    setMinWin: (state, action: PayloadAction<string>) => {
      state.minWin = action.payload;
    },
    setMinLoss: (state, action: PayloadAction<string>) => {
      state.minLoss = action.payload;
    },
    setOpponentTapology: (state, action: PayloadAction<string>) => {
      state.opponentTapology = action.payload;
    },
    setAddMoreInfo: (state, action: PayloadAction<string>) => {
      state.addMoreInfo = action.payload;
    },
    setOfferId: (state, action: PayloadAction<string>) => {
      state.offerId = action.payload;
    },
    setOpponentName: (state, action: PayloadAction<string>) => {
      state.opponentName = action.payload;
    },
    setProWin: (state, action: PayloadAction<string>) => {
      state.proWin = action.payload;
    },
    setProLoss: (state, action: PayloadAction<string>) => {
      state.proLoss = action.payload;
    },
    setProDraw: (state, action: PayloadAction<string>) => {
      state.proDraw = action.payload;
    },
    setAmWin: (state, action: PayloadAction<string>) => {
      state.amateurWin = action.payload;
    },
    setAmLoss: (state, action: PayloadAction<string>) => {
      state.amateurLoss = action.payload;
    },
    setAmDraw: (state, action: PayloadAction<string>) => {
      state.amateurDraw = action.payload;
    },
    setOpponentGender: (state, action: PayloadAction<string>) => {
      state.opponentGender = action.payload;
    },
    setOpponentAge: (state, action: PayloadAction<string>) => {
      state.opponentAge = action.payload;
    },
    setOpponentNationality: (
      state,
      action: PayloadAction<NationalityResponse>,
    ) => {
      state.opponentNationality = action.payload;
    },
    setOpponentCountry: (state, action: PayloadAction<string>) => {
      state.opponentCountry = action.payload;
    },
    setOpponentContinent: (state, action: PayloadAction<string>) => {
      state.opponentContinent = action.payload;
    },
    setShowToAllManagers: (state, action: PayloadAction<boolean>) => {
      state.showToAllManagers = action.payload;
    },
    resetPublicOffer: () => {
      return initialState;
    },
  },
});

export const {
  setEvent,
  setSportType,
  setFightLength,
  setMmaRule,
  setIsTitleFight,
  setPurseType,
  setPurseValues,
  setCurrency,
  setBenefits,
  setGender,
  setWeightClass,
  setMinFights,
  setMaxFights,
  setMinWin,
  setMinLoss,
  setOpponentTapology,
  setAddMoreInfo,
  setOfferId,
  setOpponentName,
  setProWin,
  setProLoss,
  setProDraw,
  setAmWin,
  setAmLoss,
  setAmDraw,
  setOpponentGender,
  setOpponentAge,
  setOpponentNationality,
  setShowToAllManagers,
  resetPublicOffer,
} = createPublicOfferSlice.actions;

export default createPublicOfferSlice.reducer;
