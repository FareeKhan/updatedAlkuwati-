import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  I18nManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  Linking,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ExportSvg from '../../constants/ExportSvg';
import { color } from '../../constants/color';
import { paymentMethodCard } from '../../constants/data';
import PaymentModal from '../../components/PaymentModal';
import {
  addShippingAddress,
  orderConfirmed,
  tokenPrice,
  userShippingAddress,
} from '../../services/UserServices';
import { useDispatch, useSelector } from 'react-redux';
import PaymentSuccessModal from '../../components/PaymentSuccessModal';
import {
  addProductToCart,
  clearCart,
} from '../../redux/reducer/ProductAddToCart';
import HeaderLogo from '../../components/HeaderLogo';
import { personalData } from '../../services/UserServices';
import RBSheet from '@poki_san/react-native-bottom-sheet';
import MFPaymentCyber from '../../FatoorahPayment/MFPaymentCyber';
import CustomButton from '../../components/CustomButton';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseUrl } from '../../constants/data';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomLoader from '../../components/CustomLoader';
import { storeUserAddress } from '../../redux/reducer/UserShippingAddress';
const PaymentOrder = ({ navigation, route }) => {
  //const { totalPrice } = route?.params
  const dispatch = useDispatch();
  const data = useSelector(state => state.cartProducts?.cartProducts);
  const userId = useSelector(state => state.auth?.userId);
  const reduxAddress = useSelector((item) => item?.customerAddress?.storeAddress)
  const { totalPrice } = useSelector(state => state.cartProducts);

  const refRBSheet = useRef(null);
  const { t } = useTranslation();

  const getSummaryAmount = totalPrice;

  const [modalVisible, setModalVisible] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [cardInfo, setCardInfo] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);
  const [getToken, setToken] = useState({});
  const [address, setAddress] = useState({});
  const [paymentStatus, setPaymentStatus] = useState();
  const [email, setEmail] = useState();
  const [cashLoader, setCashLoader] = useState(false);
  const userAddress = useSelector(
    state => state?.customerAddress?.storeAddress,
  );
  const onChangeSomeState = newSomeState => {
    setPaymentStatus(newSomeState);
  };
  const [SupportURL, setSupportURL] = useState();

  const profileData = async () => {
    try {
      const response = await personalData(userId);
      if (response?.status) {
        setSupportURL(response?.supporturl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getuser_details = async () => {
    const url = `${baseUrl}/getAppUsersById/${userId}`;

    let config = {
      method: 'get',
      url: url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0L21yLXRhYmxlLWFwaS8iLCJpYXQiOjE3MDIzMTUxMjYsImV4cCI6MTcwNDkwNzEyNiwiZGF0YSI6IjcifQ.Ai3W5TsMnGi7H0amVTL0wW8O1ACB6olOMy08dHj-yew',
      },
    };

    axios
      .request(config)
      .then(response => {
        if (response.data) {
          setEmail(response.data.data.email);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getShippingAddress();
    getuser_details();
    profileData();
  }, []);

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
    if (getToken?.token !== undefined) {
      confirmOrder(getToken?.token);
      sendTokenPrice();
    }
  }, [getToken]);

  const PlaceOrder = () => {
    confirmOrder('cash');
  };

  useEffect(() => {
    if (paymentStatus == 'Paid') {
      refRBSheet.current?.close();
      confirmOrder('card');
      //orderDataSubmit(ShipAddress[0]);
    }
  }, [paymentStatus]);

  const getShippingAddress = async () => {
    try {
      const response = await userShippingAddress(userId);
      if (response) {
        setAddress(response?.data?.[response?.data?.length - 1]);
      } else {
        alert('something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sharePress = async (name, price) => {
    try {
      const result = await Share.share({
        message: 'Check out this awesome product! ' + name + ' Price:' + price,
      });

      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully!');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing content:', error.message);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.productContainer}>
        <Image
          borderRadius={5}
          source={{ uri: item?.image }}
          style={{ width: 60, height: 60 }}
        />

        <View style={{ marginLeft: 10 }}>
          <Text style={styles.productTitle}>{item?.productName}</Text>
          <Text style={styles.subTitle}>{item?.subText}</Text>
          <TouchableOpacity
            onPress={() => sharePress(item?.productName, item?.price)}>
            <View style={styles.sendWithIcon}>
              <ExportSvg.ArrowCurve />
              <Text style={styles.sendTxt}>{t('send')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.productPrice}>KD{item?.price}</Text>
      </View>
    );
  };

  const paymentPress = payment => {
    setSelectedPayment(payment);
    if (payment == 'credit card') {
      // setModalVisible(true)
      refRBSheet.current?.open();
    }
  };

  const confirmOrder = async param => {
    const getToken = selectedPayment;
    const productNo = data?.length;
    setCashLoader(true)
    try {
      //selectedPayment

      //console.log(email, "PPPOPOP");
      //console.log(userAddress, "PPP");

      const getuserId = userId ? userId : 0;

      const response = await orderConfirmed(
        productNo,
        userAddress,
        totalPrice,
        data,
        email,
        getuserId,
        getToken,
      );

      if (response.status == 'success') {
        setModalVisible(false);
        setIsLoading(false);
        setIsPaymentSuccess(true);
        dispatch(clearCart([]));
      } else {
        setIsLoading(false);
        alert('Somthing went wrong');
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setCashLoader(false)
    }
  };

  const sendTokenPrice = async () => {
    try {
      const response = await tokenPrice(getToken?.token, totalPrice);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlePress()
  }, [])

  const handlePress = async () => {
    const response = await addShippingAddress(reduxAddress, userId)
    console.log('charsss',response)
    try {
      if (response?.data) {
        dispatch(
          storeUserAddress({
            ...reduxAddress,
            addressId: response.data.id,
          }),
        );

      }
    } catch (error) {
      console.log('naswaar', error)
    }
  }




  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: Platform.OS == 'ios' ? 40 : 20,
        }}>
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
          <HeaderLogo />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.productName]}>{t('payment')}</Text>
        </View>
        <View>
          {paymentMethodCard?.map((item, index) => {
            const payment = item?.paymentName?.toLowerCase();
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => paymentPress(payment)}
                key={index}
                style={styles.paymentContainers}>
                <View
                  style={{
                    backgroundColor:
                      selectedPayment == payment ? color.theme : '#fff',
                    width: 18,
                    height: 18,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: color.theme,
                  }}>
                  <ExportSvg.checks />
                </View>
                <View style={{ marginHorizontal: 20 }}>{item?.svg}</View>
                <Text style={{ color: '#000', fontFamily: 'Montserrat-Medium' }}>
                  {item?.paymentName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>


        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
          <Text style={{ fontSize: 15, color: '#AAA' }}>
            {t('total_price')}
          </Text>
          <Text style={styles.bottomPrice}>KD{totalPrice}</Text>
        </View>

        {/* <PaymentModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          cardInfo={cardInfo}
          setCardInfo={setCardInfo}
          setToken={setToken}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        /> */}

        {/* <TouchableOpacity style={styles.addCardBox} onPress={() => navigation.navigate('TrackOrder')}> */}
        {/* <TouchableOpacity style={styles.addCardBox} onPress={() => confirmOrder()}> */}
        {/* <TouchableOpacity style={styles.addCardBox}>
                    <View style={styles.addCardPlusBox}>
                        <Text style={styles.plusIcon}>+</Text>
                    </View>
                    <Text style={styles.paymentTxt}>Add Card</Text>
                </TouchableOpacity> */}

        {/* <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.productName, { marginVertical: 20 }]}>{t("history")}</Text>
                </View>
                <View style={{ marginBottom: 10, marginTop: -10, flex: 1, zIndex: -1 }}>
                    <FlatList
                        // data={bags?.slice(1)}
                        data={data}
                        keyExtractor={(item, index) => index?.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                </View> */}

        {selectedPayment == 'cash' && (
          cashLoader ?
            <View style={{ marginTop: 25 }}>
              <CustomLoader />
            </View>

            :
            <CustomButton
              onPress={() => PlaceOrder()}
              style={{ marginTop: 25 }}
              title={t('place_order')}
            />
        )}
        <PaymentSuccessModal
          isPaymentSuccess={isPaymentSuccess}
          setIsPaymentSuccess={setIsPaymentSuccess}
          navigation={navigation}
        />
      </ScrollView>

      <RBSheet
        ref={refRBSheet}
        onClose={() => setSelectedPayment('')}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={650}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: 'grey',
          },
          container: {
            backgroundColor: '#eee',
            borderRadius: 30,
            elevation: 6,
            shadowColor: 'grey',
            shadowOpacity: 0.5,
            shadowOffset: 6,
          },
        }}>
        <View>
          <TouchableOpacity onPress={() => OpenURLButton(SupportURL)}>
            <Text
              style={{
                marginVertical: 5,
                flexDirection: 'row',
                zIndex: 8888,
                textAlign: 'left',
                paddingHorizontal: 15,
              }}>
              <MaterialIcons
                name={'support-agent'}
                size={25}
                color={'#67300f'}
                styles={{}}
              />
            </Text>
          </TouchableOpacity>
          <View>
            <Text
              style={{
                color: '#000',
                fontSize: 22,
                marginBottom: 10,
                fontFamily: I18nManager.isRTL
                  ? 'Cairo-Regular'
                  : 'Metrophobic-Regular',
                textAlign: 'center',
              }}>
              {t('payment')}
            </Text>
          </View>

          <View
            style={{ flexGrow: 1, flexDirection: 'row', marginHorizontal: 10 }}>
            <MFPaymentCyber
              totalAmount={parseFloat(getSummaryAmount).toFixed(2)}
              onChangeSomeState={onChangeSomeState}
            />
          </View>
        </View>
      </RBSheet>

      {/* <View
        style={{
        //   position: 'absolute',
        //   bottom: 50,
        //   backgroundColor: 'white',
        // //   flex: 1,
        //   width: '100%',
        //   paddingHorizontal: 20,
        //   paddingVertical: 20,
        //   marginVertical: 30,
        }}>
        <View style={styles.bottomContent}>
          <View>
            <Text style={{fontSize: 10, color: '#AAA', textAlign: 'left'}}>
              {t('total_price')}
            </Text>
            <Text style={styles.bottomPrice}>KD{totalPrice}</Text>
          </View>
        </View>
      </View> */}
    </View>
  );
};

export default PaymentOrder;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 15,
    position: 'relative',
  },
  bottomContent: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat-Bold',
    color: color.theme,
    textAlign: 'right',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
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
    zIndex: -1,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    elevation: 5,
    padding: 10,
    borderRadius: 13,
    marginTop: 15,
  },
  paymentIconBg: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    borderRadius: 50,
  },

  paymentTxt: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    marginLeft: 15,
    color: color.theme,
  },
  addCardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 60,
    marginTop: 30,
    borderStyle: 'dashed',
    borderColor: '#DDD',
    borderRadius: 13,
    zIndex: -1,
  },
  addCardPlusBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#DDD',
  },
  plusIcon: {
    color: color.theme,
    fontSize: 18,
  },

  productContainer: {
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: '#fff',
    elevation: 2,
    marginHorizontal: 1,
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  productTitle: {
    fontWeight: '600',
    color: color.theme,
    marginBottom: 0,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'left',
  },
  subTitle: {
    color: color.gray,
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 5,
  },
  productPrice: {
    marginTop: 4,
    fontWeight: '600',
    color: color.theme,
    marginLeft: 'auto',
    fontFamily: 'Montserrat-Bold',
  },
  sendWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEE',
    alignSelf: 'baseline',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  sendTxt: {
    marginLeft: 5,
    color: color.theme,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 9,
  },
  paymentContainers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
});
