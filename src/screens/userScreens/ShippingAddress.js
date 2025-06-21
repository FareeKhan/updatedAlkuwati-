import {
  Alert,
  Platform,
  ScrollView,
  TextInput,
  StyleSheet,

  TouchableOpacity,
  View,
  I18nManager,
  Modal,
  Dimensions,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { color } from '../../constants/color';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {
  addShippingAddress,
  editAddress,
  editShippingAddress,
} from '../../services/UserServices';
import CustomLoader from '../../components/CustomLoader';
import { useDispatch, useSelector } from 'react-redux';
import { storeUserAddress } from '../../redux/reducer/UserShippingAddress';
import ScreenLoader from '../../components/ScreenLoader';
import HeaderLogo from '../../components/HeaderLogo';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomDropDown from '../../components/CustomDropDown';
import MapView, { Marker } from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { LocationPermission } from '../../components/LocationPermission';
import Geolocation from '@react-native-community/geolocation';
const { height } = Dimensions.get('screen')
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { CountriesData, governorateData } from '../../constants/data';
import HeaderBox from '../../components/HeaderBox';
import Text from '../../components/CustomText'
import { fonts } from '../../constants/fonts';
import { showMessage } from 'react-native-flash-message';

const ShippingAddress = ({ navigation, route }) => {
  const { id, btnText, isMap } = route.params ?? '';
  const { t } = useTranslation();
  const governorate_en = governorateData(t)
  const countries_en = CountriesData(t)

  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.userId);
  const reduxAddress = useSelector((item) => item?.customerAddress?.storeAddress)
  const [modalVisible, setModalVisible] = useState(false);


  const [userAddress, setUserAddress] = useState(userId ? {} : reduxAddress);
  const displayNumber = userAddress?.phone?.startsWith('+965')
    ? userAddress?.phone.slice(4)
    : userAddress?.phone;
  const [fullName, setFullName] = useState(userAddress?.full_name);
  const [city, setCity] = useState(userAddress?.city);
  const [area, setArea] = useState(userAddress?.area);
  const [phoneNumber, setPhoneNumber] = useState(displayNumber);
  const [piece, setPiece] = useState(userAddress?.piece);
  const [email, setEmail] = useState(userAddress?.email);
  const [villa, setVilla] = useState(userAddress?.email);
  const [country, setCountry] = useState(countries_en[0]?.label);
  const [isLoader, setIsLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [countryCodes, setCountryCodes] = useState('+965');
  const [isMapOpened, setIsMapOpened] = useState(false);
  const [panLoader, setPanLoader] = useState(false);
  const [pickupLocation, setPickupLocation] = useState({
    latitude: 25.197741664033977,
    longitude: 55.27969625835015,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null);
  const hasInteractedRef = useRef(false);
  useEffect(() => {
    const staticLocation = {
      latitude: 25.197741664033977,
      longitude: 55.27969625835015,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }

    if (isMap) {
      getCurrentLocation()
    } else {
      if (userAddress) {
        setPickupLocation(userAddress?.pickupLocation ? userAddress?.pickupLocation : staticLocation)
        setIsMapOpened(true)
      } else {
        getCurrentLocation()
      }
    }

  }, [])

  const getCurrentLocation = async () => {
    const result = await LocationPermission();
    console.log('fareed', result)
    if (result == 'granted') {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position?.coords;

          const location = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setPickupLocation(location);

          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion(location, 1000);
            }
          }, 300);

          error => {
            console.log('Location error:', error);
          },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        },
        error => {
          console.log('ss', error);
        },
      );
    } else {
      Alert.alert(t('PleaseAllow'));
      showMessage({
        type: "warning",
        message: t('PleaseAllow')
      })


    }
  };


  useEffect(() => {
    if (userId) {
      handleEdit();
    }
  }, []);

  const handleAreaValue = governorate_en[0]?.label

  useEffect(() => {
    const displayNumber = userAddress?.phone?.startsWith('+965')
      ? userAddress?.phone.slice(4)
      : userAddress?.phone;
    setFullName(userId ? userAddress?.full_name : userAddress?.fullName);
    setCity(userAddress?.city);
    setArea(userAddress?.area ? userAddress?.area : handleAreaValue);
    setPhoneNumber(displayNumber);
    setPiece(userAddress?.street);
    setEmail(userAddress?.email);
    setCountry(userAddress?.country ? userAddress?.country : countries_en[0]?.label);
    setVilla(userAddress?.address);
  }, [userAddress]);


  const handleEdit = async () => {
    try {
      const response = await editAddress(id);
      console.log('showMeAEddit', response);
      if (response?.data?.length > 0) {
        setUserAddress(response?.data[0]);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const saveAddress = () => {

    if (!isMapOpened) {
      showMessage({
        type: "danger",
        message: t('selectLocation')
      })
      return
    }

    if (phoneNumber?.length < 8) {

      showMessage({
        type: "danger",
        message: t('fillNo')
      })
      return;
    }

    if (!fullName || !villa || !city || !area || !country) {

      showMessage({
        type: "danger",
        message: t('fillAll')
      })
      return;
    }



    if (userId) {
      handlePress()
    } else {
      let updatedPhoneNumber =
        phoneNumber[0] === '0' ? phoneNumber?.slice(1) : phoneNumber;
      updatedPhoneNumber = countryCodes + updatedPhoneNumber;
      const addressredux = {
        fullName: fullName,
        street: piece,
        city: city,
        piece: piece,
        email: email,
        area: area,
        phone: updatedPhoneNumber,
        country: country,
        address: villa,
        pickupLocation: pickupLocation

      };
      dispatch(
        storeUserAddress({
          ...addressredux,
          // addressId: id ? id :null,
        }),
      );

      Alert.alert(
        t(''),
        t('addressSaved'),
        [{ text: t('ok'), onPress: () => navigation.goBack() }],
        {
          textAlign: I18nManager.isRTL ? 'right' : 'left', // Align title based on language direction
        },
      );
    }
  }

  const handlePress = async () => {
    // console.log(phoneNumber?.slice(1),'phoneNumber')
    if (
      fullName == '' ||
      piece == '' ||
      city == '' ||
      piece == '' ||
      area == '' ||
      country == ''
    ) {
      alert(t('filldasdAlssl'));
      return;
    }
    setIsLoader(true);
    try {
  
        let updatedPhoneNumber =
          phoneNumber[0] === '0' ? phoneNumber.slice(1) : phoneNumber;
        updatedPhoneNumber = countryCodes + updatedPhoneNumber;
        const addressredux = {
          fullName: fullName,
          street: piece,
          city: city,
          piece: piece,
          email: email,
          area: area,
          phone: updatedPhoneNumber,
          country: country,
          address: villa,
          pickupLocation: pickupLocation
        };
        console.log(addressredux, 'addressredux');
        const response = await (userAddress && id
          ? editShippingAddress(addressredux, userId, id)
          : addShippingAddress(addressredux, userId));


        if (response?.data) {
          dispatch(
            storeUserAddress({
              ...addressredux,
              addressId: id ? id : response.data.id,
            }),
          );
          setIsLoader(false);
          Alert.alert(
            t(''),
            t('addressSavssed'),
            [{ text: t('ok'), onPress: () => navigation.goBack() }],
            {
              textAlign: I18nManager.isRTL ? 'right' : 'left', // Align title based on language direction
            },
          );
        } 
   
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoader(false);
    }

  };

  useEffect(() => {
    const selectedCountry = countries_en.find((item) => item.label === country);
    if (selectedCountry) {
      setCountryCodes(selectedCountry.code);
    } else {
      setCountryCodes(''); // Optional fallback
    }
  }, [country]);

  const onRegionChange = () => {
    setPanLoader(true);
  };


  const onRegionChangeComplete = (newRegion) => {

    setPickupLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      latitudeDelta: newRegion.latitudeDelta,
      longitudeDelta: newRegion.longitudeDelta,
    });
    setPanLoader(false);
    setIsMapOpened(true)
  };


  if (loader) {
    return <ScreenLoader />;
  }

  return (
    <View style={{ marginHorizontal: 20, paddingTop: 40 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <HeaderBox
          style={[{ width: "60%" }, Platform.OS == 'ios' && { marginTop: 30 }]}

        />


        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Text style={[styles.productName]}>{t('shipaddress')}</Text>
        </View>

        <CustomDropDown
          data={countries_en}
          title={t('Country')}
          placeholder={t('Country')}
          setValue={setCountry}
          value={country}
        />

        {country == t('Kuwait') ? (
          <CustomDropDown
            data={governorate_en}
            title={t('governorate')}
            placeholder={t('governorate')}
            setValue={setArea}
            value={area}
          />
        ) : (
          <View>
            <Text
              style={{
                textAlign: 'left',
                marginBottom: 10,
                color: color.theme,
                marginTop: 20,
              }}>
              {t('governorate')}
            </Text>

            <TextInput
              placeholder={t('governorate')}
              value={area}
              onChangeText={setArea}
              autoCorrect={false}
              maxLength={10}
              style={{
                color: '#000',
                height: 50,
                paddingHorizontal: 10,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                writingDirection: 'rtl',
                backgroundColor: '#cccccc70',
                borderRadius: 7,
              }}
              placeholderTextColor={'#cecece'}
            />
          </View>
        )}








        <View style={{ marginTop: 20 }}>
          <Text
            style={{ textAlign: 'left', marginBottom: 10, color: color.theme }}>
            {t('phoneNumber')}
          </Text>
          <View
            style={{
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              // justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              gap: 5,
              // paddingBottom: 10,
              zIndex: 100,
            }}>
            <Text style={{ color: '#000' }}>{`\u2066${countryCodes}\u2069`}</Text>
            <TextInput
              placeholder={t('phoneNumber')}
              value={phoneNumber}
              keyboardType="number-pad"
              onChangeText={setPhoneNumber}
              autoCorrect={false}
              maxLength={10}
              style={{
                color: '#000',
                textAlign: 'left',
                height: 40,
                fontFamily: fonts.regular

              }}
              placeholderTextColor={'#cecece'}
            />
          </View>
        </View>
        <CustomInput
          placeholder={t('typename')}
          title={t('fName')}
          style={{ marginTop: 20 }}
          value={fullName}
          onChangeText={setFullName}
        />

        <CustomInput
          placeholder={t('avenue')}
          title={t('avenue')}
          style={{ marginTop: 20 }}
          value={piece}
          onChangeText={setPiece}
        />

        <CustomInput
          placeholder={t('City')}
          title={t('City')}
          style={{ marginTop: 20 }}
          value={city}
          onChangeText={setCity}
        />

        <CustomInput
          placeholder={t('villa')}
          title={t('villa')}
          style={{ marginTop: 20 }}
          value={villa}
          onChangeText={setVilla}
        />

        {
          isMapOpened ?
            <View>
              <View style={{
                width: '100%',
                height: 150,
                borderRadius: 5,
                overflow: "hidden",
                borderWidth: 0.5,
                marginVertical: 10,
                marginTop: 15

              }}>
                <MapView
                  ref={mapRef}
                  style={{ width: '100%', height: 150 }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                  showsCompass={false}
                  region={pickupLocation}
                >

                  <Marker coordinate={pickupLocation} />
                </MapView>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={{ borderWidth: 1, marginBottom: 5, paddingVertical: 10, alignItems: "center", borderColor: color.theme, borderRadius: 10 }}>
                <Text style={{ color: color.theme, fontSize: 16 }}>{t('changeAddress')}</Text>
              </TouchableOpacity>
            </View>

            :

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addCardBox}>
              <View style={styles.addCardPlusBox}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
              <Text style={{ fontSize: 16, color: color.theme }}>{t('addLocation')}</Text>
            </TouchableOpacity>
        }







        <View style={{ marginTop: 50 }}>
          {isLoader ? (
            <CustomLoader />
          ) : (
            <CustomButton
              title={btnText !== undefined ? btnText : t('save')}
              onPress={saveAddress}

            />
          )}
        </View>
        {/* </KeyboardAvoidingView> */}
      </ScrollView>




      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        // visible={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <Text style={styles.modalText}>Hello World!</Text> */}

            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ height: 30, width: 30, backgroundColor: color.theme, borderRadius: 50, alignItems: "center", justifyContent: "center", position: "absolute", zIndex: 1000, top: Platform.OS == 'ios' ? 50 : 30, left: Platform.OS == 'ios' ? 30 : 20 }}>
              <Entypo name={'cross'} size={20} color={color.white} />
            </TouchableOpacity>

            <MapView
              ref={mapRef}
              style={{ width: "100%", height: height / 1.1 - 50 }}
              region={{
                latitude: pickupLocation.latitude,
                longitude: pickupLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPanDrag={onRegionChange}
              // onRegionChange={onRegionChange}
              onRegionChangeComplete={onRegionChangeComplete}
            />


            <View activeOpacity={0.8} style={{ height: 45, width: 45, borderRadius: 50, alignItems: "center", justifyContent: "center", position: "absolute", zIndex: 1000, bottom: "50%", left: "50%" }}>
              <FontAwesome6 name={'location-dot'} size={40} color={color.theme} />
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={() => getCurrentLocation()} style={{ height: 45, width: 45, backgroundColor: color.theme, borderRadius: 50, alignItems: "center", justifyContent: "center", position: "absolute", zIndex: 1000, bottom: 100, left: Platform.OS == 'ios' ? 30 : 20 }}>
              <EvilIcons name={'location'} size={30} color={color.white} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setModalVisible(false)} style={{ height: 45, width: "80%", backgroundColor: color.theme, borderRadius: 10, alignItems: "center", justifyContent: "center", position: "absolute", zIndex: 1000, bottom: Platform.OS == 'ios' ? 50 : 30, }}>
              <Text style={{ color: "#fff", fontWeight: "500" }}>{panLoader ? t('loading') + ' .....' : t('confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default ShippingAddress;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '70%',
  },
  logoBox: {
    marginLeft: 'auto',
    marginRight: 'auto',
    right: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: color.theme,
    fontFamily: 'Montserrat-Bold',
  },
  addCardBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    height: 50,
    marginVertical: 25,
    borderStyle: 'dashed',
    borderColor: color.theme,
    borderRadius: 5,
    zIndex: -1
  },
  addCardPlusBox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#DDD",
    marginRight: 15

  },
  plusIcon: {
    color: color.theme,
    fontSize: 18
  },





  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    // borderRadius: 20,
    // height: 500,
    // padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    // marginBottom: 15,
    textAlign: 'center',
  },
  markerFixed: {
    position: 'absolute',
  }
});

// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   TextInput,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Keyboard,
//   FlatList,
//   I18nManager,
// } from 'react-native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import ExportSvg from '../../constants/ExportSvg';
// import { color } from '../../constants/color';
// import CustomInput from '../../components/CustomInput';
// import CustomButton from '../../components/CustomButton';
// import {
//   addShippingAddress,
//   userShippingAddress,
// } from '../../services/UserServices';
// import CustomLoader from '../../components/CustomLoader';
// import { useDispatch, useSelector } from 'react-redux';
// import { storeUserAddress } from '../../redux/reducer/UserShippingAddress';
// import ScreenLoader from '../../components/ScreenLoader';
// import HeaderLogo from '../../components/HeaderLogo';
// import { loginData } from '../../redux/reducer/Auth';
// import { useTranslation } from 'react-i18next';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const ShippingAddress = ({ navigation, route }) => {
//   const { totalPrice } = route?.params || '';
//   const { btnText } = route.params ?? '';
//   const userAddress = useSelector(
//     state => state?.customerAddress?.storeAddress,
//   );
//   const userId = useSelector(state => state.auth.userId);
//   const { t } = useTranslation();
//   // forStoring zipCode and countryCode i am using Api param block_avenue and emirates
//   const dispatch = useDispatch();

//   const displayNumber = userAddress?.phone?.startsWith('+965') ? userAddress?.phone.slice(4) : userAddress?.phone;
//   const [fullName, setFullName] = useState(userAddress?.fullName);
//   const [street, setStreet] = useState(userAddress?.street);
//   const [city, setCity] = useState(userAddress?.city);
//   const [area, setArea] = useState(userAddress?.area);
//   const [phoneNumber, setPhoneNumber] = useState(displayNumber);
//   const [piece, setPiece] = useState(userAddress?.piece);
//   const [email, setEmail] = useState(userAddress?.email);
//   const [zipCode, setZipCode] = useState(userAddress?.zipCode);
//   const [countryCode, setCountryCode] = useState(userAddress?.countryCode);
//   const [address, setAddress] = useState(userAddress?.address);
//   const [country, setCountry] = useState(userAddress?.country);
//   const [isLoader, setIsLoader] = useState(false);
//   const [loader, setLoader] = useState(false);
//   const [showCountry, setShowCountry] = useState(false);
//   const [showGover, setShowGover] = useState(false);

//   const openPicker = useCallback(() => {
//     Keyboard.dismiss();
//     setShowCountry(true);
//   }, [showCountry]);

//   const hidePicker = useCallback(
//     item => {
//       setShowCountry(false);
//       setCountry(item);
//     },
//     [showCountry, country],
//   );

//   const openPickerGover = useCallback(() => {
//     Keyboard.dismiss();
//     setShowGover(true);
//   }, [showGover]);

//   const hidePickerGover = useCallback(
//     item => {
//       setShowGover(false);
//       setArea(item);
//     },
//     [showGover, area],
//   );

//   useEffect(() => {
//     //getShippingAddress()
//   }, []);

//   const countries_ar = ['الكويت'];
//   const countries_en = ['Kuwait'];

//   const governorate_ar = [
//     'محافظة العاصمة',
//     'محافظة حولي',
//     'محافظة الأحمدي',
//     'محافظة الجهراء',
//     'محافظة الفروانية',
//     'محافظة مبارك الكبير',
//   ];

//   const governorate_en = [
//     'Al Asima',
//     'Hawally',
//     'Mubarak Al Kabir',
//     'Ahmadi',
//     'Farwaniya',
//     'Jahra',
//   ];

//   useEffect(() => { }, [userAddress]);

//   const handlePress = async () => {
//     // console.log(phoneNumber?.slice(1),'phoneNumber')
//     if (phoneNumber.length == 8) {
//       let updatedPhoneNumber =
//         phoneNumber[0] === '0' ? phoneNumber.slice(1) : phoneNumber;
//       updatedPhoneNumber = '+965' + updatedPhoneNumber;
//       const addressredux = {
//         fullName: fullName,
//         street: street,
//         city: city,
//         piece: piece,
//         email: email,
//         area: area,
//         phone: updatedPhoneNumber,
//         zipCode: zipCode,
//         countryCode: countryCode,
//         address: address,
//         country: country,
//       };
//       console.log(addressredux, 'addressredux');
//       dispatch(storeUserAddress(addressredux));
//       if (userAddress) {
//         navigation.navigate('OrderDetails', {
//           totalPrice: totalPrice,
//           userAddressA: userAddress,
//         });
//       }
//     } else if (phoneNumber.length > 8) {
//       Alert.alert(t('isNotValid'));

//     }
//     else {
//       Alert.alert(t('fillNo'));

//     }

//     //setIsLoader(true)
//     /* try {
//              const response = await addShippingAddress(fullName, street, city, area, phoneNumber, address, zipCode, countryCode, country, userId)
//              if (response) {
//                  setIsLoader(false)
//                  dispatch(storeUserAddress(response?.data))
//                  if (btnText == 'Save') {
//                      alert('Data saved successfully')
//                  } else {
//                      navigation.navigate('OrderDetails', {
//                          totalPrice: totalPrice
//                      })
//                  }

//              } else {
//                  setIsLoader(false)
//                  alert('Your Data is not Correct')

//              }
//          } catch (error) {
//              setIsLoader(false)
//              console.log(error)
//          }*/
//   };

//   const otpverify = () => {
//     /*if(userAddress?.phone){
//             navigation.navigate('VerifyCode', {
//                 totalPrice: totalPrice,
//                 phoneNo: userAddress?.phone,
//                 address: userAddress
//             })
//         }else{
// Alert.alert("Please fill the address.");
//         }*/
//   };

//   const getShippingAddress = async () => {
//     setLoader(true);
//     try {
//       const response = await userShippingAddress(userId);
//       if (response) {
//         setLoader(false);
//         dispatch(
//           storeUserAddress(response?.data?.[response?.data?.length - 1]),
//         );
//       } else {
//         alert('something went wrong');
//         setLoader(false);
//       }
//     } catch (error) {
//       setLoader(false);
//       console.log(error);
//     }
//   };

//   if (loader) {
//     return <ScreenLoader />;
//   }

//   return (
//     <ScrollView style={styles.mainContainer}>
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons
//             size={40}
//             name={
//               I18nManager.isRTL
//                 ? 'chevron-forward-circle'
//                 : 'chevron-back-circle'
//             }
//             color={color.theme}
//           />
//         </TouchableOpacity>
//         {btnText !== undefined && (
//           <View
//             style={{
//               flexDirection: 'row',
//               width: '100%',
//               justifyContent: 'center',
//             }}>
//             <HeaderLogo />
//           </View>
//         )}
//       </View>
//       <View style={{ flexDirection: 'row' }}>
//         <Text style={[styles.productName]}>{t('shipaddress')}</Text>
//       </View>

//         {/* <ScrollView
//           style={{ flex: 1 }}
//           // keyboardShouldPersistTaps="handled"
//           // contentContainerStyle={{ flexGrow: 1 }}
//           showsVerticalScrollIndicator={false}> */}
//                   {/* <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
//           <CustomInput
//             placeholder={t('email')}
//             title={t('email')}
//             style={{ marginTop: 20 }}
//             value={email}
//             onChangeText={setEmail}
//             autoCapitalize={false}
//             keyboardType={'email'}
//           />
//           {/* <CustomInput
//                         placeholder={t('phoneNumber')}
//                         // title={t('phoneNumber')}
//                         style={{ marginTop: 20 }}
//                         value={phoneNumber}
//                         autoCorrect={false}
//                         keyboardType='number-pad'
//                         onChangeText={setPhoneNumber}
//                     /> */}
//           <View style={{ marginTop: 20 }}>
//             <Text
//               style={{ textAlign: 'left', marginBottom: 10, color: color.theme }}>
//               {t('phoneNumber')}
//             </Text>
//             <View
//               style={{
//                 flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
//                 justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start',
//                 alignItems: 'center',
//                 borderBottomWidth: 1,
//                 borderBottomColor: '#ccc',
//                 // paddingBottom: 10,
//               }}>
//               <Text style={{color:"#000"}}>{'\u2066+965\u2069'}</Text>
//               <TextInput
//                 placeholder={t('phoneNumber')}
//                 value={phoneNumber}
//                 keyboardType="number-pad"
//                 onChangeText={setPhoneNumber}
//                 autoCorrect={false}
//                 maxLength={10}
//                 style={{ color: "#000" }}
//                 placeholderTextColor={"#cecece"}
//               />
//             </View>
//           </View>
//           <CustomInput
//             placeholder={t('typename')}
//             title={t('fName')}
//             style={{ marginTop: 20 }}
//             value={fullName}
//             onChangeText={setFullName}
//           />

//           <CustomInput
//             placeholder={t('avenue')}
//             title={t('avenue')}
//             style={{ marginTop: 20 }}
//             value={piece}
//             onChangeText={setPiece}
//           />

//           <CustomInput
//             placeholder={t('EStreet')}
//             title={t('Street')}
//             style={{ marginTop: 20 }}
//             value={street}
//             onChangeText={setStreet}
//           />

//           <CustomInput
//             placeholder={t('City')}
//             title={t('City')}
//             style={{ marginTop: 20 }}
//             value={city}
//             onChangeText={setCity}
//           />
//           <View
//             style={{
//               position: 'relative',
//               backgroundColor: 'white',
//               zIndex: 2662,
//             }}>
//             <CustomInput
//               placeholder={t('governorate')}
//               title={t('governorate')}
//               style={{ marginTop: 20 }}
//               value={area}
//               onChangeText={openPickerGover}
//               onBlur={() => {
//                 openPickerGover;
//               }}
//               onFocus={openPickerGover}
//             />
//             {showGover ? (
//               <>
//                 <FlatList
//                   style={{
//                     backgroundColor: 'white',
//                     borderWidth: 1,
//                     borderColor: '#ccc',
//                     borderRadius: 5,
//                     elevation: 1,
//                     zIndex: 2662,
//                     maxHeight: 150,
//                     width: '100%',
//                     marginTop: 80,
//                     position: 'absolute',
//                   }}
//                   data={I18nManager.isRTL ? governorate_ar : governorate_en}
//                   renderItem={({ item, index }) => (
//                     <TouchableOpacity onPress={() => hidePickerGover(item)}>
//                       <Text
//                         style={{
//                           padding: 8,
//                           width: '100%',
//                           borderBottomWidth: 1,
//                           borderColor: 'grey',
//                           color:"#000"
//                         }}>
//                         {item}
//                       </Text>
//                     </TouchableOpacity>
//                   )}
//                   keyExtractor={item => item}
//                 />
//               </>
//             ) : null}
//           </View>

//           {/* <CustomInput
//                         placeholder={t('taddress')}
//                         title={t('Address')}
//                         style={{ marginTop: 20 }}
//                         value={address}
//                         onChangeText={setAddress}
//                     />

//                     <CustomInput
//                         placeholder={t('tzc')}
//                         title={t('zc')}
//                         style={{ marginTop: 20 }}
//                         value={zipCode}
//                         onChangeText={setZipCode}
//                     />
//                     <CustomInput
//                         placeholder={'+971'}
//                         title={t('CountryCode')}
//                         style={{ marginTop: 20 }}
//                         value={countryCode}
//                         onChangeText={setCountryCode}
//                     />*/}
//           <View
//             style={{
//               position: 'relative',
//               marginBottom: 100,
//               backgroundColor: 'white',
//             }}>
//             <CustomInput
//               placeholder={t('Country')}
//               title={t('Country')}
//               style={{ marginVertical: 20 }}
//               value={country}
//               onChangeText={openPicker}
//               onBlur={() => {
//                 openPicker;
//               }}
//               onFocus={openPicker}
//             />

//             {showCountry ? (
//               <>
//                 <FlatList
//                   style={{
//                     backgroundColor: 'white',
//                     borderWidth: 1,
//                     borderColor: '#ccc',
//                     borderRadius: 5,
//                     elevation: 1,
//                     zIndex: 2662,
//                     maxHeight: 150,
//                     width: '100%',
//                     marginTop: 80,
//                     position: 'absolute',
//                   }}
//                   data={I18nManager.isRTL ? countries_ar : countries_en}
//                   renderItem={({ item, index }) => (
//                     <TouchableOpacity onPress={() => hidePicker(item)}>
//                       <Text
//                         style={{
//                           padding: 8,
//                           width: '100%',
//                           borderBottomWidth: 1,
//                           borderColor: 'grey',
//                           color:"#000"
//                         }}>
//                         {item}
//                       </Text>
//                     </TouchableOpacity>
//                   )}
//                   keyExtractor={item => item}
//                 />
//               </>
//             ) : null}
//           </View>
//           <View style={{ marginBottom: 100 }}>
//             {isLoader ? (
//               <CustomLoader />
//             ) : (
//               <CustomButton
//                 title={btnText !== undefined ? btnText : t('save')}
//                 onPress={handlePress}
//                 disabled={
//                   btnText == 'Save' &&
//                   fullName == userAddress?.full_name &&
//                   street == userAddress?.street &&
//                   city == userAddress?.city &&
//                   area == userAddress?.area &&
//                   phoneNumber == userAddress?.phone &&
//                   piece == userAddress?.piece &&
//                   // governorate == userAddress?.governorate &&
//                   country == userAddress?.country
//                 }
//               />
//             )}
//           </View>
//           {/* </KeyboardAvoidingView>
//         </ScrollView> */}
//     </ScrollView>
//   );
// };

// export default ShippingAddress;

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     paddingTop: Platform.OS == 'ios' ? 40 : 35,
//     paddingHorizontal: 15,
//     backgroundColor: '#fff',
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     width: '70%',
//   },
//   logoBox: {
//     marginLeft: 'auto',
//     marginRight: 'auto',
//     right: 10,
//   },
//   productName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: color.theme,
//     fontFamily: 'Montserrat-Bold',
//   },
// });
