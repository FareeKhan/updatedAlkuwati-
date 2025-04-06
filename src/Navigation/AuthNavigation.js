import {StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/auth/Login';
import SignUp from '../screens/auth/SignUp';

const Stack = createStackNavigator();
const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false  }} >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  )
}

export default AuthNavigation

const styles = StyleSheet.create({})



