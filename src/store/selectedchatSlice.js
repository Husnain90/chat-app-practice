import { createSlice } from "@reduxjs/toolkit";

export const selectedchatSlice = createSlice({
    name: "selectedchat",
    initialState: {
        selectedChat: null,
    },
    reducers: {
        setselectedChat: (state, action) => {
        state.selectedChat = action.payload;
        },
    },
    });
export const { setselectedChat } = selectedchatSlice.actions;