import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import {chatSlice } from "./chatSlice";
import { selectedchatSlice } from "./selectedchatSlice";
import { fetchAgainSlice } from "./fetchAgainSlice";

export default configureStore({
    reducer:
    {
        auth:authSlice.reducer,
        chat:chatSlice.reducer,
        selectedchat:selectedchatSlice.reducer,
        fetchAgain:fetchAgainSlice.reducer

    }
   
})