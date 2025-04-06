import { Platform, StyleSheet, PermissionsAndroid, I18nManager, Text, View, Alert, Button } from 'react-native'
import React, { useEffect } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import AppNavigation from './src/Navigation/AppNavigation'

import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'

//import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from "redux-persist/es/integration/react";

import messaging, { firebase } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ToastProvider } from 'react-native-toast-notifications'


const App = () => {
  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (error) {
      }
    }

    //console.log(firebase);
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        //console.log('Authorization status:', authStatus);
      }
    } else {

      const hasPermission = await firebase.messaging().hasPermission();
      const authStatus = await messaging().requestPermission();
      //console.log('hasPermission status:', hasPermission);
      if (hasPermission) {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          // console.log('Authorization status:', authStatus);
        } else {
          Alert.alert("POST NOTIFICATIONS REQUIRED");
        }
      } else {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      }
    }

  }

  const pushNotificationA = async () => {

    let fcmToken = await messaging().getToken();

    if (fcmToken) {
      console.log("=====tokeb", fcmToken);
    }
  }

  async function onDisplayNotification(title_, body_) {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'kuwaitiApp2024',
      name: 'Kuwaiti App',
    });

    // Display a notification
    await notifee.displayNotification({
      title: title_,
      body: body_,
      soundName: 'default',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'kuwaitiApp2024',
        },
      },
    });
  }


  useEffect(() => {

    checkApplicationPermission();
    pushNotificationA();
    // onDisplayNotification();

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      try {
        console.log('============Remote notification', remoteMessage);
      } catch (err) { console.log(err) }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      try {
        console.log('========App Open By Clicking Notification', remoteMessage)
        //  console.log('========GETTT', remoteMessage.data.title)
        //{"collapseKey": "com.mrtableapp", "data": {"noti_type": "res", "res_id": "1", "title": "Demo 1"}, "from": "923850190175", "messageId": "0:1705855608365261%9fafeec59fafeec5", "notification": {"android": {}, "body": "This is an FCM notification message!", "title": "NotiTest"}, "sentTime": 1705855608343, "ttl": 2419200}
        //naviNotify(remoteMessage.data.title, remoteMessage.data.res_id, remoteMessage.data.noti_type, remoteMessage.data.notify_id);
      } catch (err) { console.log(err) }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(remoteMessage);
        console.log(remoteMessage + "========Token=====Robin");
        if (remoteMessage) {
          console.log(
            '=============Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          //restaurant, user, admin
          //naviNotify(remoteMessage.data.title, remoteMessage.data.res_id, remoteMessage.data.noti_type, remoteMessage.data.notify_id);
        }
      });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        console.log('============foreground notification', remoteMessage.notification);
        onDisplayNotification(remoteMessage.notification.title, remoteMessage.notification.body);
      } catch (err) { console.log(err) }
    });

    return unsubscribe;

  }, []);

  const linking = {
    prefixes: Platform.select({
      ios: ['https://nextjs-sample-ten-cyan.vercel.app'],
      android: ['https://nextjs-sample-ten-cyan.vercel.app/productDetails'],
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
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})