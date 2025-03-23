import { configureStore } from "@reduxjs/toolkit";
import usersReducer from '../redux/usersSlice.ts'

export const store = configureStore({
    reducer: {
        users: usersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;