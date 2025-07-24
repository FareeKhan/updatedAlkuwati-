import {
  Alert,
  Image,
  Platform,
  I18nManager,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import ExportSvg from '../../constants/ExportSvg';
import {color} from '../../constants/color';
import {baseUrl} from '../../constants/data';
import {useDispatch, useSelector} from 'react-redux';
import {personalData} from '../../services/UserServices';
import {logout} from '../../redux/reducer/Auth';
import {DrawerActions, useFocusEffect} from '@react-navigation/native';
import HeaderLogo from '../../components/HeaderLogo';
import {useTranslation} from 'react-i18next';
import DrawerSceneWrapper from '../../Navigation/DrawerSceneWrapper';
import RNRestart from 'react-native-restart';
import {loginData, changeLanguage} from '../../redux/reducer/Auth';
import {getOrder} from '../../services/UserServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from '../../components/CustomText';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import HeaderBox from '../../components/HeaderBox';
import {showMessage} from 'react-native-flash-message';
import {emptyStoreUserAddress} from '../../redux/reducer/UserShippingAddress';
import linking from './Linking';

const UserProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth?.userId);
  const userName = useSelector(state => state.auth?.userName);
  const userPhone = useSelector(state => state.auth?.mobile);
  const countryCode = useSelector(state => state.auth?.countryCode);
  const userDataFromRedux = useSelector(state => state.auth?.userData);
  const phoneUserNumber = countryCode + userPhone;
  const isCheckAvailableName = userDataFromRedux?.find(
    item => item?.phoneUserNumber == phoneUserNumber,
  );
  // const userName = useSelector((state) => state.customerAddress?.storeAddress?.fullName);

  // const userName = useSelector((state) => state.customerAddress?.storeAddress?.fullName);
  const {t} = useTranslation();
  const [userData, setUserData] = useState('');
  const [getName, setName] = useState();
  const [storeOrder, setStoreOrder] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [profileLoader, setProfileLoader] = useState(false);
  const [SupportURL, setSupportURL] = useState();
  const isLanguage = useSelector(state => state.auth?.isLanguage);


  const UserNavigation = ({SVG, title, onPress, lng  }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.userContainer}>
        {SVG}
        <Text style={styles.navigationTxt}>
          {title}{' '}
          {lng && (
            <Text style={styles.navigationTxtss}>
              {isLanguage == 'en' ? 'العربية' : 'English'}
            </Text>
          )}
        </Text>
        {I18nManager.isRTL ? (
          <View
            style={{
              marginLeft: 'auto',
              textAlign: 'left',
              flexDirection: 'row',
            }}>
            <Ionicons
              name={'chevron-back-outline'}
              size={15}
              color={'#67300f'}
              styles={{}}
            />
          </View>
        ) : (
          <ExportSvg.RightArrow style={{marginLeft: 'auto'}} />
        )}
      </TouchableOpacity>
    );
  };

  const orderData = async () => {
    setIsLoader(true);
    try {
      const response = await getOrder(userId);

      if (response?.status == 'success') {
        setIsLoader(false);
        setStoreOrder(response?.data);
      } else {
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      console.log(error);
    }
  };



  // const onPressLanguage = async (value) => {
  //   setIsSelectedLang(value);

  //   dispatch(
  //     changeLanguage({
  //       isLanguage: value,
  //     })
  //   );

  //   if (value !== isSelectedLang) {
  //     setlng(value);
  //     if (value !== "en") {
  //       I18nManager.forceRTL(true);
  //       setTimeout(() => {
  //         RNRestart.Restart();
  //       }, 100);
  //     } else {
  //       I18nManager.forceRTL(false);
  //       setTimeout(() => {
  //         RNRestart.Restart();
  //       }, 100);
  //     }
  //   }
  // };
  const onPressLanguage = async  => {
    const isChangeLanguage = isLanguage == 'en' ? 'ar' : 'en'
    console.log('isLanguage',isChangeLanguage)
    dispatch(
      changeLanguage({
        isLanguage: isChangeLanguage,
      }),
    );

      if (isChangeLanguage == 'ar') {
            I18nManager.allowRTL(true);
            I18nManager.forceRTL(true);
        } else {
            I18nManager.allowRTL(false);
            I18nManager.forceRTL(false);
        }

        setTimeout(() => {
            RNRestart.Restart();
        }, 800);

    // if (value === 'ar') {
    //    console.log('Setting RTL');
    //   I18nManager.allowRTL(true);
    //   I18nManager.forceRTL(true);
    // } else {
    //     console.log('Setting LTR');
    //   I18nManager.allowRTL(false); 
    //   I18nManager.forceRTL(false); 
    // }

    // setTimeout(() => {
    //   console.log('Restarting App...');
    //   RNRestart.Restart();
    // }, 500);
  };

  const OpenURLButton = useCallback(async url => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  });

  useEffect(() => {
    orderData();
  }, [userId]);

  const profileData = async () => {
    setProfileLoader(true);
    try {
      const response = await personalData(userId);
      console.log('responsekljjkljklj', response);
      if (response?.status) {
        setUserData(response?.data);
        setProfileLoader(false);
      }
    } catch (error) {
      setProfileLoader(false);
      console.log(error);
    } finally {
      setProfileLoader(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      profileData();
    });

    return unsubscribe;
  }, [navigation]);

  const setImage = name => {
    setName(name.substring(0, 1));
  };

  const LogoutPress = () => {
    dispatch(logout());
    dispatch(emptyStoreUserAddress());
    navigation.navigate('Login');
  };

  const createTwoButtonAlert = () =>
    Alert.alert(t('Delete Your Account?'), t('Are You Sure?'), [
      {
        text: t('Cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: t('OK'), onPress: () => LogoutPress()},
    ]);

  // const handleWhatsapp = () => {
  //   // const email = 'info@alkwaityalawal.com';
  //   // const subject = 'Hello';
  //   // const body = 'I would like to get in touch with you.';

  //   // const mailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  //   // Linking.openURL(mailUrl).catch(err => {
  //   //   Alert.alert('Error', 'Could not open mail app.');
  //   //   console.error('Email error:', err);
  //   // });
  //   const mobileNo ='+971554087425'
  //   const whatsappNo = `https://api.whatsapp.com/send/?phone=${mobileNo}`
  //   Linking.openURL(whatsappNo)

  // };

  const handleWhatsapp = () => {
    // const mobileNo = '+971554087425';
    const mobileNo = '+96561664536';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${mobileNo?.replace(
      '+',
      '',
    )}`; // remove '+' for WhatsApp API

    Linking.openURL(whatsappUrl).catch(err => {
      Alert.alert('Error', 'Could not open WhatsApp.');
    });
  };

  const onPressProfile = () => {
    if (userId) {
      navigation.navigate('UserDetails');
    } else {
      showMessage({
        type: 'danger',
        message: t('noAvailable'),
      });
    }
  };

  return (
    <DrawerSceneWrapper>
      <View style={styles.mainContainer}>
        <HeaderBox isDrawer={true} cartIcon={true} />
        <TouchableOpacity
          disabled={!userId}
          onPress={onPressProfile}
          style={styles.profileContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <View
              style={{
                borderWidth: 1,
                height: 35,
                width: 35,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AntDesign name={'user'} size={20} color={'#000'} />
            </View>
            <View style={{width: '80%'}}>
              <Text style={styles.userName}>
                {userId ? isCheckAvailableName?.fullName : t('noAvailable')}
              </Text>
              {userId && (
                <Text style={styles.userEmail}>
                  {'\u202A'}
                  {countryCode}
                  {userPhone}
                  {'\u202C'}
                </Text>
              )}
            </View>
          </View>

          {userId && (
            <Entypo
              name={
                I18nManager.isRTL ? 'chevron-small-left' : 'chevron-small-right'
              }
              size={25}
              color={color.black}
            />
          )}
        </TouchableOpacity>

        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 90,
              paddingHorizontal: 4,
            }}>
            <View style={[styles.Wrapper]}>
              {userId && (
                <>
                  <UserNavigation
                    SVG={<ExportSvg.MyOrder />}
                    title={t('my_orders')}
                    onPress={() => navigation.navigate('TrackOrder')}
                  />

                  <UserNavigation
                    SVG={<ExportSvg.MyFavrt />}
                    title={t('my_favourites')}
                    onPress={() => navigation.navigate('MyFavorite')}
                  />

                  <UserNavigation
                    SVG={<ExportSvg.ShippingAddress />}
                    title={t('shipping_address')}
                    onPress={() =>
                      navigation.navigate('SavedAddresses', {
                        isAdd: true,
                      })
                    }
                  />
                  <TouchableOpacity
                    onPress={() => handleWhatsapp()}
                    style={styles.userContainer}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#cecece90',
                        borderRadius: 7,
                      }}>
                      <MaterialIcons
                        name={'support-agent'}
                        size={25}
                        color={'#67300f'}
                        styles={{}}
                      />
                    </View>
                    <Text style={styles.navigationTxt}>{t('Support')}</Text>
                    {I18nManager.isRTL ? (
                      <View
                        style={{
                          marginLeft: 'auto',
                          textAlign: 'left',
                          flexDirection: 'row',
                        }}>
                        <Ionicons
                          name={'chevron-back-outline'}
                          size={15}
                          color={'#67300f'}
                          styles={{}}
                        />
                      </View>
                    ) : (
                      <ExportSvg.RightArrow style={{marginLeft: 'auto'}} />
                    )}
                  </TouchableOpacity>
                  {/* dasdas */}

                  <TouchableOpacity
                    onPress={() => navigation.navigate('WebPages',{
                      title:t('TermsCondition'),
                      pageNo:1
                    })}
                    style={styles.userContainer}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#cecece90',
                        borderRadius: 7,
                      }}>
                      <Feather
                        name={'sliders'}
                        size={22}
                        color={'#67300f'}
                        styles={{}}
                      />
                    </View>
                    <Text style={styles.navigationTxt}>
                      {t('TermsCondition')}
                    </Text>
                    {I18nManager.isRTL ? (
                      <View
                        style={{
                          marginLeft: 'auto',
                          textAlign: 'left',
                          flexDirection: 'row',
                        }}>
                        <Ionicons
                          name={'chevron-back-outline'}
                          size={15}
                          color={'#67300f'}
                          styles={{}}
                        />
                      </View>
                    ) : (
                      <ExportSvg.RightArrow style={{marginLeft: 'auto'}} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                     onPress={() => navigation.navigate('WebPages',{
                      title:t('refundPolicy'),
                      pageNo:2
                    })}
                    style={styles.userContainer}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#cecece90',
                        borderRadius: 7,
                      }}>
                      <AntDesign
                        name={'info'}
                        size={25}
                        color={'#67300f'}
                        styles={{}}
                      />
                    </View>
                    <Text style={styles.navigationTxt}>
                      {t('refundPolicy')}
                    </Text>
                    {I18nManager.isRTL ? (
                      <View
                        style={{
                          marginLeft: 'auto',
                          textAlign: 'left',
                          flexDirection: 'row',
                        }}>
                        <Ionicons
                          name={'chevron-back-outline'}
                          size={15}
                          color={'#67300f'}
                          styles={{}}
                        />
                      </View>
                    ) : (
                      <ExportSvg.RightArrow style={{marginLeft: 'auto'}} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                      onPress={() => navigation.navigate('WebPages',{
                      title:t('aboutPage'),

                      })}
                    style={styles.userContainer}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#cecece90',
                        borderRadius: 7,
                      }}>
                      <Feather
                        name={'minus-circle'}
                        size={25}
                        color={'#67300f'}
                        styles={{}}
                      />
                    </View>
                    <Text style={styles.navigationTxt}>{t('aboutPage')}</Text>
                    {I18nManager.isRTL ? (
                      <View
                        style={{
                          marginLeft: 'auto',
                          textAlign: 'left',
                          flexDirection: 'row',
                        }}>
                        <Ionicons
                          name={'chevron-back-outline'}
                          size={15}
                          color={'#67300f'}
                          styles={{}}
                        />
                      </View>
                    ) : (
                      <ExportSvg.RightArrow style={{marginLeft: 'auto'}} />
                    )}
                  </TouchableOpacity>
                </>
              )}
              <UserNavigation
                SVG={
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#cecece90',
                      borderRadius: 7,
                    }}>
                    <Fontisto
                      name={'world-o'}
                      size={25}
                      color={'#67300f'}
                      styles={{}}
                    />
                  </View>
                }
                title={t('language')}
                lng={true}
                onPress={() =>  onPressLanguage()  }
              />

              {userId && (
                <>
                  <TouchableOpacity
                    onPress={LogoutPress}
                    style={styles.userContainer}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#cecece90',
                        borderRadius: 7,
                      }}>
                      <Ionicons
                        name={'log-out-sharp'}
                        size={25}
                        color={'#67300f'}
                        styles={{}}
                      />
                    </View>
                    <Text style={styles.navigationTxt}>{t('logout')}</Text>

                    {I18nManager.isRTL ? (
                      <View
                        style={{
                          marginLeft: 'auto',
                          textAlign: 'left',
                          flexDirection: 'row',
                        }}>
                        <Ionicons
                          name={'chevron-back-outline'}
                          size={15}
                          color={'#67300f'}
                          styles={{}}
                        />
                      </View>
                    ) : (
                      <ExportSvg.RightArrow style={{marginLeft: 'auto'}} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={createTwoButtonAlert}
                    style={styles.userContainer}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#cecece90',
                        borderRadius: 7,
                      }}>
                      <ExportSvg.logoutUser />
                    </View>
                    <Text style={styles.navigationTxt}>
                      {t('Delete Account')}
                    </Text>
                    {I18nManager.isRTL ? (
                      <View
                        style={{
                          marginLeft: 'auto',
                          textAlign: 'left',
                          flexDirection: 'row',
                        }}>
                        <Ionicons
                          name={'chevron-back-outline'}
                          size={15}
                          color={'#67300f'}
                          styles={{}}
                        />
                      </View>
                    ) : (
                      <ExportSvg.RightArrow style={{marginLeft: 'auto'}} />
                    )}
                  </TouchableOpacity>
                </>
              )}

              {!userId && (
                <>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.userContainer}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#cecece90',
                        borderRadius: 7,
                      }}>
                      <FontAwesome
                        name={'user-circle-o'}
                        size={25}
                        color={'#67300f'}
                        styles={{}}
                      />
                    </View>
                    <Text style={styles.navigationTxt}>{t('login')}</Text>
                    {I18nManager.isRTL ? (
                      <View
                        style={{
                          marginLeft: 'auto',
                          textAlign: 'left',
                          flexDirection: 'row',
                        }}>
                        <Ionicons
                          name={'chevron-back-outline'}
                          size={15}
                          color={'#67300f'}
                          styles={{}}
                        />
                      </View>
                    ) : (
                      <ExportSvg.RightArrow style={{marginLeft: 'auto'}} />
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </>
      </View>

      <View>
        <Text style={styles.navigationTxt}>{t('logout')}</Text>
      </View>
    </DrawerSceneWrapper>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS == 'android' ? 20 : 70,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  txt: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: 'grey',
    borderWidth: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'grey',
  },
  txtTxt: {
    justifyContent: 'center',
    fontSize: 40,
    color: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '90%',
    marginTop: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    elevation: 5,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 13,
  },
  userName: {
    fontSize: 17,
    color: color.theme,
    fontWeight: '600',
    textAlign: 'left',
  },
  userEmail: {
    fontSize: 13,
    color: '#AAA',
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
    textAlign: 'left',
  },
  Wrapper: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderColor: '#DDD',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    // elevation: 5,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  navigationTxt: {
    color: color.theme,
    marginLeft: 10,
  },
  navigationTxtss: {
    color: color.theme,
    marginLeft: 0,
  },
});
