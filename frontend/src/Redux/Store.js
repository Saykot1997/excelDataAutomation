
import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './User_slice';

export const store = configureStore({
    reducer: {
        User: UserReducer,
    },
})