import {
  Alert,
  FlatList,
  I18nManager,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import ScreenView from '../../components/ScreenView';
import HeaderBox from '../../components/HeaderBox';
import CustomText from '../../components/CustomText';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {color} from '../../constants/color';
import {
  deleteAddress,
  editAddress,
  userShippingAddress,
} from '../../services/UserServices';
import {storeUserAddress} from '../../redux/reducer/UserShippingAddress';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
import ScreenLoader from '../../components/ScreenLoader';
import {useFocusEffect} from '@react-navigation/native';
import EmptyScreen from '../../components/EmptyScreen';
import Feather from 'react-native-vector-icons/Feather';
import CustomButton from '../../components/CustomButton';

const SavedAddresses = ({navigation, route}) => {
  const {t} = useTranslation();
  const {isAdd} = route?.params || {};
  const userId = useSelector(state => state.auth?.userId);
  const userAddress = useSelector(
    state => state?.customerAddress?.storeAddress,
  );
  console.log('sss', Object?.keys(userAddress)?.length);
  const addressId = isAdd ? '' : userAddress?.addressId;
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);
  const [selectedItem, setSelectedItem] = useState(addressId);

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getShippingAddress(true);
    }, [userId]),
  );
  console.log('====', userAddress);

  const getShippingAddress = async value => {
    setLoader(value);
    try {
      const response = await userShippingAddress(userId);
      console.log('responseresponse', response);
      if (response?.data?.length > 0) {
        setData(response?.data);
        setLoader(false);
      } else {
        setData([]);
        dispatch(storeUserAddress({}));
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      alert(error);
    } finally {
      setLoader(false);
    }
  };



  const handleAddress = item => {
    setSelectedItem(item?.id);
    console.log('hellot testing address', item);
    const addressredux = {
      house: item?.house,
      city: item?.city,
      street: item?.street,
      avenuePostal: item?.emirates,
      fullName: item?.full_name,
      governorate: item?.governorate,
      phone: item?.phone,
      country: item?.country,
      addressId: item?.id,
    };
    dispatch(storeUserAddress(addressredux));
    navigation.goBack();
  };

  const deleteAlert = id => {
    const title = I18nManager.isRTL
      ? `\u200F${t('deleteTitle')}`
      : t('deleteTitle');
    Alert.alert('', t('sureDelete'), [
      {
        text: t('cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: t('ok'), onPress: () => handleDelete(id)},
    ]);
  };

  const handleDelete = async id => {
    try {
      const response = await deleteAddress(id);
      console.log('showmeRepsonse', response);
      if (response?.data == 'deleted') {
        getShippingAddress(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleEdit = async id => {
    navigation.navigate('ShippingAddress', {
      id: id,
      isEdit: true,
    });
  };

  const AddressLine = ({label, value}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        // height: 10,
      }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>: </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const renderItem = ({item, index}) => {
    return (
      // <Swipeable renderRightActions={() => rightSwipe(item?.id)}>
      <TouchableOpacity
        onPress={() => handleAddress(item)}
        style={[
          styles.userAddressBox,
          selectedItem == item?.id && {borderColor: color.theme},
        ]}>
        <View>
          <AddressLine label={t('house')} value={item?.house} />
          <AddressLine label={t('city')} value={item?.city} />
          <AddressLine label={t('street')} value={item?.street} />

          {item?.country == t('Kuwait') ? (
            <>
              {item?.emirates && (
                <AddressLine label={t('avenues')} value={item?.emirates} />
              )}
              <AddressLine label={t('governorate')} value={item?.governorate} />
            </>
          ) : (
            <>
              {item?.emirates && (
                <AddressLine label={t('postalCoder')} value={item?.emirates} />
              )}
            </>
          )}

          <AddressLine
            label={t('phoneNumber')}
            value={`\u2066${item?.phone}\u2069`}
          />
          <AddressLine label={t('Country')} value={item?.country} />
        </View>

        <View>
          <TouchableOpacity
            onPress={() => handleEdit(item?.id)}
            style={{
              alignSelf: 'flex-start',
              paddingVertical: 10,
              paddingHorizontal: 15,
            }}>
            <Feather name={'edit'} size={18} color={'green'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteAlert(item?.id)}
            style={{
              alignSelf: 'flex-start',
              paddingVertical: 10,
              paddingHorizontal: 15,
            }}>
            <Ionicons name={'trash'} size={20} color={'red'} />
          </TouchableOpacity>
        </View>
        {/* {
                    selectedItem == item?.id &&
                    <Ionicons name={'checkmark-circle'} color={color.theme} size={20} />
                } */}
      </TouchableOpacity>
      // </Swipeable>
    );
  };

  if (loader) {
    return <ScreenLoader />;
  }

  return (
    <ScreenView>
      <HeaderBox
        style={[{width: '60%'}, Platform.OS == 'ios' && {marginTop: 30}]}
      />

      {/* {
                isAdd &&
                <TouchableOpacity style={{ borderWidth: 1, alignSelf: "baseline", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 5, borderColor: "#cecece" }} onPress={() => navigation.navigate('ShippingAddress', {
                    isMap: true
                })}>
                    <CustomText style={{ fontSize: 16, fontWeight: "600", color: color.theme, textAlign: "left" }}>+ {t('addNew')}</CustomText>
                </TouchableOpacity>
            } */}

      <TouchableOpacity
        style={{
          borderWidth: 1,
          alignSelf: 'baseline',
          paddingHorizontal: 10,
          paddingVertical: 2,
          borderRadius: 5,
          borderColor: '#cecece',
        }}
        onPress={() =>
          navigation.navigate('ShippingAddress', {
            isMap: true,
          })
        }>
        <CustomText
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: color.theme,
            textAlign: 'left',
          }}>
          + {t('addNew')}
        </CustomText>
      </TouchableOpacity>

      <View style={{flex: 1, marginTop: 30}}>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index?.toString()}
          style={{flexGrow: 1}}
          ListEmptyComponent={<EmptyScreen text={t('noAddress')} />}
          ItemSeparatorComponent={<View style={{marginBottom: 20}} />}
          contentContainerStyle={{paddingBottom: 40}}
          renderItem={renderItem}
        />
      </View>
      {data?.length > 0 && (
        <CustomButton
          title={t('continue')}
          style={{marginBottom: 20}}
          onPress={() => navigation.goBack()}
        />
      )}
    </ScreenView>
  );
};

export default SavedAddresses;

const styles = StyleSheet.create({
  swipeText: {
    color: '#000',
  },
  editButton: {
    backgroundColor: '#fff',
    height: '87%',
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#fff',
    // height: "87.5%",
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#00000020',
  },
  rightSwipeContainer: {
    flexDirection: 'row',
  },
  userAddressBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    // elevation: 5,
    borderWidth: 1,
    borderColor: '#00000020',

    paddingVertical: 10,
    // paddingHorizontal: 20,
    paddingLeft: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: 15
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    color: color.theme,
    textAlign: 'left',
    marginRight: 2,
  },
  value: {
    color: color.grayShade,
    fontWeight: '400',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'left',
  },
});
