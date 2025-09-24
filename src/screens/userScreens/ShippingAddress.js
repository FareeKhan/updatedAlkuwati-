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
  Linking,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {color} from '../../constants/color';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {
  addShippingAddress,
  editAddress,
  editShippingAddress,
} from '../../services/UserServices';
import CustomLoader from '../../components/CustomLoader';
import {useDispatch, useSelector} from 'react-redux';
import {storeUserAddress} from '../../redux/reducer/UserShippingAddress';
import ScreenLoader from '../../components/ScreenLoader';
import HeaderLogo from '../../components/HeaderLogo';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomDropDown from '../../components/CustomDropDown';
import MapView, {Marker} from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Geolocation from '@react-native-community/geolocation';
const {height} = Dimensions.get('screen');
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {CountriesData, governorateData} from '../../constants/data';
import HeaderBox from '../../components/HeaderBox';
import Text from '../../components/CustomText';
import {fonts} from '../../constants/fonts';
import {showMessage} from 'react-native-flash-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { locationPermission } from '../../constants/helper';

const ShippingAddress = ({navigation, route}) => {
  const {id, btnText, isMap} = route.params ?? '';
  const {t} = useTranslation();
  const governorate_en = governorateData(t);
  const countries_en = CountriesData(t);
  const mapRef = useRef(null);

  const userPhone = useSelector(state => state.auth?.mobile);
  const countryCode = useSelector(state => state.auth?.countryCode);
  const userId = useSelector(state => state.auth.userId);

  const phoneUserNumber = countryCode + userPhone;
  const userName = useSelector(state => state.auth?.userData);
  const filterName = userName?.find(
    item => item?.phoneUserNumber == phoneUserNumber,
  );

  console.log('----->>>>>>',filterName);
  const [modalVisible, setModalVisible] = useState(false);
  const [userAddress, setUserAddress] = useState();

  const [area, setArea] = useState('');
  const [avenuePostalCoder, setAvenuePostalCoder] = useState();
  const [email, setEmail] = useState();
  const [country, setCountry] = useState(countries_en[0]?.label);
  const [isLoader, setIsLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [countryCodes, setCountryCodes] = useState('+965');
  const [isMapOpened, setIsMapOpened] = useState(false);
  const [panLoader, setPanLoader] = useState(false);

  const [governorate, setGovernorate] = useState('');
  const [blockArea, setBlockArea] = useState('');
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [pickupLocation, setPickupLocation] = useState({
    latitude: 25.197741664033977,
    longitude: 55.27969625835015,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
 
     if (!id) {
      locationPermission();
    }
  }, []);

  const getCurrentLocation = async () => {
    const result = await locationPermission();
    console.log('fareed', result);
    if (result == 'granted') {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position?.coords;

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
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000};
        },
        error => {
          console.log('ss', error);
        },
      );
    } else {
           Alert.alert(
             'Alert',
             'Kuwaiti needs access to your location to provide accurate delivery. Please enable location in Settings to continue.',
             [
               {
                 text: 'Open Setting',
                 onPress: () => { setModalVisible(false),Linking.openSettings()},
               },
               {
                 text: 'Later',
                 onPress: () => {setModalVisible(false)},
               },
             ],
           );
    }
  };

  useEffect(() => {
    if (id) {
      handleEdit();
    }
  }, [id]);

  const handleEdit = async () => {
    setLoader(true);
    try {
      const response = await editAddress(id);
      console.log('showMeAEddit', response);
      if (response?.data?.length > 0) {
        setUserAddress(response?.data[0]);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const location = {
      latitude: userAddress?.latitude,
      longitude: userAddress?.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setCountry(
      userAddress?.country ? userAddress?.country : countries_en[0]?.label,
    );
    setGovernorate(userAddress?.governorate);
    setCity(userAddress?.city);
    setBlockArea(userAddress?.block_avenue);
    setArea(userAddress?.area);
    setStreet(userAddress?.street);
    setAvenuePostalCoder(userAddress?.emirates);
    setHouse(userAddress?.house);
    setAdditionalInfo(userAddress?.additional_info);
    setPickupLocation({
      latitude: parseFloat(userAddress?.latitude),
      longitude: parseFloat(userAddress?.longitude),
         latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(location, 1000);
      }
    }, 1000);
    {
      id && setIsMapOpened(true);
    }
  }, [userAddress,id]);

  const saveAddress = async () => {
    if (
      !country ||
      !city ||
      (isSelectedCountry && !blockArea) ||
      (!isSelectedCountry && !area) ||
      !street ||
      !house
    ) {
      showMessage({
        type: 'danger',
        message: t('fillAll'),
      });
      return;
    }

    if (!isMapOpened) {
      showMessage({
        type: 'danger',
        message: t('selectLocation'),
      });
      return;
    }

    setIsLoader(true);
    try {
      const addressredux = {
        user_id: userId,
        country: country,
        governorate: governorate,
        city: city,
        block_avenue: blockArea,
        area: area,
        street: street,
        house: house,
        fullName: filterName?.fullName,
        phone: phoneUserNumber,
        address: house + street + city + country,
        avenuePostalCoder: avenuePostalCoder,
        additionalInfo: additionalInfo,
        location: pickupLocation,
      };
      const response = await (userAddress && id
        ? editShippingAddress(addressredux, id)
        : addShippingAddress(addressredux));

      if (response?.data) {
        setIsLoader(false);
        showMessage({
          type: 'success',
          message: t('addressSaved'),
        });

        navigation.goBack();
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    const selectedCountry = countries_en.find(item => item.label === country);
    if (selectedCountry) {
      setCountryCodes(selectedCountry.code);
      if (country == t('Kuwait')) {
        setGovernorate(governorate_en[0]?.label);
      }
    } else {
      setCountryCodes('');
    }
  }, [country]);

  const onRegionChange = () => {
    setPanLoader(true);
  };

  const onRegionChangeComplete = newRegion => {
    setPickupLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      latitudeDelta: newRegion.latitudeDelta,
      longitudeDelta: newRegion.longitudeDelta,
    });
    setPanLoader(false);
    setIsMapOpened(true);
  };
  const isSelectedCountry = country == t('Kuwait');

  if (loader) {
    return <ScreenLoader />;
  }

  return (
    <View style={{marginHorizontal: 20, paddingTop: 40}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 350}}
        showsVerticalScrollIndicator={false}>
        <HeaderBox
          style={[{width: '60%'}, Platform.OS == 'ios' && {marginTop: 30}]}
        />

        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text style={[styles.productName]}>{t('shipaddress')}</Text>
        </View>

        <CustomDropDown
          data={countries_en}
          title={t('Country')}
          placeholder={t('Country')}
          setValue={setCountry}
          value={country}
          maxHeight={300}
        />

        {isSelectedCountry && (
          <CustomDropDown
            data={governorate_en}
            title={t('governorate')}
            placeholder={t('governorate')}
            setValue={setGovernorate}
            value={governorate}
            maxHeight={300}
          />
        )}

        <CustomInput
          placeholder={isSelectedCountry ? t('areaCity') : t('City')}
          title={isSelectedCountry ? t('areaCity') : t('City')}
          style={{marginTop: 20}}
          value={city}
          onChangeText={setCity}
        />

        {isSelectedCountry ? (
          <CustomInput
            placeholder={isSelectedCountry ? t('block') : t('area')}
            title={isSelectedCountry ? t('block') : t('area')}
            style={{marginTop: 20}}
            value={blockArea}
            onChangeText={setBlockArea}
          />
        ) : (
          <CustomInput
            placeholder={t('area')}
            title={t('area')}
            style={{marginTop: 20}}
            value={area}
            onChangeText={setArea}
          />
        )}

        <CustomInput
          placeholder={t('street')}
          title={t('street')}
          style={{marginTop: 20}}
          value={street}
          onChangeText={setStreet}
        />

        {isSelectedCountry && (
          <CustomInput
            placeholder={t('avenue')}
            title={t('avenue')}
            style={{marginTop: 20}}
            value={avenuePostalCoder}
            onChangeText={setAvenuePostalCoder}
          />
        )}

        <CustomInput
          placeholder={t('house')}
          title={t('house')}
          style={{marginTop: 20}}
          value={house}
          onChangeText={setHouse}
        />

        {!isSelectedCountry && (
          <CustomInput
            placeholder={t('PO-BOX')}
            title={t('PO-BOX')}
            style={{marginTop: 20}}
            value={avenuePostalCoder}
            onChangeText={setAvenuePostalCoder}
          />
        )}

        <CustomInput
          placeholder={t('additionalInfo')}
          title={t('additionalInfo')}
          style={{marginTop: 20}}
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          multiline
        />

        {isMapOpened ? (
          <View>
            <View
              style={{
                width: '100%',
                height: 150,
                borderRadius: 5,
                overflow: 'hidden',
                borderWidth: 0.5,
                marginVertical: 10,
                marginTop: 15,
              }}>
              <MapView
                ref={mapRef}
                style={{width: '100%', height: 150}}
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
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                borderWidth: 1,
                marginBottom: 5,
                paddingVertical: 10,
                alignItems: 'center',
                borderColor: color.theme,
                borderRadius: 10,
              }}>
              <Text style={{color: color.theme, fontSize: 16}}>
                {t('changeAddress')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addCardBox}>
            <View style={styles.addCardPlusBox}>
              <AntDesign name={'plus'} size={15} color={color.black} />
            </View>
            <Text style={{fontSize: 16, color: color.theme}}>
              {t('addLocation')}
            </Text>
          </TouchableOpacity>
        )}
        <View style={{marginTop: 50}}>
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

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                height: 30,
                width: 30,
                backgroundColor: color.theme,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 1000,
                top: Platform.OS == 'ios' ? 50 : 30,
                left: Platform.OS == 'ios' ? 30 : 20,
              }}>
              <Entypo name={'cross'} size={20} color={color.white} />
            </TouchableOpacity>

            <MapView
              ref={mapRef}
              style={{width: '100%', height: height / 1.1 - 50}}
              region={{
                latitude: pickupLocation.latitude ||25.197741664033977,
                longitude: pickupLocation.longitude || 55.27969625835015,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }} 
              onPanDrag={onRegionChange}
              onRegionChangeComplete={onRegionChangeComplete}
            />

            <View
              activeOpacity={0.8}
              style={{
                height: 45,
                width: 45,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 1000,
                bottom: '50%',
                left: '50%',
              }}>
              <FontAwesome6
                name={'location-dot'}
                size={40}
                color={color.theme}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => getCurrentLocation()}
              style={{
                height: 45,
                width: 45,
                backgroundColor: color.theme,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 1000,
                bottom: 100,
                left: Platform.OS == 'ios' ? 30 : 20,
              }}>
              <EvilIcons name={'location'} size={30} color={color.white} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setModalVisible(false)}
              style={{
                height: 45,
                width: '80%',
                backgroundColor: color.theme,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 1000,
                bottom: Platform.OS == 'ios' ? 50 : 30,
              }}>
              <Text style={{color: '#fff', fontWeight: '500'}}>
                {panLoader ? t('loading') + '.....' : t('confirm')}
              </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 50,
    marginVertical: 25,
    borderStyle: 'dashed',
    borderColor: color.theme,
    borderRadius: 5,
    zIndex: -1,
  },
  addCardPlusBox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#DDD',
    marginRight: 15,
  },
  plusIcon: {
    color: color.theme,
    fontSize: 18,
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
  },
});
