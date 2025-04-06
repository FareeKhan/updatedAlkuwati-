import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { color } from '../../constants/color';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {

  personalData,
  updateProfile,

} from '../../services/UserServices';
import CustomLoader from '../../components/CustomLoader';
import { useDispatch, useSelector } from 'react-redux';

import ScreenLoader from '../../components/ScreenLoader';
import HeaderLogo from '../../components/HeaderLogo';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserDetails = ({ navigation, route }) => {
  const { btnText } = route.params ?? '';

  const userId = useSelector(state => state.auth?.userId);
  const userAddress = useSelector((state) => state?.customerAddress?.storeAddress)

  console.log(';userAddress',userAddress)
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState();
  const [btnLoader, setBtnLoader] = useState(false);


  const [loader, setLoader] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
  
    getUserDetail()
  }, []);


  const handlePress = () => {
    profileUpdate()
  };

  const getUserDetail = async () => {
    setLoading(true)
    try {
      const response = await personalData(userId)
      console.log('Object',response)
      console.log('Object',response)
      if (response?.status) {
        setFullName(response?.data?.name)
        setPhoneNumber(response?.data?.phone_number !== null ? response?.data?.phone_number : response?.data?.phone)
        setEmail(response?.data?.email)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }



  const profileUpdate = async () => {
    setBtnLoader(true)
    const data = {
      id: userId,
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email
    }
    try {
      const response = await updateProfile(data)
      console.log('response',response)
      if (response?.status) {
        alert(t('updated'));
      }else{
        alert(t('someThingWentWrong'));
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setBtnLoader(false)
    }
  }



  if (isLoading) {
    return <ScreenLoader />;
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            size={40}
            name={
              I18nManager.isRTL
                ? 'chevron-forward-circle'
                : 'chevron-back-circle'
            }
            color={color.theme}
          />
        </TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15,
          }}>
          {btnText !== undefined && <HeaderLogo style={{}} />}
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.productName]}>{t('user_details')}</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>
          <CustomInput
            placeholder={t('typename')}
            title={t('fName')}
            style={{ marginTop: 20 }}
            value={fullName}
            onChangeText={setFullName}
          />

          {/* <CustomInput
            placeholder={t('typePhoneNumber')}
            title={t('phoneNumber')}
            style={{ marginTop: 20 }}
            value={phoneNumber}
            autoCorrect={false}
            keyboardType="number-pad"
            onChangeText={setPhoneNumber}
          />

          <CustomInput
            placeholder={t('emailTxt')}
            title={t('emailTxt')}
            style={{ marginTop: 20 }}
            value={email}
            autoCorrect={false}
            onChangeText={setEmail}
          /> */}

          <View style={{ marginBottom: 100, marginTop: 50 }}>
            {btnLoader ? (
              <CustomLoader />
            ) : (
              <CustomButton
                title={btnText !== undefined ? btnText : 'save'}
                onPress={handlePress}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 40 : 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '70%',
  },

  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: color.theme,
    fontFamily: 'Montserrat-Bold',
  },
});
