 import { I18nManager, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { color } from './constants/color'
import ExportSvg from './constants/ExportSvg'
import { useSelector } from 'react-redux'
import { TabRouter } from '@react-navigation/native'
import { loginData, isLogin } from './redux/reducer/Auth'

//dispatch(loginData({userId: 1}))

const SplashScreen = ({ navigation }) => {
    //const dispatch = useDispatch()
  const isLanguage = useSelector(state => state.auth?.isLanguage);
    useEffect(()=>{
      if (isLanguage === 'ar') {
        I18nManager.forceRTL(true);
        I18nManager.allowRTL(true);
      } else {
        I18nManager.forceRTL(false);
        I18nManager.allowRTL(false);
      }
;
    
    },[isLanguage])

    return (
        <View style={styles.mainContainer}>
            <ExportSvg.SplashLogo />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: color.theme,
        alignItems: "center",
        justifyContent: "center"
    }
})