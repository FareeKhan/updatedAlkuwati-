import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  I18nManager,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ExportSvg from '../constants/ExportSvg';
import {color} from '../constants/color';
import {useDispatch, useSelector} from 'react-redux';
import {productFavorite, removeFavorite} from '../redux/reducer/AddFavorite';
import * as Animatable from 'react-native-animatable';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {addProductToCart} from '../redux/reducer/ProductAddToCart';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Text from './CustomText';
import {useTranslation} from 'react-i18next';
import {productDetails} from '../services/UserServices';
import LottieView from 'lottie-react-native';
const {width} = Dimensions.get('screen');
import FastImage from 'react-native-fast-image';
import {fonts} from '../constants/fonts';
import {showMessage} from 'react-native-flash-message';

const SingleProductCard = ({
  item,
  index,
  isDot = true,
  onPress,
  countList = 1,
  isShowPlusIcon,
  setModalVisible,
  isPreloaded = false,
}) => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth?.userId);
  const data = useSelector(state => state.cartProducts?.cartProducts);
  const favoriteList = useSelector(state => state?.favorite?.AddInFavorite);

  const navigation = useNavigation();
  const [loading, setLoading] = useState(!isPreloaded);
  const [isCartLoader, setIsCartLaoder] = useState(false);
  const [isStockLoader, setIsStockLoader] = useState(false);
  const [isCheckStockIsAvaialable, setIsCheckStockIsAvailable] =
    useState(false);

  const isCheck = data?.some(value => value?.id == item?.id);

  const isFavorite = favoriteList.some(favorite => favorite.id === item.id);

  const animation = 'fadeInUp';
  const durationInner = 1000;
  const delayInner = 100;

  const {t} = useTranslation();

  const favoriteProduct = item => {
    if (userId) {
      if (isFavorite) {
        dispatch(
          removeFavorite({
            id: item?.id,
          }),
        );
        ReactNativeHapticFeedback.trigger('impactLight');
      } else {
        ReactNativeHapticFeedback.trigger('notificationError');
        dispatch(productFavorite(item));
      }
    }else{
      showMessage({
        type:"warning",
        message:t('loginFavorite')
      })
    }
  };

  const [cartCount, setCartCount] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(new Animated.Value(1)).current;

  const startX = 150;
  const startY = 500;

  const endX = -150;
  const endY = 50;

  useEffect(() => {
    checkStock();
  }, []);

  useEffect(() => {
    if (isPreloaded && item.image) {
      setLoading(false);
    }
  }, [isPreloaded, item.image]);

  const checkStock = async () => {
    setIsStockLoader(true);
    try {
      const response = await productDetails(item?.id);
      if (response?.status) {
        const isOutOfStock =
          response?.variant_system?.has_variants &&
          response?.variant_system?.optimized_variants?.every(
            variant => variant.stock_quantity === 0,
          );
        const availableVariant =
          response?.variant_system?.optimized_variants?.find(
            variant => variant?.stock_quantity > 0,
          );
        const isCheckQuantity =
          response?.data?.quantity == 0 ||
          isOutOfStock ||
          (availableVariant && availableVariant?.stock_quantity == 0) ||
          availableVariant == undefined;
        setIsCheckStockIsAvailable(isCheckQuantity);
      }
    } catch (error) {
      setIsStockLoader(false);
    } finally {
      setIsStockLoader(false);
    }
  };

  const getProductDetail = async item => {
    console.log('ss', item?.id);
    setIsCartLaoder(true);
    try {
      const response = await productDetails(item?.id);
      if (response?.status) {
        if (response?.data?.quantity > 0) {
          console.log(
            'Object.keys(response?.variant_system?.available_attributes || {}).length > 0',
            Object.keys(response?.variant_system?.available_attributes || {})
              .length > 0,
          );
          if (
            Object.keys(response?.variant_system?.available_attributes || {})
              .length > 0
          ) {
            navigation.navigate('ProductDetails', {id: item?.id});
          } else {
            addToCart(response?.data?.variants[0]?.id);
          }
        } else {
          showMessage({
            type: 'danger',
            message: t('outOfStocks'),
          });
        }
      } else {
      }
    } catch (error) {
      setIsCartLaoder(false);
    } finally {
      setIsCartLaoder(false);
    }
  };

  const addToCart = var_id => {
    if (isCheck) {
      showMessage({
        type: 'warning',
        message: t('alreadyAdded'),
      });
    } else {
      animatedValue.setValue(0);
      shadowOpacity.setValue(1);

      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        dispatch(
          addProductToCart({
            id: item?.id,
            varID: var_id,
            productName: item?.name,
            price: item?.price,
            productWeight: item?.weight ? item?.weight : '00000',
            size: 'M',
            counter: 1,
            subText: removeHTMLCode(item?.description),
            image: item?.image,
            odo_id: item?.odoo_id,
          }),
        );

        showMessage({
          type: 'success',
          message: t('productAdded'),
        });
        ReactNativeHapticFeedback.trigger('impactLight');
        Animated.timing(shadowOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, endX],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 0.5],
    outputRange: [startY, endY],
  });

  const removeHTMLCode = value => {
    if (value) {
      const regex = /(<([^>]+)>)/gi;
      const val = value.replace(regex, '');
      const string = val.replace(
        /&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi,
        '',
      );
      return string;
    }
    return '';
  };

  return (
    <Animatable.View
      animation={animation}
      duration={durationInner}
      delay={countList * delayInner}>
      {loading && (
        <View
          style={{
            borderWidth: 1,
            marginBottom: 10,
            borderColor: '#cecece',
            width: 170,
            height: 170,
            marginRight: 5,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            position: 'absolute',
            zIndex: 100,
          }}>
          <LottieView
            source={require('../assets/loader.json')} // Local JSON file
            autoPlay
            loop
            style={{width: 100, height: 100, color: 'red'}}
          />
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{alignItems: 'center', marginBottom: 15}}>
        <FastImage
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          source={{
            uri: item.image,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{width: 170, height: 170, marginRight: 5, borderRadius: 20}}
          borderRadius={20}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            {isShowPlusIcon && (
              <TouchableOpacity
                disabled={isCheckStockIsAvaialable}
                onPress={() => getProductDetail(item)}
                style={{}}>
                {isCartLoader || isStockLoader ? (
                  <ActivityIndicator size={'small'} color={color.theme} />
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3,
                    }}>
                    <AntDesign
                      name="pluscircle"
                      size={20}
                      color={isCheckStockIsAvaialable ? '#cecece90' : '#67300f'}
                      style={{marginBottom: 0}}
                    />
                    {isCheckStockIsAvaialable && (
                      <View
                        style={{
                          paddingHorizontal: 5,
                          backgroundColor: '#cecece90',
                          borderRadius: 5,
                        }}>
                        <Text style={{fontSize: I18nManager.isRTL ? 12 : 13}}>
                          {t('outOfStock')}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => favoriteProduct(item)} style={{}}>
              {isFavorite ? <ExportSvg.Favorite /> : <ExportSvg.whiteFav />}
            </TouchableOpacity>
          </View>
        </FastImage>

        {isDot && (
          <Animated.View
            style={[
              styles.shadow,
              {transform: [{translateX}, {translateY}], opacity: shadowOpacity},
            ]}
          />
        )}

        <View style={{width: width / 2.5}}>
          <Text numberOfLines={1} style={styles.arrivalTitle}>
            {item?.name || item?.productName}
          </Text>
          <Text numberOfLines={1} style={styles.arrivalSubTitle}>
            {removeHTMLCode(item?.description).length > 30
              ? `${removeHTMLCode(item?.description).slice(0, 30)}...`
              : removeHTMLCode(item?.description)}
          </Text>
          <Text style={styles.arrivalPrice}>KD{item?.price}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default SingleProductCard;

const styles = StyleSheet.create({
  arrivalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: color.theme,
    marginTop: 5,
    textAlign: 'left',
  },
  arrivalSubTitle: {
    color: color.gray,
    // fontWeight: "300",
    marginVertical: 2,
    fontSize: 12,
    textAlign: 'left',
  },
  arrivalPrice: {
    color: color.theme,
    // fontWeight: "500",
    textAlign: 'left',
    fontFamily: fonts.bold,
  },

  shadow: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: color.theme,
    borderRadius: 10,
  },
});
