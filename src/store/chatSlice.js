import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
  },
  reducers: {
    setChat: (state, action) => {
      state.chats = action.payload;
    },
   
  },
});

export const { setChat } = chatSlice.actions;
