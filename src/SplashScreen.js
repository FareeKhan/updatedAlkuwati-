import { Dimensions, I18nManager, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { color } from './constants/color'
import ExportSvg from './constants/ExportSvg'
import { useSelector } from 'react-redux'
import { TabRouter } from '@react-navigation/native'
import { loginData, isLogin } from './redux/reducer/Auth'
const { width, height } = Dimensions.get('screen')
import Video, { VideoRef } from 'react-native-video';
//dispatch(loginData({userId: 1}))

const SplashScreen = ({ navigation }) => {
  //const dispatch = useDispatch()
  const isLanguage = useSelector(state => state.auth?.isLanguage);
  useEffect(() => {
    if (isLanguage === 'ar') {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
    } else {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
    }
    ;

  }, [isLanguage])
  const videoRef = useRef();
  return (
    <View style={styles.mainContainer}>
      {/* <ExportSvg.SplashLogo /> */}
      <Video
        // Can be a URL or a local file.
        source={require('./assets/splash.mp4')}
        // Store reference  
        ref={videoRef}
        // Callback when remote video is buffering                                      
        // onBuffer={onBuffer}
        // Callback when video cannot be loaded              
        // onError={onError}
        style={styles.backgroundVideo}
      />
      {/* <Image source={require('./assets/Splash.png')} style={{width:width,height:height}}  /> */}
    </View>
  )
}
export default SplashScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: color.theme,
    alignItems: "center",
    justifyContent: "center"
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})