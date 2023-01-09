import { createSlice } from "@reduxjs/toolkit";

export const tweetPostSlice = createSlice({
    name: 'tweetPost',
    initialState: {
        tweet: null,
        comments: null,
        retweets: null
    },
    reducers: {
        addTweetPostData: (state, action) => {
            console.log(action.payload)
        }
    }
})

export const { addTweetPostData } = tweetPostSlice.actions
export default tweetPostSlice.reducer
