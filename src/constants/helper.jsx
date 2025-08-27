import {PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';


export const locationPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (result === 'granted') {
        return result;
      } 
      return result
    } else {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        return result;
      } 
      return result
    }
  } catch (error) {
    return error;
  }
};