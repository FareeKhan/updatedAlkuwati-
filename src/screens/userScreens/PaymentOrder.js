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
import { fonts } from '../../constants/fonts';
import MyFatoorahPayment from '../../components/MyFatoorahPayment';
const PaymentOrder = ({ navigation, route }) => {
  const { subTotal, delCharges, discount, FinalTotal } = route?.params

  const dispatch = useDispatch();
  const data = useSelector(state => state.cartProducts?.cartProducts);
  const userId = useSelector(state => state.auth?.userId);
  const reduxAddress = useSelector((item) => item?.customerAddress?.storeAddress)
  const { totalPrice } = useSelector(state => state.cartProducts);
  console.log('datadatadata',data)

  const refRBSheet = useRef(null);
  const { t } = useTranslation();

  const getSummaryAmount = totalPrice;

  const [modalVisible, setModalVisible] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [cardInfo, setCardInfo] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [getToken, setToken] = useState({});
  const [address, setAddress] = useState({});
  const [paymentStatus, setPaymentStatus] = useState();
  const [email, setEmail] = useState();
  const [cashLoader, setCashLoader] = useState(false); 0
  const [isCardPaymentModal, setIsCardPaymentModal] = useState(false);

  const userAddress = useSelector(
    state => state?.customerAddress?.storeAddress,
  );

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
        setAddress(response?.data);
      } else {
        alert('something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };



  const paymentPress = payment => {
    setSelectedPayment(payment);
    if (payment == 1) {
      // setModalVisible(true)
      // refRBSheet.current?.open();
      setIsCardPaymentModal(true)
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
        data,
        email,
        getuserId,
        getToken,
        subTotal, delCharges, discount,
        FinalTotal,

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
      const response = await tokenPrice(getToken?.token, FinalTotal);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if(address?.length == 0){
  //   handlePress()
  //   console.log('=-=--=-=')
  //   }
  // }, [])

  const handlePress = async () => {
    const response = await addShippingAddress(reduxAddress, userId)
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
          {paymentMethodCard(t)?.map((item, index) => {

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => paymentPress(item?.id)}
                key={index}
                style={styles.paymentContainers}>
                <View
                  style={{
                    backgroundColor:
                      selectedPayment == item?.id ? color.theme : '#fff',
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
                <Text style={{ color: '#000', fontFamily: fonts.bold, color: color.theme }}>
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
          <Text style={styles.bottomPrice}>KD{FinalTotal}</Text>
        </View>


        {selectedPayment == 2 && (
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


      <MyFatoorahPayment
        setModalVisible={setIsCardPaymentModal}
        modalVisible={isCardPaymentModal}
        confirmOrder={confirmOrder}
        totalPrice={Number(FinalTotal)}

      />

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
