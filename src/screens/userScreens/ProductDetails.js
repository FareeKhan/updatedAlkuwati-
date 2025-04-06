import {
  I18nManager,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ExportSvg from '../../constants/ExportSvg';
import { color } from '../../constants/color';
import ProductSlider from '../../components/ProductSlider';
import { productDetails } from '../../services/UserServices';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, handleTotalPrice } from '../../redux/reducer/ProductAddToCart';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import * as Animatable from 'react-native-animatable';
import { useTranslation } from 'react-i18next';

import HeaderBox from '../../components/HeaderBox';

import ScreenLoader from '../../components/ScreenLoader';
const ProductDetails = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.cartProducts?.cartProducts);
  const { t } = useTranslation();
  const [isLoader, setIsLoader] = useState(false);

  const { id, selectedCat } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [productOrder, setProductOrder] = useState(1);
  const [productData, setProductData] = useState([]);
  const [productObject, setProductObject] = useState('');
  const [selectedColorId, setSelectedColorId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const carouselRef = useRef(null);


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

  useEffect(() => {
    getProductDetail();
  }, []);

  const getProductDetail = async () => {
    setIsLoader(true);
    try {
      const response = await productDetails(id);
      if (response?.status) {
        setProductData(response);
        setProductObject(response?.data[0]);
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      console.log(error);
    }
  };

  const size = productData ? productData?.size_variants : '';
  const colorVariants = productData ? productData?.color_variants : '';

  const addToCart = () => {
    dispatch(
      addProductToCart({
        id: id,
        productName: productObject?.name,
        price: productObject?.price,
        size: selectedSize,
        counter: productOrder,
        subText: removeHTMLCode(productObject?.description),
        image:
          imgUrl == '' ? productData?.product_images[0]?.image_url : imgUrl,
      }),
    );
    if (data?.length > 0) {
      const finalPrice = data.reduce((total, item) => {
        return total + item.counter * parseFloat(item.price);
      }, 0)
        .toFixed(2);
      dispatch(handleTotalPrice(finalPrice))
    } else {
      const finalPrice = productOrder * parseFloat(productObject?.price)
      dispatch(handleTotalPrice(finalPrice))
    }




    if (id && selectedSize) {
      navigation.navigate('MyCart');
    }
    ReactNativeHapticFeedback.trigger('impactLight');
  };

  const quantity = type => {
    if (type == 'de') {
      setProductOrder(productOrder > 1 ? productOrder - 1 : 1);
    } else {
      setProductOrder(productOrder + 1);
    }
    ReactNativeHapticFeedback.trigger('impactLight');
  };

  const sharePress = async () => {
    try {
      const iosLink = `https://nextjs-sample-ten-cyan.vercel.app/productDetails/${id}`;
      const androidLink = `https://nextjs-sample-ten-cyan.vercel.app/productDetails/productDetails/${id}`;
      const shareLink = Platform.OS == 'ios' ? iosLink : androidLink
      await Share.share({
        message: shareLink
      })
    } catch (error) {
      console.error('Error sharing product:', error);
    }
  };


  if (isLoader) {
    return <ScreenLoader />;
  }

  return (
    <Animatable.View
      // animation={'slideInLeft'}
      // duration={1000}
      // delay={100}
      style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
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
              carouselRef={carouselRef}
              setCurrentIndex={setCurrentIndex}
              data={productData?.product_images}
              setImgUrl={setImgUrl}
              item={productObject}
            />

            <View style={styles.productDetailContainer}>
              <View style={styles.productNamePriceBox}>
                <View style={{ width: '70%' }}>
                  <Text style={styles.productName}>{productObject?.name}</Text>
                  <Text style={styles.productSubTxt}>{productObject?.barCode}</Text>
                  {/* <Text style={styles.productSubTxt}>
                  {removeHTMLCode(productObject?.description)}
                </Text> */}
                </View>

                <View>
                  <View style={styles.itemCounter}>
                    <TouchableOpacity onPress={() => quantity('de')}>
                      <Text style={styles.decrementBtnTxt}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.counterNumberTxt}>{productOrder}</Text>

                    <TouchableOpacity onPress={() => quantity('add')}>
                      <Text style={styles.incrementBtnTxt}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.availableTxt}>{t('available_stocks')}</Text>
                </View>
              </View>

              {size?.length > 0 && (
                <Text style={[styles.productName]}>{t('p_size')}</Text>
              )}
              <View style={styles.SizeColorContainer}>
                <View style={styles.sizeContainer}>
                  {size?.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => setSelectedSize(item?.sid)}
                        style={[
                          styles.sizeInnerBox,
                          selectedSize == item?.sid && {
                            backgroundColor: color.theme,
                            borderColor: color.theme,
                          },
                        ]}
                        key={index}>
                        <Text
                          style={{
                            color: selectedSize == item?.sid ? '#fff' : '#000',
                            fontWeight: '500',
                          }}>
                          {item?.lable}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {colorVariants?.length > 0 && (
                  <View style={[styles.sizeContainer, styles.colorBox]}>
                    {colorVariants?.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setSelectedColorId(item?.id)}
                          activeOpacity={0.6}
                          style={[
                            styles.innerColorStyle,
                            {
                              backgroundColor: item?.value,
                              marginRight:
                                index == colorVariants?.length - 1 ? 0 : 10,
                            },
                          ]}>
                          {selectedColorId == item?.id && <ExportSvg.whiteTick />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[styles.productName, { marginTop: colorVariants?.length == 0 && size?.length == 0 ? -20 : 20, marginBottom: 5 }]}>
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
          <TouchableOpacity onPress={addToCart} style={styles.bottomPriceCartBox}>
            <Text style={styles.productPrice}>KD{productObject?.price}</Text>

            <TouchableOpacity onPress={addToCart} style={styles.bottomCartBox}>
              <ExportSvg.ShippingCart style={{ marginRight: 10 }} />
              <TouchableOpacity onPress={addToCart}>
                <Text style={styles.cartTxt}>{t('add_to_cart')}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>



      </View>
    </Animatable.View >
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
    fontWeight: '600',
    color: color.theme,
    textAlign: "left"
  },
  productSubTxt: {
    fontSize: 12,
    color: color.gray,
    marginVertical: 5,
    fontFamily: 'Montserrat-Regular',
    textAlign: "left",
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
    width: 20,
    height: 20,
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
    flexDirection: 'row',
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
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
  },
  productPrice: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  cartTxt: {
    color: color.theme,
    fontFamily: 'Montserrat-SemiBold',
  },
});
