import {configureStore} from '@reduxjs/toolkit';
import createOfferReducer from '@/store/createPublicOfferSlice';
import createExclusiveOfferReducer from '@/store/createExclusiveOfferSlice';
import createMultiFightOfferReducer from '@/store/createMultiContractOfferSlice';

export const store = configureStore({
    reducer: {
        createPublicOffer: createOfferReducer,
        createExclusiveOffer: createExclusiveOfferReducer,
        createMultiContractOffer: createMultiFightOfferReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
