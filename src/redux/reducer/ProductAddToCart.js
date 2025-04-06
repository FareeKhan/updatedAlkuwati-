

import { createSlice } from "@reduxjs/toolkit";

export const productAddToCart = createSlice({
    name: 'productInCart',
    initialState: {
        cartProducts: [],
        totalPrice: '',
        isPromo: false
    },
    reducers: {
        addProductToCart: (state, action) => {

            const { productName, price, size, counter, id, image, subText } = action.payload;
            const newProductAddedToCart = { productName, price, size, counter, id, image, subText }

            const existId = state.cartProducts?.find((item) => item?.id == id)
            if (!existId) {
                state.cartProducts.push(newProductAddedToCart)
            } else {
                existId.counter = counter
                existId.size = size
                existId.image = image
                // existId.price = price * counter

            }
        },
        incrementCounter: (state, action) => {
            const product = state.cartProducts.find((item) => item.id === action.payload);
            if (product) {
                product.counter += 1;
            }
            const finalPrice = state.cartProducts.reduce((total, item) => {
                return total + item.counter * parseFloat(item.price);
            }, 0)
                .toFixed(2);
            state.totalPrice = finalPrice
        },
        decrementCounter: (state, action) => {
            const product = state.cartProducts.find((item) => item.id === action.payload);
            if (product && product.counter > 1) {
                product.counter -= 1;
            }

            const finalPrice = state.cartProducts.reduce((total, item) => {
                return total + item.counter * parseFloat(item.price);
            }, 0)
                .toFixed(2);
            state.totalPrice = finalPrice

        },
        handlePromo: (state, action) => {
            state.isPromo = true
        },
        deleteProduct: (state, action) => {
            state.cartProducts = state.cartProducts.filter((item, index) => item?.id != action.payload)
            const finalPrice = state.cartProducts.reduce((total, item) => {
                return total + item.counter * parseFloat(item.price);
            }, 0)
                .toFixed(2);
            state.totalPrice = finalPrice
        },
        handleTotalPrice: (state, action) => {
            state.totalPrice = action.payload
            console.log('aminaaBegin', state.totalPrice)
        },
        clearCart: (state) => {
            state.cartProducts = [];
            state.totalPrice = '';
            state.isPromo = false
        }

    }
});

export const { addProductToCart, incrementCounter, decrementCounter, deleteProduct, handleTotalPrice, clearCart,handlePromo } = productAddToCart.actions;

export default productAddToCart.reducer;
