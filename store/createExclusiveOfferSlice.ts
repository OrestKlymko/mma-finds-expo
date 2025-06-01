import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BenefitsSelection, NationalityResponse, WeightClassResponse} from "@/service/response";
import {FightLength} from "@/models/model";
import {CreateDocumentOfferRequest} from "@/service/request";


interface SportType {
    id: string;
    name: string;
}

export type OfferData = {
    weightClass?: WeightClassResponse;
    opponentTapology?: string;
    purseValues?: {
        win: string;
        fight: string;
        bonus: string;
    };
    addMoreInfo?: string;
    mmaRule?: 'Amateur' | 'Professional';
    isTitleFight?: boolean;
    event?: Event;
    benefits?: BenefitsSelection;
    fightLength?: FightLength;
    currency?: string;
    sportType?: SportType;
    opponentName: string;
    choosenDocument: string[];
    newDocument: CreateDocumentOfferRequest[];
    addNewDocumentToProfile: boolean;
    dueDateDocument: string | null;
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
    fightersChosen?: FighterChosen[];
};

export type FighterChosen = {
    fighterId?: string;
    managerId?: string;
}

type Event = {
    arenaName?: string;
    eventDate?: string;
    eventImageLink?: string;
    eventLocation?: string;
    eventName?: string;
    eventTime?: string;
    id?: string;
};

const initialState: OfferData = {
    mmaRule: 'Professional',
    isTitleFight: false,
    currency: 'EUR',
    purseValues: {
        win: '',
        fight: '',
        bonus: '',
    },
    fightLength: {
        minutes: 5,
        rounds: 3,
    },
    opponentName: '',
    opponentGender: '',
    event: {
        arenaName: '',
        eventDate: '',
        eventImageLink: '',
        eventLocation: '',
        eventName: '',
        eventTime: '',
    },
    sportType: {
        id: '',
        name: '',
    },
    choosenDocument: [],
    newDocument: [],
    addNewDocumentToProfile: false,
    dueDateDocument: null,
    fightersChosen: [],

};

const createExclusiveOfferSlice = createSlice({
    name: 'createExclusivePublicOffer',
    initialState,
    reducers: {
        setEvent: (state, action: PayloadAction<Event>) => {
            state.event = action.payload;
        },
        setSportType: (state, action: PayloadAction<SportType>) => {
            state.sportType = action.payload;
        },
        setMmaRule: (state, action: PayloadAction<'Amateur' | 'Professional'>) => {
            state.mmaRule = action.payload;
        },
        setIsTitleFight: (state, action: PayloadAction<boolean>) => {
            state.isTitleFight = action.payload;
        },
        setCurrency: (state, action: PayloadAction<string>) => {
            state.currency = action.payload;
        },
        setBenefits: (state, action: PayloadAction<BenefitsSelection>) => {
            state.benefits = action.payload;
        },
        setWeightClass: (state, action: PayloadAction<WeightClassResponse>) => {
            state.weightClass = action.payload;
        },
        setOpponentTapology: (state, action: PayloadAction<string>) => {
            state.opponentTapology = action.payload;
        },
        setAddMoreInfo: (state, action: PayloadAction<string>) => {
            state.addMoreInfo = action.payload;
        },
        setPurseValues: (
            state,
            action: PayloadAction<{
                win: string;
                fight: string;
                bonus: string;
            }>,
        ) => {
            state.purseValues = action.payload;
        },


        setFightLength: (state, action: PayloadAction<FightLength>) => {
            state.fightLength = action.payload;
        },
        setOpponentName: (state, action: PayloadAction<string>) => {
            state.opponentName = action.payload;
        },
        setChoosenDocument: (
            state,
            action: PayloadAction<string[]>,
        ) => {
            state.choosenDocument = action.payload;
        },
        setNewDocument: (
            state,
            action: PayloadAction<CreateDocumentOfferRequest[]>,
        ) => {
            state.newDocument = action.payload;
        },
        setAddNewDocumentToProfile: (state, action: PayloadAction<boolean>) => {
            state.addNewDocumentToProfile = action.payload;
        },
        setDueDateDocument: (state, action: PayloadAction<string | null>) => {
            state.dueDateDocument = action.payload;
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
        setFightersChosen: (state, action: PayloadAction<FighterChosen[]>) => {
            state.fightersChosen = action.payload;
        },
        resetExclusiveOffer: () => {
            return initialState;
        },
    },
});

export const {
    setEvent,
    setSportType,
    setMmaRule,
    setIsTitleFight,
    setCurrency,
    setBenefits,
    setWeightClass,
    setOpponentTapology,
    setAddMoreInfo,
    setPurseValues,
    setOpponentName,
    setFightLength,
    setChoosenDocument,
    setNewDocument,
    setAddNewDocumentToProfile,
    setDueDateDocument,
    setProWin,
    setProLoss,
    setProDraw,
    setAmWin,
    setAmLoss,
    setAmDraw,
    setOpponentGender,
    setOpponentAge,
    setFightersChosen,
    setOpponentNationality,
    resetExclusiveOffer,
} = createExclusiveOfferSlice.actions;

export default createExclusiveOfferSlice.reducer;
