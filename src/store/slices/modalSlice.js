import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modalSlice",
  initialState: {
    isModalOpen: false,
    selectedTweet: null,
    deleteModal: false,
    tweetToBeDeleted: null,
  },
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = !state.isModalOpen;
      state.selectedTweet = action.payload;
    },
    openDeleteModal: (state, action) => {
      state.deleteModal = !state.deleteModal;
      state.tweetToBeDeleted = action.payload;
    },
  },
});
export const { openModal, openDeleteModal } = modalSlice.actions;
export default modalSlice.reducer;
