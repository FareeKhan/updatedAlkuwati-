import { I18nManager } from "react-native";

const { createSlice } = require("@reduxjs/toolkit");



const initialState = {
    isLogin: false,
    userId: null,
    phoneNo: null,
    userName: null,
    token: null,
    truckInfo: {},
    // isLanguage: I18nManager.isRTL ? "ar":"en",
    isLanguage: "ar",
    userInfo: null,
    autoLogin: false,
    mobile: '',
    tryAutoLogin: false,
    direction: false
}

export const authUser = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginData: (state, action) => {
            const { userName, mobile, token, userId } = action.payload
            state.token = token;
            state.userName = userName;
            state.mobile = mobile;
            state.userId = userId
            console.log('vvv', userId)
        },
        changeDirection: (state, action) => {
            state.direction = action.payload
        },
        changeLanguage: (state, action) => {
            const { isLanguage } = action.payload
            state.isLanguage = isLanguage
        },
        login: (state, action) => {
            const { isLogin } = action.payload
            state.isLogin = isLogin
        },
        loginDetails: (state, action) => {
            const { token, userID, userName, phoneNo } = action.payload
            state.token = token
            state.phoneNo = phoneNo
            state.userID = userID
            state.userName = userName
            state.userInfo = action.payload
        },
        logout: (state) => {
            state.userName = '',
                state.mobile = '',
                state.token = '',
                state.userId = '';
            state.autoLogin = true
            console.log('sstate', state)

        },
        isLogin: (state) => {
            state.autoLogin = true
        },
        didTryAutoLogin: (state) => {
            state.tryAutoLogin = true
        }

    }
})

export const { loginData, logout, isLogin, login, changeLanguage,changeDirection } = authUser.actions;

export default authUser.reducer