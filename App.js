import { Platform, StyleSheet, PermissionsAndroid, I18nManager,Text, TextInput  , View, Alert, Button } from 'react-native'
import React, { useEffect } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import AppNavigation from './src/Navigation/AppNavigation'
import Orientation from 'react-native-orientation-locker';
import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'
//import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from "redux-persist/es/integration/react";

import messaging, { firebase } from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AndroidStyle,
  AndroidColor,
} from '@notifee/react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ToastProvider } from 'react-native-toast-notifications'
import { color } from './src/constants/color'
import { fonts } from './src/constants/fonts'
import FlashMessage from 'react-native-flash-message'
import FastImage from 'react-native-fast-image'
import ApplePayment from './src/components/ApplePayment';


const App = () => {

  
  // For Keeping the Text Size Not depending on the phone text
if (Text.defaultProps == null) Text.defaultProps = {};
if (TextInput.defaultProps == null) TextInput.defaultProps = {};

Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps.allowFontScaling = false;




    useEffect(() => {
    FastImage.clearMemoryCache();
    FastImage.clearDiskCache();
  }, []);


useEffect(() => {
  Orientation.lockToPortrait(); // Locks the app to portrait mode
}, []);
  useEffect(() => {
    showMeToken()
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      try {
        console.log('============Remote notification', remoteMessage);
      } catch (err) { console.log(err) }
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        console.log('============foreground notification', remoteMessage.notification);
        onDisplayNotification(remoteMessage.notification.title, remoteMessage.notification.body);
      } catch (err) { console.log(err) }
    });

    return unsubscribe;
  }, [])

  const showMeToken = async () => {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("=====tokeb", fcmToken);
    }
  }




  async function onDisplayNotification(title, body) {
    // Android 13+ requires explicit permission
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Notification permission not granted');
        return;
      }
    }

    // iOS permission
    await notifee.requestPermission();

    // Delete the old channel (optional for dev testing)
    await notifee.deleteChannel('default');

    // Create a fresh channel with HIGH importance
    const channelId = await notifee.createChannel({
      id: 'kuwaitiClient',
      name: 'Alkuwaity Alawal',

      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      vibration: true,
      sound: 'default',
      lights: true,
    });

    // Show the notification
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        smallIcon: 'ic_notification', // Must exist in res/drawable
        color: AndroidColor.RED,
        pressAction: {
          id: 'kuwaitiClient',
        },
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        // showChronometer: true,
        vibrationPattern: [300, 500],
        sound: 'default',
      },
    });
  }



  const linking = {
    prefixes: Platform.select({
      ios: ['https://app.alkwaityalawal.com'],
      android: ['https://app.alkwaityalawal.com/productDetails'],
    }),
    config: {
      screens: {
        // Drawer Navigation
        DrawerNavigation: {
          screens: {
            // Stack Navigations Screen
            StackNavigations: {
              screens: {
                // ProductDetails Screen inside StackNavigations
                ProductDetails: 'productDetails/:id',  // Route with dynamic id
              },
            },
          },
        },
      },
    },
  };



  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>

          <GestureHandlerRootView>
            <NavigationContainer linking={linking} >
              <AppNavigation />
            </NavigationContainer>
          </GestureHandlerRootView>
        </ToastProvider>

      </PersistGate>
      <FlashMessage position='top' floating={true}
        textProps={{
          style: {
            color: color.white,
            fontFamily: fonts.regular,

          },
        }}
      />
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})