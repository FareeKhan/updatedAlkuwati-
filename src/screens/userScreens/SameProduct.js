import {
  Dimensions,
  FlatList,
  LogBox,
  Platform,
  StyleSheet,

  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import ExportSvg from '../../constants/ExportSvg';
import { color } from '../../constants/color';
import { getSameProduct } from '../../services/UserServices';
import ScreenLoader from '../../components/ScreenLoader';
import SingleProductCard from '../../components/SingleProductCard';
import axios from 'axios';
import Text from '../../components/CustomText'



import SearchModal from '../../components/SearchModal';

const ITEM_WIDTH = Dimensions.get('window').width * 0.8;

import * as Animatable from 'react-native-animatable';
import {

  fetchCategoryProducts,
  categoriesListSub,
} from '../../services/UserServices';
import EmptyScreen from '../../components/EmptyScreen';
import { useTranslation } from 'react-i18next';


import HeaderBox from '../../components/HeaderBox';
import CustomLoader from '../../components/CustomLoader';
import { fonts } from '../../constants/fonts';



const SameProduct = ({ navigation, route }) => {
  const { text, subC_ID, selected, navID, } = route?.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [productLoader, setProductLoader] = useState(false);
  const [selectedCat, setSelectedCat] = useState(subC_ID);
  const [storeCategories, setStoreCategories] = useState([]);

  const { t } = useTranslation();


  const animationMain = 'fadeInRight';
  const durationInner = 1000;
  const delayInner = 100;

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    getCatList();
  }, [storeCategories]);

  useEffect(() => {
    setTimeout(() => { setIsLoader(false) }, 2000)
  }, [])

  const getCatList = async () => {
    try {
      const response = await categoriesListSub(selectedCat);
      if (response?.status) {
        setIsLoader(false);
        setStoreCategories(response?.data);
      } else {
        setIsLoader(false);

      }
    } catch (error) {
      setIsLoader(false);
      console.log(error);
    } finally {
      setProductLoader(false)

    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        <SingleProductCard
          item={item}
          countList={1 + index}
          isShowPlusIcon={true}
          onPress={() => navigation.navigate('ProductDetails', {
            id: item?.id,
            selectedCat: item?.name
          })}
        />
      </>
    );
  };


  const handleSubCategory = (id) => {
    setProductLoader(true)
    setSelectedCat(id)
  }


  if (isLoader) {
    return <ScreenLoader />;
  }


  return (
    <Animatable.View
      animation={'slideInLeft'}
      duration={1000}
      delay={100}
      style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <HeaderBox
          cartIcon={true}
        />
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={[styles.searchBox]}
            onPress={() => setModalVisible(true)}>

            <ExportSvg.Search
              style={{
                marginLeft: 18,
                marginRight: 10,
              }}
            />
            <Text style={{ color: '#00000080' }}>{t('search_here')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.arrivalTxt}>{storeCategories?.category?.name}</Text>

        <View style={styles.catBox}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            data={storeCategories?.subcategories}
            renderItem={({ item, index }) => {
              return (
                <Animatable.View
                  animation={animationMain}
                  duration={durationInner}
                  delay={(1 + index) * delayInner}>
                  <TouchableOpacity
                    onPress={() => handleSubCategory(item?.id)}
                    key={index}
                    style={[
                      styles.innerCatBox,
                      selectedCat == item?.id && {
                        backgroundColor: color.theme,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.catTxt,
                        selectedCat == item?.id && { color: '#fff' },
                      ]}>
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              );
            }}
          />
        </View>


        {
          productLoader ?
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <CustomLoader bg={false} colors={color.theme} size={'large'} />
            </View>
            :
            <FlatList
              data={storeCategories?.products}
              // keyExtractor={(item, index) => index?.toString()}
              renderItem={renderItem}
              keyExtractor={(item, index) => selectedCat + "_" + index}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              ListEmptyComponent={<EmptyScreen text={t('no_data_found')} />}
            />
        }

        <SearchModal
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          navigation={navigation}
        />
      </View>
    </Animatable.View>
  );
};

export default SameProduct;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 40 : 20,
    paddingHorizontal: 15,
    marginBottom: 80,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 15,
    paddingHorizontal: 15,
  },
  arrivalTxt: {
    fontSize: 17,
    color: color.theme,
    textAlign: "left",
    fontFamily: fonts.semiBold
  },

  arrivalTitle: {
    fontSize: 15,
    color: color.theme,
    marginTop: 5,
  },
  arrivalSubTitle: {
    color: color.gray,
    marginVertical: 2,
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
  },
  arrivalPrice: {
    color: color.theme,
    fontFamily: 'Montserrat-SemiBold',
  },
  getNowBtn: {
    backgroundColor: color.theme,
    paddingVertical: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  getNowBtnTxt: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 11,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },

  searchBox: {
    backgroundColor: color.gray.concat('10'),
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 30,
    // width: '82%',
    width: '100%',
  },
  getNowBtn: {
    backgroundColor: color.theme,
    paddingVertical: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  discountTxt: {
    color: color.theme,
    fontWeight: '700',
    fontSize: 22,
  },
  discountTitle: {
    color: color.theme,
    fontWeight: '300',
    fontSize: 20,
  },
  subTitleTxt: {
    color: color.gray,
    fontSize: 12,
    marginTop: 12,
  },
  getNowBtnTxt: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 11,
  },
  arrivalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },

  viewTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: color.gray,
  },
  arrivalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: color.theme,
    marginTop: 5,
  },
  arrivalSubTitle: {
    color: color.gray,
    // fontWeight: "300",
    marginVertical: 2,
    fontSize: 12,
  },
  arrivalPrice: {
    color: color.theme,
    // fontWeight: "500",
  },

  item: {
    width: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#ccc',
    paddingHorizontal: 20,
  },

  catBox: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  innerCatBox: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 50,
    borderColor: '#ccc',
  },
  catTxt: {
    color: color.theme,
  },

  imgTitle: {
    color: color.theme,
    fontWeight: '600',
  },
  imgSubTitle: {
    color: color.gray,
    fontSize: 13,
    fontWeight: '300',
    marginVertical: 4,
  },
  imgPriceTitle: {
    color: color.theme,
    fontWeight: '600',
  },
  rightIconNumber: {
    position: 'absolute',
    backgroundColor: '#cecece',
    right: 0,
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    right: -5,
  },
  noOfItemTxt: {
    color: '#000',
    fontSize: 10,
  },
});
