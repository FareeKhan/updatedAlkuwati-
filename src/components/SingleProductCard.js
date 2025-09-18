import React, { useState, useEffect, useMemo } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming,FadeInDown } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../redux/reducer/ProductAddToCart';
import { productFavorite, removeFavorite } from '../redux/reducer/AddFavorite';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useTranslation } from 'react-i18next';
import Text from './CustomText';
import ExportSvg from '../constants/ExportSvg';
import { color } from '../constants/color';
import { fonts } from '../constants/fonts';
import { productDetails } from '../services/UserServices';

const { width } = Dimensions.get('screen');

const SingleProductCard = ({
  item,
  index,
  onPress,
  isShowPlusIcon = true,
  isDot = true,
  isPreloaded = false,
  stockAvailable = true, // pass from parent
  hasVariant , // pass from parent
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userId = useSelector(state => state.auth?.userId);
  const cartProducts = useSelector(state => state.cartProducts?.cartProducts);
  const favoriteList = useSelector(state => state?.favorite?.AddInFavorite);

  const isFavorite = useMemo(() => favoriteList.some(fav => fav.id === item.id), [favoriteList, item.id]);
  const isInCart = useMemo(() => cartProducts?.some(p => p.id === item.id), [cartProducts, item.id]);

  const [loading, setLoading] = useState(!isPreloaded);
  const [isCartLoader, setIsCartLoader] = useState(false);

  // Reanimated shared values for shadow
  const shadowX = useSharedValue(0);
  const shadowY = useSharedValue(0);
  const shadowOpacity = useSharedValue(1);

  useEffect(() => {
    if (isPreloaded && item.image) {
      setLoading(false);
    }
    if (item.image) {
      FastImage.preload([{ uri: item.image }]);
    }

  }, [item.image, isPreloaded]);





    const getProductDetail = async item => {
    setIsCartLoader(true);
    try {
      const response = await productDetails(item?.id);
      if (response?.status) {
        if (response?.data?.quantity > 0) {
          if (
            Object.keys(response?.variant_system?.available_attributes || {})
              .length > 0
          ) {
            navigation.navigate('ProductDetails', {id: item?.id});
          } else {
            addToCartHandler(response?.data?.variants[0]?.id);
          }
        } else {
          showMessage({type: 'danger', message: t('outOfStocks')});
        }
      }
    } catch (error) {
      setIsCartLoader(false);
    } finally {
      setIsCartLoader(false);
    }
  };

  const favoriteProduct = () => {
    if (!userId) {
      showMessage({ type: 'warning', message: t('loginFavorite') });
      return;
    }

    if (isFavorite) {
      dispatch(removeFavorite({ id: item.id }));
      ReactNativeHapticFeedback.trigger('impactLight');
    } else {
      dispatch(productFavorite(item));
      ReactNativeHapticFeedback.trigger('notificationError');
    }
  };

  const addToCartHandler = () => {
    if (isInCart) {
      showMessage({ type: 'warning', message: t('alreadyAdded') });
      return;
    }

    setIsCartLoader(true);
if(hasVariant){
  navigation.navigate('ProductDetails', {id: item?.id});
}else{
    dispatch(addProductToCart({
        id: item?.id,
        varID: item?.variants?.[0]?.id,
        productName: item?.name,
        price: item?.price,
        productWeight: item?.weight || '00000',
        size: 'M',
        counter: 1,
        subText: removeHTMLCode(item?.description),
        image: item?.image,
        odo_id: item?.odoo_id,
      }));
      showMessage({ type: 'success', message: t('productAdded') });
      // ReactNativeHapticFeedback.trigger('impactLight');

}

      setIsCartLoader(false);

   
    // animate shadow
    // shadowX.value = withTiming(-150, { duration: 700 });
    // shadowY.value = withTiming(50, { duration: 700 });
    // shadowOpacity.value = withTiming(0, { duration: 700 }, () => {
    //   dispatch(addProductToCart({
    //     id: item?.id,
    //     varID: item?.variants?.[0]?.id,
    //     productName: item?.name,
    //     price: item?.price,
    //     productWeight: item?.weight || '00000',
    //     size: 'M',
    //     counter: 1,
    //     subText: removeHTMLCode(item?.description),
    //     image: item?.image,
    //     odo_id: item?.odoo_id,
    //   }));
    //   showMessage({ type: 'success', message: t('productAdded') });
    //   // ReactNativeHapticFeedback.trigger('impactLight');
    //   setIsCartLoader(false);
    // });
  };

  const shadowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shadowX.value }, { translateY: shadowY.value }],
    opacity: shadowOpacity.value,
  }));

  const removeHTMLCode = value => {
    if (!value) return '';
    const regex = /(<([^>]+)>)/gi;
    return value.replace(regex, '').replace(/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi, '');
  };

  return (
    <Animated.View entering={FadeInDown}>
      {loading && (
        <View style={styles.loaderWrapper}>
          <SkeletonPlaceholder borderRadius={10}>
            <View style={styles.loaderBox} />
          </SkeletonPlaceholder>
        </View>
      )}

      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.cardContainer}>
        <FastImage
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          source={{ uri: item.image, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable }}
          style={styles.productImage}
          borderRadius={20}>
          <View style={styles.cardHeader}>
            {isShowPlusIcon && (
              <TouchableOpacity
                disabled={!stockAvailable || isCartLoader}
                // onPress={addToCartHandler}
                 onPress={() => getProductDetail(item)}
                style={styles.plusButton}>
                {isCartLoader ? (
                  <ActivityIndicator size="small" color={color.theme} />
                ) : (
                  <View style={styles.plusRow}>
                    <AntDesign
                      name="pluscircle"
                      size={20}
                      color={stockAvailable ? '#67300f' : '#cecece90'}
                    />
                    {!stockAvailable && (
                      <View style={styles.outOfStockBadge}>
                        <Text style={{ fontSize: I18nManager.isRTL ? 12 : 13 }}>{t('outOfStock')}</Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={favoriteProduct} style={styles.favoriteBtn}>
              {isFavorite ? <ExportSvg.Favorite /> : <ExportSvg.whiteFav />}
            </TouchableOpacity>
          </View>
        </FastImage>

        {/* {isDot && <Animated.View style={[styles.shadow, shadowStyle]} />} */}

        <View style={styles.productInfo}>
          <Text numberOfLines={1} style={styles.arrivalTitle}>{item.name || item.productName}</Text>
          <Text numberOfLines={1} style={styles.arrivalSubTitle}>
            {removeHTMLCode(item.description).length > 30
              ? `${removeHTMLCode(item.description).slice(0, 30)}...`
              : removeHTMLCode(item.description)}
          </Text>
          <Text style={styles.arrivalPrice}>KD{item.price}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(SingleProductCard, (prev, next) => prev.item.id === next.item.id && prev.index === next.index);

const styles = StyleSheet.create({
  loaderWrapper: {
    marginBottom: 10,
    width: 170,
    height: 170,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'absolute',
    zIndex: 100,
    top: 5,
  },
  loaderBox: {
    width: 170,
    height: 170,
    borderRadius: 10,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  productImage: {
    width: 170,
    height: 170,
    marginRight: 5,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  plusButton: {},
  plusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  outOfStockBadge: {
    paddingHorizontal: 5,
    backgroundColor: '#cecece90',
    borderRadius: 5,
  },
  favoriteBtn: {},
  productInfo: {
    width: width / 2.5,
  },
  arrivalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: color.theme,
    marginTop: 5,
    textAlign: 'left',
  },
  arrivalSubTitle: {
    color: color.gray,
    marginVertical: 2,
    fontSize: 12,
    textAlign: 'left',
  },
  arrivalPrice: {
    color: color.theme,
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



// import {
//   ActivityIndicator,
//   Animated as Anim,
//   Dimensions,
//   Easing,
//   I18nManager,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import ExportSvg from '../constants/ExportSvg';
// import {color} from '../constants/color';
// import {useDispatch, useSelector} from 'react-redux';
// import {productFavorite, removeFavorite} from '../redux/reducer/AddFavorite';
// import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
// import {addProductToCart} from '../redux/reducer/ProductAddToCart';
// import {useNavigation} from '@react-navigation/native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Text from './CustomText';
// import {useTranslation} from 'react-i18next';
// import {productDetails} from '../services/UserServices';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
// import FastImage from 'react-native-fast-image';
// import {fonts} from '../constants/fonts';
// import {showMessage} from 'react-native-flash-message';

// const {width} = Dimensions.get('screen');

// const SingleProductCard = ({
//   item,
//   index,
//   isDot = true,
//   onPress,
//   isShowPlusIcon,
//   isPreloaded = false,
// }) => {
//   const dispatch = useDispatch();
//   const userId = useSelector(state => state.auth?.userId);
//   const data = useSelector(state => state.cartProducts?.cartProducts);
//   const favoriteList = useSelector(state => state?.favorite?.AddInFavorite);
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(!isPreloaded);
//   const [isCartLoader, setIsCartLaoder] = useState(false);
//   const [isStockLoader, setIsStockLoader] = useState(false);
//   const [isCheckStockIsAvaialable, setIsCheckStockIsAvailable] = useState(false);

//   const isCheck = data?.some(value => value?.id == item?.id);
//   const isFavorite = favoriteList.some(favorite => favorite.id === item.id);

//   const {t} = useTranslation();

//   const animatedValue = useRef(new Anim.Value(0)).current;
//   const shadowOpacity = useRef(new Anim.Value(1)).current;

//   const startX = 150;
//   const startY = 500;

//   const endX = -150;
//   const endY = 50;

//   useEffect(() => {
//     checkStock();
//   }, []);

//   useEffect(() => {
//     if (isPreloaded && item.image) {
//       setLoading(false);
//     }
//   }, [isPreloaded, item.image]);

//   const checkStock = async () => {
//     setIsStockLoader(true);
//     try {
//       const response = await productDetails(item?.id);
//       if (response?.status) {
//         const isOutOfStock =
//           response?.variant_system?.has_variants &&
//           response?.variant_system?.optimized_variants?.every(
//             variant => variant.stock_quantity === 0,
//           );
//         const availableVariant =
//           response?.variant_system?.optimized_variants?.find(
//             variant => variant?.stock_quantity > 0,
//           );
//         const isCheckQuantity =
//           response?.data?.quantity == 0 ||
//           isOutOfStock ||
//           (availableVariant && availableVariant?.stock_quantity == 0) ||
//           availableVariant == undefined;
//         setIsCheckStockIsAvailable(isCheckQuantity);
//       }
//     } catch (error) {
//       setIsStockLoader(false);
//     } finally {
//       setIsStockLoader(false);
//     }
//   };

//   const favoriteProduct = item => {
//     if (userId) {
//       if (isFavorite) {
//         dispatch(removeFavorite({id: item?.id}));
//         ReactNativeHapticFeedback.trigger('impactLight');
//       } else {
//         ReactNativeHapticFeedback.trigger('notificationError');
//         dispatch(productFavorite(item));
//       }
//     } else {
//       showMessage({
//         type: 'warning',
//         message: t('loginFavorite'),
//       });
//     }
//   };

//   const getProductDetail = async item => {
//     setIsCartLaoder(true);
//     try {
//       const response = await productDetails(item?.id);
//       if (response?.status) {
//         if (response?.data?.quantity > 0) {
//           if (
//             Object.keys(response?.variant_system?.available_attributes || {})
//               .length > 0
//           ) {
//             navigation.navigate('ProductDetails', {id: item?.id});
//           } else {
//             addToCart(response?.data?.variants[0]?.id);
//           }
//         } else {
//           showMessage({type: 'danger', message: t('outOfStocks')});
//         }
//       }
//     } catch (error) {
//       setIsCartLaoder(false);
//     } finally {
//       setIsCartLaoder(false);
//     }
//   };

//   const addToCart = var_id => {
//     if (isCheck) {
//       showMessage({type: 'warning', message: t('alreadyAdded')});
//     } else {
//       animatedValue.setValue(0);
//       shadowOpacity.setValue(1);

//       Anim.timing(animatedValue, {
//         toValue: 1,
//         duration: 700,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }).start(() => {
//         dispatch(
//           addProductToCart({
//             id: item?.id,
//             varID: var_id,
//             productName: item?.name,
//             price: item?.price,
//             productWeight: item?.weight ? item?.weight : '00000',
//             size: 'M',
//             counter: 1,
//             subText: removeHTMLCode(item?.description),
//             image: item?.image,
//             odo_id: item?.odoo_id,
//           }),
//         );

//         showMessage({type: 'success', message: t('productAdded')});
//         ReactNativeHapticFeedback.trigger('impactLight');
//         Anim.timing(shadowOpacity, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: true,
//         }).start();
//       });
//     }
//   };

//   const translateX = animatedValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [startX, endX],
//   });

//   const translateY = animatedValue.interpolate({
//     inputRange: [0, 0.5],
//     outputRange: [startY, endY],
//   });

//   const removeHTMLCode = value => {
//     if (value) {
//       const regex = /(<([^>]+)>)/gi;
//       const val = value.replace(regex, '');
//       return val.replace(/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi, '');
//     }
//     return '';
//   };

//   return (
//     <Animated.View
//            entering={FadeInDown.delay(index * 100).duration(600)}
//       >
//       {loading && (
//         <View style={styles.loaderWrapper}>
//           <SkeletonPlaceholder borderRadius={4}>
//             <View style={styles.loaderBox}>
//               <View style={styles.loaderHeader}>
//                 <View style={styles.loaderCircle} />
//                 <View style={styles.loaderCircle} />
//               </View>
//               <View style={styles.loaderBottom} />
//             </View>
//           </SkeletonPlaceholder>
//         </View>
//       )}

//       <TouchableOpacity
//         activeOpacity={0.7}
//         onPress={onPress}
//         style={styles.cardContainer}>
//         <FastImage
//           onLoad={() => setLoading(false)}
//           onError={() => setLoading(false)}
//           source={{
//             uri: item.image,
//             priority: FastImage.priority.high,
//             cache: FastImage.cacheControl.immutable,
//           }}
//           style={styles.productImage}
//           borderRadius={20}>
//           <View style={styles.cardHeader}>
//             {isShowPlusIcon && (
//               <TouchableOpacity
//                 disabled={isCheckStockIsAvaialable}
//                 onPress={() => getProductDetail(item)}
//                 style={styles.plusButton}>
//                 {isCartLoader || isStockLoader ? (
//                   <ActivityIndicator size={'small'} color={color.theme} />
//                 ) : (
//                   <View style={styles.plusRow}>
//                     <AntDesign
//                       name="pluscircle"
//                       size={20}
//                       color={
//                         isCheckStockIsAvaialable ? '#cecece90' : '#67300f'
//                       }
//                     />
//                     {isCheckStockIsAvaialable && (
//                       <View style={styles.outOfStockBadge}>
//                         <Text
//                           style={{
//                             fontSize: I18nManager.isRTL ? 12 : 13,
//                           }}>
//                           {t('outOfStock')}
//                         </Text>
//                       </View>
//                     )}
//                   </View>
//                 )}
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               onPress={() => favoriteProduct(item)}
//               style={styles.favoriteBtn}>
//               {isFavorite ? <ExportSvg.Favorite /> : <ExportSvg.whiteFav />}
//             </TouchableOpacity>
//           </View>
//         </FastImage>

//         {isDot && (
//           <Anim.View
//             style={[
//               styles.shadow,
//               {transform: [{translateX}, {translateY}], opacity: shadowOpacity},
//             ]}
//           />
//         )}

//         <View style={styles.productInfo}>
//           <Text numberOfLines={1} style={styles.arrivalTitle}>
//             {item?.name || item?.productName}
//           </Text>
//           <Text numberOfLines={1} style={styles.arrivalSubTitle}>
//             {removeHTMLCode(item?.description).length > 30
//               ? `${removeHTMLCode(item?.description).slice(0, 30)}...`
//               : removeHTMLCode(item?.description)}
//           </Text>
//           <Text style={styles.arrivalPrice}>KD{item?.price}</Text>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// export default SingleProductCard;

// const styles = StyleSheet.create({
//   loaderWrapper: {
//     marginBottom: 10,
//     borderColor: '#cecece',
//     width: 170,
//     height: 170,
//     marginRight: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     position: 'absolute',
//     zIndex: 100,
//     top: 5,
//   },
//   loaderBox: {
//     borderWidth: 1,
//     width: 170,
//     height: 170,
//     marginBottom: 10,
//     borderRadius: 10,
//   },
//   loaderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 10,
//     marginTop: 10,
//   },
//   loaderCircle: {
//     width: 25,
//     height: 25,
//     borderRadius: 50,
//   },
//   loaderBottom: {
//     height: 110,
//     width: '100%',
//     marginTop: 'auto',
//     borderBottomLeftRadius: 10,
//     borderBottomRightRadius: 10,
//   },
//   cardContainer: {
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   productImage: {
//     width: 170,
//     height: 170,
//     marginRight: 5,
//     borderRadius: 20,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     margin: 10,
//   },
//   plusButton: {},
//   plusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//   },
//   outOfStockBadge: {
//     paddingHorizontal: 5,
//     backgroundColor: '#cecece90',
//     borderRadius: 5,
//   },
//   favoriteBtn: {},
//   productInfo: {
//     width: width / 2.5,
//   },
//   arrivalTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: color.theme,
//     marginTop: 5,
//     textAlign: 'left',
//   },
//   arrivalSubTitle: {
//     color: color.gray,
//     marginVertical: 2,
//     fontSize: 12,
//     textAlign: 'left',
//   },
//   arrivalPrice: {
//     color: color.theme,
//     textAlign: 'left',
//     fontFamily: fonts.bold,
//   },
//   shadow: {
//     position: 'absolute',
//     width: 20,
//     height: 20,
//     backgroundColor: color.theme,
//     borderRadius: 10,
//   },
// });
