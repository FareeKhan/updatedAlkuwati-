import { createSlice } from "@reduxjs/toolkit";

export const AddFavorite = createSlice({
    name: "AddFavorite",
    initialState: {
        AddInFavorite: []
    },
    reducers: {
        productFavorite: (state, action) => {
            const { pid, productName, price, description,image } = action.payload
            const addedToFavorite = { pid, productName, price, description,image }
            state.AddInFavorite.push(addedToFavorite)
        },
        removeFavorite: (state, action) => {
            const { id } = action.payload;
            state.AddInFavorite = state?.AddInFavorite.filter(product => product?.pid !== id);
        },
    }
})


export const { productFavorite,removeFavorite } = AddFavorite.actions

export default AddFavorite.reducer