import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import { GOOGLE_API } from '../constants/data';


export const LocationPermission = async () => {
  const askSetting = () => {
    Alert.alert(
      'Alert',
      'Kuwaiti needs access to your location',
      [
        {
          text: 'Open Setting',
          onPress: () => Linking.openSettings(),
        },
        {
          text: 'Later',
          onPress: () => null,
        },
      ],
    );
  };

  try {
    if (Platform.OS == 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

   
      if (result == 'granted') {
        return result;
      } else {
        askSetting();
      }
    } else {
      if (
        parseInt(Platform.constants['Release']) >= 7 &&
        parseInt(Platform.constants['Release']) <= 12
      ) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (result == 'granted') {
          return result;
        } else {
          if (result !== 'denied' && result == 'never_ask_again') {
            askSetting();
          } else if (result == 'denied' && result !== 'never_ask_again') {
          }
        }
      } else if (parseInt(Platform.constants['Release']) > 12) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (result == 'granted') {
          return result;
        } else {
          if (result !== 'denied' && result == 'never_ask_again') {
            askSetting();
          } else if (result == 'denied' && result !== 'never_ask_again') {
          }
        }
      } else {
        askSetting();
      }
    }
  } catch (error) {
    return error;
  }
};


 export const fetchAddress = async (lat, lng) => {
  console.log('lat, lng',lat, lng)
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API}`
    );
    const data = await response.json();
    //console.log('heloo world',data?.results[0])
   return data
  } catch (error) {
    console.error("Error fetching address:", error);
  }
};