// import {  configureStore } from "@reduxjs/toolkit";
// import authUser from "./reducer/Auth";

// import { combineReducers } from 'redux';
// import  productAddToCart  from "./reducer/ProductAddToCart";
// import userAddress  from "./reducer/UserShippingAddress";
// import AddFavorite from "./reducer/AddFavorite";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { persistReducer, persistStore } from "redux-persist";


// const persistConfig = {
//   key: "root",
//   storage: AsyncStorage,
//   whitelist: ["authUser", "userAddress", "AddFavorite", "productAddToCart"], // Adjust the whitelist based on which reducers to persist
//   blacklist: [], // Adjust the blacklist based on which reducers to not persist
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);


// // const rootReducer = combineReducers({
// //   auth:authUser,
// //   cartProducts:productAddToCart,
// //   customerAddress:userAddress,
// //   favorite:AddFavorite

// // })
// const rootReducer = persistedReducer

// const store = configureStore({
//     reducer : rootReducer
// })

// const persistor = persistStore(store);

// export { store, persistor };





// store.js
import { createStore, applyMiddleware } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";
import  productAddToCart  from "./reducer/ProductAddToCart";
import userAddress  from "./reducer/UserShippingAddress";
import AddFavorite from "./reducer/AddFavorite";
import authUser from "./reducer/Auth";
import { combineReducers } from "redux";

// Persist configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "cartProducts", "customerAddress", "favorite"], // Adjust the whitelist based on which reducers to persist
  blacklist: [], // Adjust the blacklist based on which reducers to not persist
};

const rootReducer = combineReducers({
  auth:authUser,
  cartProducts:productAddToCart,
  customerAddress:userAddress,
  favorite:AddFavorite

})


// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with enhancers
const store = createStore(persistedReducer, applyMiddleware(thunk));

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };




