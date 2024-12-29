import { createSlice } from "@reduxjs/toolkit";
export const fetchAgainSlice = createSlice({
    name: "fetchAgain",
    initialState: {
        fetchAgain: false,
    },
    reducers: {
        setFetchAgain: (state, action) => {
        state.fetchAgain = action.payload;
        },
    },
    });
export const { setFetchAgain } = fetchAgainSlice.actions;