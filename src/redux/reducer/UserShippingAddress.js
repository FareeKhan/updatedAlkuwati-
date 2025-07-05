

import { createSlice } from "@reduxjs/toolkit";

export const userAddress = createSlice({
    name: 'userAddress',
    initialState: {
        storeAddress: {}
    },
    reducers: {
        storeUserAddress :(state,action)=>{
            state.storeAddress= action.payload
        }

    }
});

export const { storeUserAddress} = userAddress.actions;

export default userAddress.reducer;
