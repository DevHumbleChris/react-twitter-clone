import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./slices/modalSlice";

export const store = configureStore({
    reducer: {
        modal: modalSlice
    }
})
