import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  I18nManager,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
  PanResponder,
} from 'react-native';
import ExportSvg from '../../constants/ExportSvg';
import { color } from '../../constants/color';
import ProductSlider from '../../components/ProductSlider';
import { productDetails } from '../../services/UserServices';
import { useDispatch, useSelector } from 'react-redux';
import {
  addProductToCart,
  handleTotalPrice,
} from '../../redux/reducer/ProductAddToCart';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useTranslation } from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Text from '../../components/CustomText';
import HeaderBox from '../../components/HeaderBox';
import ScreenLoader from '../../components/ScreenLoader';
import CustomText from '../../components/CustomText';
import { fonts } from '../../constants/fonts';
import {
  preloadImagesInBatches,
  extractProductImages,
  isImagePreloaded,
  PRIORITY,
} from '../../utils/ImagePreloader';

const ProductDetails = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.cartProducts?.cartProducts);
  const { t } = useTranslation();
  const [isLoader, setIsLoader] = useState(true);
  const pan = useRef(new Animated.ValueXY()).current;
  const { id, selectedCat } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [productOrder, setProductOrder] = useState(1);
  const [productData, setProductData] = useState([]);
  const [productObject, setProductObject] = useState('');
  const [selectedColorId, setSelectedColorId] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState('');
  const [imageLoadingProgress, setImageLoadingProgress] = useState(0);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const carouselRef = useRef(null);
  const isMountedRef = useRef(true);

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

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 || gestureState.dx < -50) {
          setSelectedImage(null);
        }
      },
    })
  ).current;

  useEffect(() => {
    isMountedRef.current = true;
    getProductDetail();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getProductDetail = async () => {
    setIsLoader(true);
    setImagesPreloaded(false);
    try {
      const response = await productDetails(id);
      if (response?.status) {
        setProductData(response);
        setProductObject(response?.data);
        const availableVariant = response?.variant_system?.optimized_variants?.find(
          variant => variant?.stock_quantity > 0
        );
        if (availableVariant) {
          setSelectedVariant(availableVariant);
          setSelectedImage(availableVariant?.main_image);
          setCurrentIndex(availableVariant?.main_image);
          const firstAttrKey = Object.keys(availableVariant.attributes_array)[0];
          setSelectedAttributes({
            [firstAttrKey]: availableVariant.attributes_array[firstAttrKey],
          });
        } else {
          setSelectedImage(response?.product_images[0]?.image_url)
          setCurrentIndex(response?.product_images[0]?.image_url)
        }
        const allImages = extractProductImages(response?.data?.product_images || []);
        if (allImages.length > 0) {
          const allPreloaded = allImages.every(isImagePreloaded);
          if (allPreloaded) {
            setImagesPreloaded(true);
            setIsLoader(false);
          } else {
            await preloadImagesInBatches(
              allImages,
              5,
              (completed, total) => {
                if (!isMountedRef.current) return;
                setImageLoadingProgress(Math.round((completed / total) * 100));
              },
              { priority: PRIORITY.HIGH }
            );
            if (isMountedRef.current) {
              setImagesPreloaded(true);
              setIsLoader(false);
            }
          }
        } else {
          setImagesPreloaded(true);
          setIsLoader(false);
        }
      } else {
        setProductData([]);
        setImagesPreloaded(true);
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      setImagesPreloaded(true);
    }
  };



  const addToCart = () => {
    dispatch(
      addProductToCart({
        id: id,
        productName: productObject?.name,
        price: productObject?.price,
        size: selectedSize,
        counter: productOrder,
        Variants: selectedAttributes ? selectedAttributes : '',
        Variants_stock: selectedVariant?.stock_quantity,
        subText: removeHTMLCode(productObject?.description),
        productWeight: selectedVariant ? selectedVariant?.weight : productObject?.weight ? productObject?.weight : '00000',
        image: selectedVariant ? selectedVariant?.main_image : selectedImage ? selectedImage : productData?.product_images[0]?.image_url,
      }),
    );
    if (id && selectedSize) {
      navigation.navigate('MyCart');
    }
    ReactNativeHapticFeedback.trigger('impactLight');
  };

  const quantity = type => {
    if (type == 'de') {
      setProductOrder(productOrder > 1 ? productOrder - 1 : 1);
    } else {
      if (selectedVariant?.stock_quantity > productOrder) {
        setProductOrder(productOrder + 1);
      }
    }
    ReactNativeHapticFeedback.trigger('impactLight');
  };

  const sharePress = async () => {
    try {
      const iosLink = `https://nextjs-sample-ten-cyan.vercel.app/productDetails/${id}`;
      const androidLink = `https://nextjs-sample-ten-cyan.vercel.app/productDetails/productDetails/${id}`;
      const shareLink = Platform.OS == 'ios' ? iosLink : androidLink;
      await Share.share({
        message: shareLink
      });
    } catch (error) {
      console.error('Error sharing product:', error);
    }
  };

  const handleVariant = (key, value) => {
    const updatedAttributes = { ...selectedAttributes, [key]: value };
    setSelectedAttributes(updatedAttributes);
    const matchedVariant = productData?.variant_system?.optimized_variants.find(variant => {
      return Object.entries(updatedAttributes).every(([attrKey, attrValue]) => {
        return variant.attributes_array[attrKey] === attrValue;
      });
    });
    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
      setSelectedImage(matchedVariant?.main_image);
      setCurrentIndex(matchedVariant?.main_image);
    }
    const attributeKeys = Object.keys(productData?.variant_system?.available_attributes || {});
    const currentAttrIndex = attributeKeys.indexOf(key);
    const nextAttrKey = attributeKeys[currentAttrIndex + 1];
    if (nextAttrKey) {
      const nextAttrOptions = productData?.variant_system?.optimized_variants
        .filter(variant => {
          return (
            variant.stock_quantity > 0 &&
            variant.attributes_array[key] === value
          );
        })
        .map(variant => variant.attributes_array[nextAttrKey]);
      if (nextAttrOptions?.length > 0) {
        const firstNextValue = nextAttrOptions[0];
        const autoAttributes = {
          ...updatedAttributes,
          [nextAttrKey]: firstNextValue,
        };
        const autoVariant = productData?.variant_system?.optimized_variants.find(variant =>
          Object.entries(autoAttributes).every(([attrKey, attrValue]) => {
            return variant.attributes_array[attrKey] === attrValue;
          })
        );
        setSelectedAttributes(autoAttributes);
        if (autoVariant) setSelectedVariant(autoVariant);
      }
    }
  };

  const isOutOfStock =
    productData?.variant_system?.has_variants &&
    productData?.variant_system?.optimized_variants?.every(
      variant => variant.stock_quantity === 0
    );

  const isCheckQuantity =
    productObject?.quantity == 0 ||
    isOutOfStock ||
    (selectedVariant && selectedVariant?.stock_quantity == 0) ||
    selectedVariant == undefined;

  if (isLoader || !imagesPreloaded) {
    return <ScreenLoader />;
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}>
        <HeaderBox
          catName={selectedCat}
          share={true}
          onPressShare={() => sharePress(productObject?.name, productObject?.price)}
        />
        <View>
          <ProductSlider
            currentIndex={currentIndex}
            variantArray={productData?.variant_system?.optimized_variants}
            carouselRef={carouselRef}
            setCurrentIndex={setCurrentIndex}
            data={productData?.product_images}
            setImgUrl={setImgUrl}
            item={productObject}
            setSelectedImage={setSelectedImage}
            productVariants={productData?.variants}
            selectedImage={selectedImage}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />
          <View style={styles.productDetailContainer}>
            <View style={styles.productNamePriceBox}>
              <View style={{ width: '70%' }}>
                <Text style={styles.productName} numberOfLines={2}>{productObject?.name}</Text>
                <Text style={styles.productSubTxt}>{productObject?.barcode}</Text>
              </View>
              <View>
                <View style={styles.itemCounter}>
                  {productObject?.quantity !== 0 && (
                    <>
                      <TouchableOpacity onPress={() => quantity('de')}>
                        <Text style={styles.decrementBtnTxt}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.counterNumberTxt}>{productOrder}</Text>
                      <TouchableOpacity onPress={() => quantity('add')}>
                        <Text style={styles.incrementBtnTxt}>+</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                {productObject?.quantity == 0 ? (
                  <Text style={styles.availableTxt}>{t('outOfStock')}</Text>
                ) : (
                  <Text style={styles.availableTxt}>{t('available_stocks')}</Text>
                )}
              </View>
            </View>
            {productData?.variant_system?.available_attributes &&
              typeof productData?.variant_system?.available_attributes === 'object' &&
              Object.entries(productData.variant_system.available_attributes).map(([key, values]) => (
                <View key={key} style={{ marginBottom: 10, marginTop: 10 }}>
                  <CustomText style={styles.productName}>{key}</CustomText>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={{ gap: 10, marginTop: 10, flexGrow: 1 }}
                  >
                    {values.map((item, index) => {
                      const isSelected = selectedVariant?.attributes_array?.[key] === item;
                      const filteredVariants = productData?.variant_system?.optimized_variants?.filter(variant => {
                        return Object.entries(selectedAttributes).every(([attrKey, attrValue]) => {
                          return attrKey === key || variant.attributes_array[attrKey] === attrValue;
                        });
                      });
                      const matchingVariant = filteredVariants.find(
                        variant => variant.attributes_array?.[key] === item
                      );
                      const inStock = matchingVariant?.stock_quantity > 0;
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => { inStock ? handleVariant(key, item) : null; }}
                          activeOpacity={inStock ? 0.8 : 1}
                          style={[
                            {
                              borderWidth: 1,
                              paddingHorizontal: 10,
                              paddingVertical: 2,
                              borderColor: inStock ? '#ccc' : '#00000010',
                              borderRadius: 4,
                              paddingTop: 0,
                            },
                            isSelected && { borderColor: color.primary }
                          ]}
                        >
                          <CustomText style={{ color: inStock ? color.black : color.gray }}>
                            {item}
                          </CustomText>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              ))}
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.productName, { marginBottom: 5 }]}>
                {t('p_description')}
              </Text>
            </View>
            <Text style={{ ...styles.productDesc }}>
              {removeHTMLCode(productObject?.description)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          width: '90%',
          alignSelf: 'center',
          bottom: 90,
        }}>
        <TouchableOpacity disabled={isCheckQuantity} onPress={addToCart} style={[styles.bottomPriceCartBox, isCheckQuantity && { backgroundColor: '#ccc' }]}
        >
          <Text style={styles.productPrice}>KD {selectedVariant?.price ? selectedVariant?.price : productObject?.price}</Text>
          <View style={[styles.bottomCartBox]}>
            <Ionicons name={'bag-handle-outline'} size={20} color={'#fff'} style={{ marginRight: 10 }} />
            <Text style={styles.cartTxt}>{t('add_to_cart')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 40 : 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  productDetailContainer: {
    backgroundColor: '#fff',
    marginHorizontal: -15,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 200,
  },
  productNamePriceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    color: color.theme,
    textAlign: 'left',
  },
  productSubTxt: {
    fontSize: 12,
    color: color.gray,
    marginVertical: 5,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'left',
  },
  starReviewBox: {
    flexDirection: 'row',
  },
  peopleReview: {
    fontWeight: '300',
    color: color.theme,
    marginLeft: 10,
  },
  itemCounter: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
    paddingVertical: 8,
    borderRadius: 50,
    marginBottom: 10,
  },
  decrementBtnTxt: {
    paddingHorizontal: 15,
    color: color.theme,
  },
  counterNumberTxt: {
    color: color.theme,
    fontSize: 16,
    fontWeight: '300',
  },
  incrementBtnTxt: {
    paddingHorizontal: 15,
    color: color.theme,
  },
  availableTxt: {
    color: color.theme,
    fontWeight: '500',
    marginBottom: 20,
  },
  SizeColorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  sizeInnerBox: {
    borderWidth: 1,
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    borderColor: color.lightGray,
  },
  colorBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 50,
    paddingVertical: 5,
  },
  innerColorStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productDesc: {
    fontSize: 13,
    color: '#666666',
    marginTop: 10,
    fontFamily: 'Montserrat-Regular',
    textAlign: I18nManager.isRTL ? 'left' : 'left',
  },
  bottomPriceCartBox: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    backgroundColor: color.theme,
    paddingVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  bottomCartBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
  },
  productPrice: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  cartTxt: {
    color: '#fff',
    fontFamily: fonts.bold,
  },
  renderItem1_img: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height / 2 - 20,
  },
});
