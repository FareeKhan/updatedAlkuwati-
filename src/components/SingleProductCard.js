import { ActivityIndicator, Animated, Dimensions, Easing, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ExportSvg from '../constants/ExportSvg'
import { color } from '../constants/color'
import { useDispatch, useSelector } from 'react-redux'
import { productFavorite, removeFavorite } from '../redux/reducer/AddFavorite'
import * as Animatable from 'react-native-animatable';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { addProductToCart } from '../redux/reducer/ProductAddToCart'
import { useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomToast from './CustomToast'
import { useTranslation } from 'react-i18next'
import { productDetails } from '../services/UserServices'
import LottieView from 'lottie-react-native'
const { width } = Dimensions.get('screen')
import FastImage from 'react-native-fast-image'

const SingleProductCard = ({ item, index, onPress, countList = 1, isShowPlusIcon }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [isColor, setIsColor] = useState(false)
  const [isSize, setIsSize] = useState(false)
  const data = useSelector(state => state.cartProducts?.cartProducts);
  const favoriteList = useSelector((state) => state?.favorite?.AddInFavorite)

  const isCheck = data?.some((value) => value?.id == item?.pid)


  const isFavorite = favoriteList.some(favorite => favorite.pid === item.pid);

  const animation = 'fadeInUp';
  const durationInner = 1000;
  const delayInner = 100;

  const { t } = useTranslation()

  const favoriteProduct = (item) => {

    if (isFavorite) {
      dispatch(removeFavorite({
        id: item?.pid
      }))
      ReactNativeHapticFeedback.trigger('impactLight');
    } else {
      ReactNativeHapticFeedback.trigger('notificationError');
      dispatch(productFavorite({
        price: item?.price,
        pid: item?.pid,
        productName: item?.name,
        description: removeHTMLCode(item?.description),
        image: item?.image

      }))



    }
  }


  // new code 
  const [cartCount, setCartCount] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(new Animated.Value(1)).current;

  // Dynamic Start Position (Near the Button)
  const startX = 150; // X position of the button (in RTL, it's on the right)
  const startY = 500; // Y position of the button (bottom)

  // Destination Position (Cart Icon in RTL)
  const endX = -150; // Move to the left side (for RTL)
  const endY = 50; // Move to the top (cart position)



  // end of new code
  useEffect(() => {
    getProductDetail()
  }, [])

  const getProductDetail = async () => {

    try {
      const response = await productDetails(item?.pid);
      console.log(response?.color_variants, '[[[')
      if (response?.status) {
        setIsColor(response?.color_variants?.length > 0)
        setIsSize(response?.size_variants?.length > 0)
        // setProductData(response);
        // setProductObject(response?.data[0]);

      }
    } catch (error) {

      console.log(error);
    }
  };


  const addToCart = () => {

    // newcodeAddres

    if (isColor || isSize) {
      onPress()
    } else {
      if (isCheck) {
        // alert(t('alreadyAdded'))
        // CustomToast(t('alreadyAdded'), "danger")
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
              id: item?.pid,
              productName: item?.name,
              price: item?.price,
              size: 'M',
              counter: 1,
              subText: removeHTMLCode(item?.description),
              image: item?.image,
            }),
          );

          // CustomToast(t('productAdded'), "success")

          // navigation.navigate('MyCart');
          ReactNativeHapticFeedback.trigger('impactLight');
          Animated.timing(shadowOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      }

    }
    // end
    // dispatch(
    //   addProductToCart({
    //     id: item?.pid,
    //     productName: item?.name,
    //     price: item?.price,
    //     size: 'M',
    //     counter: 1,
    //     subText: removeHTMLCode(item?.description),
    //     image: item?.image,
    //   }),
    // );

    // navigation.navigate('MyCart');
    // ReactNativeHapticFeedback.trigger('impactLight');
  };


  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, endX], // Move from button to cart (RTL direction)
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 0.5],
    outputRange: [startY, endY], // Move from bottom to top
  });


  const removeHTMLCode = (value) => {
    if (value) {
      const regex = /(<([^>]+)>)/ig;
      const val = value.replace(regex, "");
      const string = val.replace(/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/ig, "");
      return string;
    }
    return "";
  }

  return (
    <Animatable.View
      animation={animation}
      duration={durationInner}
      delay={(countList) * delayInner}
    >

      {
        loading &&
        <View style={{ borderWidth: 1, marginBottom: 10, borderColor: "#cecece", width: 170, height: 170, marginRight: 5, alignItems: "center", justifyContent: "center", borderRadius: 20, position: "absolute", zIndex: 100 }} >
          <LottieView
            source={require("../assets/loader.json")} // Local JSON file
            autoPlay
            loop
            style={{ width: 100, height: 100,color:"red" }}
          />
        </View>
      }

      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{ alignItems: "center", marginBottom: 15 }}>

        <FastImage
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          // source={{ uri: item.image }}
          source={{ uri: item.image, priority: FastImage.priority.high }}
          style={{ width: 170, height: 170, marginRight: 5,borderRadius:20 }} borderRadius={20}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", margin: 10 }}>
            {
              isShowPlusIcon &&
              <TouchableOpacity onPress={() => addToCart(item)} style={{}}>
                <AntDesign name="pluscircle" size={20} color="#67300f" style={{ marginBottom: 0 }} />
              </TouchableOpacity>
            }

            <TouchableOpacity onPress={() => favoriteProduct(item)} style={{}}>
              {
                isFavorite ?
                  <ExportSvg.Favorite />
                  :
                  <ExportSvg.whiteFav />

              }
            </TouchableOpacity>
          </View>

        </FastImage>

        <Animated.View
          style={[
            styles.shadow,
            { transform: [{ translateX }, { translateY }], opacity: shadowOpacity },
          ]}
        />

        <View style={{ width: width / 2.5 }}>
          <Text numberOfLines={1} style={styles.arrivalTitle}>{item?.name}</Text>
          <Text numberOfLines={1} style={styles.arrivalSubTitle}>
            {removeHTMLCode(item?.description).length > 30
              ? `${removeHTMLCode(item?.description).slice(0, 30)}...`
              : removeHTMLCode(item?.description)}
          </Text>
          <Text style={styles.arrivalPrice}>KD{item?.price}</Text>
        </View>
      </TouchableOpacity>





    </Animatable.View>
  )
}

export default SingleProductCard

const styles = StyleSheet.create({
  arrivalTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: color.theme,
    marginTop: 5,
    fontFamily: "Montserrat-SemiBold",
    textAlign: "left"

  },
  arrivalSubTitle: {
    color: color.gray,
    // fontWeight: "300",
    marginVertical: 2,
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    textAlign: "left"



  },
  arrivalPrice: {
    color: color.theme,
    // fontWeight: "500",
    fontFamily: "Montserrat-SemiBold",
    textAlign: "left"


  },


  shadow: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: color.theme,
    borderRadius: 10,
  },
})