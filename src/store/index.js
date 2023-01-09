import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./slices/modalSlice";
import tweetPostSlice from "./slices/tweetPostSlice";

export const store = configureStore({
    reducer: {
        modal: modalSlice,
        tweet: tweetPostSlice
    }
})
