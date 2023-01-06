import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
    name: 'modalSlice',
    initialState: {
        isModalOpen: false
    }
})

export default modalSlice.reducer
