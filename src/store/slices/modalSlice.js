import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
    name: 'modalSlice',
    initialState: {
        isModalOpen: false,
        selectedTweet: null,
    },
    reducers: {
        openModal: (state, action) => {
            state.isModalOpen = !state.isModalOpen
            state.selectedTweet = action.payload
        }
    }
})
export const { openModal } = modalSlice.actions
export default modalSlice.reducer
