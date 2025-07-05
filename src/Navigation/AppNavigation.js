import { I18nManager, LogBox, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../SplashScreen";
import { DrawerNavigation } from "./DrawerNavigation";

import { useDispatch, useSelector } from "react-redux";
import i18next, { changeLanguage } from "i18next";
import { changeDirection } from "../redux/reducer/Auth";
import RNRestart from 'react-native-restart';
import Video, {VideoRef} from 'react-native-video';


LogBox.ignoreAllLogs();
const Stack = createStackNavigator();
const AppNavigation = ({ navigation }) => {
  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const isLanguage = useSelector((state) => state.auth?.isLanguage);

console.log('=>',isLanguage)
  useEffect(() => {
  
    if (isLanguage == 'ar') {
      I18nManager.forceRTL(true);
      !I18nManager.isRTL && RNRestart.Restart()
      // RNRestart.Restart()
    }
  }, [isLanguage]);


  useEffect(() => {
    i18next.changeLanguage(isLanguage);
  }, []);

  useEffect(() => {
    if (!token) {
    }
    // Increased splash screen duration to allow for image preloading
    const timeOut = setTimeout(() => {
      setIsSplashScreen(false);
    }, 3000); // Increased from 2000ms to 3000ms to give more time for image preloading

    return () => clearTimeout(timeOut);
  }, []);

  if (isSplashScreen) {
    return <SplashScreen />;
  }


  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      </Stack.Navigator>
    </>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
