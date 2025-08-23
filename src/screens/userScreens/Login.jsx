import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  I18nManager,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Screen from './Screen';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {color} from '../../constants/color';
import axios from 'axios';
import messaging, {firebase} from '@react-native-firebase/messaging';

import {arabicToEnglish, baseUrl, OTP_URL} from '../../constants/data';
import HeaderLogo from '../../components/HeaderLogo';
import {loginData} from '../../redux/reducer/Auth';
import CustomDropDown from '../../components/CustomDropDown';
import Text from '../../components/CustomText';
import {showMessage} from 'react-native-flash-message';
import {fonts} from '../../constants/fonts';
import {loginPhoneNo, otpVerification} from '../../services/UserServices';
import CustomButton from '../../components/CustomButton';

const CELL_COUNT = 4;
const Login = ({navigation, route}) => {
  const {isOrderDetail} = route?.params || {};

  const dispatch = useDispatch();
  const {t} = useTranslation();

  const countries_ar = [
    {
      label: 'الكويت',
      id: 1,
      code: '+965',
    },
    {
      label: 'المملكة العربية السعودية',
      id: 2,
      code: '+966',
    },
    {
      label: 'الإمارات العربية المتحدة',
      id: 3,
      code: '+971',
    },
    {
      label: 'البحرين',
      id: 4,
      code: '+973',
    },
    {
      label: 'قطر',
      id: 5,
      code: '+974',
    },
    {
      label: 'عمان',
      id: 6,
      code: '+968',
    },
  ];

  const countries_en = [
    {
      label: t('Kuwait'),
      id: 1,
      code: '+965',
    },
    {
      label: t('Saudi Arabia'),
      id: 2,
      code: '+966',
    },
    {
      label: t('United Arab Emirates'),
      id: 3,
      code: '+971',
    },
    {
      label: t('Bahrain'),
      id: 4,
      code: '+973',
    },
    {
      label: t('Qatar'),
      id: 5,
      code: '+974',
    },
    {
      label: t('Oman'),
      id: 6,
      code: '+968',
    },
  ];

  const [getTextReSend, setTextReSend] = useState();
  const [phoneNo, setPhoneNo] = useState('');
  const [country, setCountry] = useState(
    I18nManager.isRTL ? countries_ar[0]?.label : countries_en[0]?.label,
  );
  const [countryCodes, setCountryCodes] = useState('+965');

  const [value, setValue] = useState('');
  const [FCNToken, setFCNToken] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [isShowOtp, setIsShowOtp] = useState(false);

  const pushNotification = async () => {
    let fcmToken = await messaging().getToken();

    if (fcmToken) {
      console.log('=====tokeb adas', fcmToken);
      setFCNToken(fcmToken);
    }
  };

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    pushNotification();
  }, []);

  const backLogin = () => {
    setIsShowOtp(false);
  };

  useEffect(() => {
    const selectedCountry = countries_en.find(item => item.label === country);

    if (selectedCountry) {
      setCountryCodes(selectedCountry.code);
    } else {
      setCountryCodes(''); // Optional fallback
    }
  }, [country]);

  let updatedPhoneNumber = phoneNo[0] === '0' ? phoneNo?.slice(1) : phoneNo;
  updatedPhoneNumber = countryCodes + updatedPhoneNumber;

  const onPressContinue = async () => {
    try {
      if (!phoneNo) {
        showMessage({
          type: 'danger',
          message: t('PleaseEnterno'),
        });
        return;
      }

      if (phoneNo?.length < 8) {
        showMessage({
          type: 'warning',
          message: t('enterCorrectPhoneNumber'),
        });
        return;
      }

      setIsLoader(true);

      const response = await loginPhoneNo(updatedPhoneNumber);
      console.log('showmReponse', response);
      console.log('phoneNo==>>>', updatedPhoneNumber);
      if (response?.success) {
        setIsLoader(false);
        setIsShowOtp(true);
        showMessage({
          type: 'success',
          message: t('sendSuccess'),
          duration: 3000,
        });
      } else {
        setIsLoader(false);
        showMessage({
          type: 'danger',
          message: `Phone number is not correct`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoader(false);
    }
  };

  const resend = () => {
    onPressContinue();
  };

  const confirmOTP = async () => {
    if (!value) {
      showMessage({
        type: 'danger',
        message: t('pleaseEnterCode'),
        duration: 3000,
      });
      return;
    }
    setOtpLoader(true);
    try {
      const response = await otpVerification(updatedPhoneNumber, value);
      console.log('showmEReplonse', response);
      if (response?.success) {
        dispatch(
          loginData({
            token: FCNToken,
            userName: response?.data?.name,
            mobile: response?.data?.phone,
            userId: response?.data?.id,
            countryCode: countryCodes,
            country: country,
          }),
          navigation.replace('BottomNavigation'),
        );
      } else {
        showMessage({
          type: 'danger',
          message: t('WrongOtp'),
          duration: 3000,
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setOtpLoader(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Screen scrollable={true}>
        <View style={styles.headerContainer}>
          <HeaderLogo />
        </View>

        {!isShowOtp && <Text style={styles.subTitle}>{t('loginNumber')}</Text>}

        {isShowOtp ? (
          <KeyboardAvoidingView
            behavior="position"
            contentContainerStyle={{paddingBottom: 60}}>
            <View>
              {/* <Text>{'\u2066+965\u2069'}</Text> */}
              <Text style={styles.title}>{t('otp')}</Text>
              <Text style={styles.subTitle}>{t('enterDigits')}</Text>

              <Text style={styles.subTitle}>
                {'\u2066'}
                {countryCodes}
                {phoneNo && phoneNo[0] === '0' ? phoneNo.slice(1) : phoneNo}
                {'\u2069'}
              </Text>

              {/* <Text style={styles.subTitle}>
                            {phoneNo && phoneNo[0] === '0' ? `+965${phoneNo.slice(1)}` : `+965${phoneNo}`}
                        </Text> */}
              <View style={styles.innerContainer}>
                <CodeField
                  ref={ref}
                  autoFocus
                  {...props}
                  value={value}
                  onChangeText={text => {
                    const digitsOtp = arabicToEnglish(text);
                    setValue(digitsOtp);
                  }}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="phone-pad"
                  textContentType="oneTimeCode"
                  textInputStyle={{
                    textAlign: 'right',
                    writingDirection: 'ltr',
                    textDecorationLine: 'line-through',
                  }}
                  renderCell={({index, symbol, isFocused}) => (
                    <View
                      key={index}
                      style={[styles.cell, isFocused && styles.focusCell]}>
                      <Text
                        style={[styles.cellTxt]}
                        onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  )}
                />

                <TouchableOpacity
                  style={{
                    marginTop: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => resend()}>
                  <Text style={[styles.subTitle]}>{t('DidntRcvcode')} </Text>
                  <Text>{t('Resend')} </Text>
               {isLoader &&    <ActivityIndicator color={color.theme} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => backLogin()}>
                  <Text style={[styles.subTitle, {marginTop: 15}]}>
                    {t('backtoLogin')}
                  </Text>
                </TouchableOpacity>
                {/* 
                <TouchableOpacity
                  onPress={() => confirmOTP()}
                  style={styles.bottomPlaceOrderBox}>
                  <Text style={[styles.orderTxt, {textAlign: 'center'}]}>
                    {t('Verify')}
                  </Text>
                </TouchableOpacity> */}
                <CustomButton
                  onPress={() => confirmOTP()}
                  title={t('Verify')}
                  isLoader={otpLoader}
                  style={{marginTop: 30}}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View style={{}}>
            <View style={{marginTop: 20}}>
              <CustomDropDown
                data={I18nManager.isRTL ? countries_ar : countries_en}
                title={t('Country')}
                placeholder={t('Country')}
                setValue={setCountry}
                value={country}
              />

              <Text
                style={{
                  textAlign: 'left',
                  marginBottom: 10,
                  color: color.theme,
                  marginTop: 20,
                }}>
                {t('phoneNumber')}
              </Text>
              <View
                style={{
                  flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                  // justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                  paddingBottom: I18nManager.isRTL ? 0 : 10,
                  gap: 5,
                }}>
                <Text
                  style={{color: '#000'}}>{`\u2066${countryCodes}\u2069`}</Text>
                <TextInput
                  placeholder={t('phoneNumber')}
                  value={phoneNo}
                  keyboardType="number-pad"
                  onChangeText={text => {
                    const phoneNoDigits = arabicToEnglish(text);
                    setPhoneNo(phoneNoDigits);
                  }}
                  autoCorrect={false}
                  maxLength={10}
                  style={{
                    color: '#000',
                    fontFamily: fonts.regular,
                    width: '90%',
                    textAlign: 'left',
                  }}
                  placeholderTextColor={'#cecece'}
                />
              </View>
            </View>

            {/* <TouchableOpacity onPress={() => onPressSend()} style={styles.bottomPlaceOrderBox}> */}
            {/* <TouchableOpacity onPress={() => onPressContinue()} style={styles.bottomPlaceOrderBox}>
                            <Text style={[styles.orderTxt, { textAlign: 'center' }]}>{t("send")}</Text>
                        </TouchableOpacity> */}

            <CustomButton
              title={t('Send')}
              isLoader={isLoader}
              style={{marginTop: 30}}
              onPress={() => onPressContinue()}
            />
          </View>
        )}
      </Screen>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 40 : 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 120,
    color: '#000',
  },
  bottomPlaceOrderBox: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: color.theme,
    borderRadius: 50,
    marginTop: 40,
  },
  subTitle: {
    fontSize: 13,
    color: 'grey',
    textAlign: 'center',
  },
  innerContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  phoneTxt: {
    color: 'grey',
    fontFamily: 'OpenSans-Medium',
    paddingLeft: 10,
  },
  con: {
    borderRadius: 10,
    paddingHorizontal: 5,
    shadowColor: '#00000090',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.58,
    shadowRadius: 3,
    backgroundColor: '#fff',
    elevation: 24,
    marginVertical: 15,
    marginBottom: 30,
    width: '92%',
    alignSelf: 'center',
  },
  textInput: {
    width: '80%',
    color: '#000',
  },

  orderTxt: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },

  codeFieldRoot: {
    marginBottom: 30,
    width: '85%',
    alignSelf: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  cell: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.29,
    shadowRadius: 3,
    backgroundColor: '#fff',
    elevation: 7,
  },
  cellTxt: {
    fontSize: 25,
    color: '#000',
    top: I18nManager.isRTL ? -4 : -3,
  },
  focusCell: {
    borderWidth: 1,
    borderColor: '#fff',
  },
});
