import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import ExportSvg from '../../constants/ExportSvg';
import { color } from '../../constants/color';

import {
  homeBanner,
  newArrivals,
  getSettingOption,
  categoriesListSubTwoCategory,
} from '../../services/UserServices';

import SingleProductCard from '../../components/SingleProductCard';
import SearchModal from '../../components/SearchModal';
import { DrawerActions } from '@react-navigation/native';
import ScreenLoader from '../../components/ScreenLoader';

const { width } = Dimensions.get('screen');
const ITEM_WIDTH = Dimensions.get('window').width * 0.8;
const ITEM_MARGIN = Dimensions.get('window').width * 0.1;
import { useTranslation } from 'react-i18next';
import HeaderLogo from '../../components/HeaderLogo';
import * as Animatable from 'react-native-animatable';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import RNBounceable from '@freakycoder/react-native-bounceable';
import withPressAnimated from './hocs/withPressAnimated';
import registercustomAnimations, { ANIMATIONS } from './animations';
import { useSelector } from 'react-redux';
import HeaderBox from '../../components/HeaderBox';
import LottieView from "lottie-react-native";

registercustomAnimations();
const AnimatedPressButton = withPressAnimated(RNBounceable);

const HomeScreen = ({ navigation }) => {
  const data = useSelector(state => state.cartProducts?.cartProducts);

  const { openDrawer } = navigation;
  const [banner, setBanner] = useState([]);
  const [secBanners, setSecBanners] = useState([]);
  const [arrivalData, setArrivalData] = useState([]);
  const [arrivalDataTwo, setArrivalDataTwo] = useState([]);
  const [arrivalDataThree, setArrivalDataThree] = useState([]);
  const [getCategoies, setCategoies] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [getOption, setOption] = useState();
  const [getOptionNameOne, setOptionNameOne] = useState();
  const [getOptionNameTwo, setOptionNameTwo] = useState();
  const [getOptionNameThree, setOptionNameThree] = useState();
  const [getOptionWhatsApp, setOptionWhatsApp] = useState();
  const [arrivalCategories, setArrivalCategories] = useState([]);

  const viewRef = useRef(null);
  const animation = 'fadeInRightBig';
  const animationMain = 'fadeInRight';
  const durationMain = 100;
  const durationInner = 1000;
  const delayInner = 100;

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  useEffect(() => {
    discountHomeBanner();
    funCategories();
    getSettingOptionShow();
  }, []);

  const getSettingOptionShow = async () => {
    setLoader(true);
    try {
      const result = await getSettingOption();
      console.log('--?>>', result)
      if (result?.status) {
        // setSetting(result?.data);
        let categories = result?.data?.filter((item) => item.name === 'home_category');
        setArrivalCategories(categories);

        categories?.map((item) => {
          console.log(item.value);
          getNewArrivals(item.value);
        });

        // getNewArrivals(result?.data[20].value);
        // getNewArrivals(result?.data[21].value);
        // getNewArrivals(result?.data[22].value);
        // setOption(result?.data);
      }
      // if (result?.status) {
      //   setLoader(false);
      //   getNewArrivals(result?.data[20].value);
      //   getNewArrivalsTwo(result?.data[21].value);
      //   getNewArrivalsThree(result?.data[22].value);
      //   setOption(result?.data);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const funCategories = async () => {
    setLoader(true);
    try {
      const result = await categoriesListSubTwoCategory();

      if (result?.status) {
        setLoader(false);
        setCategoies(result?.data);
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const discountHomeBanner = async () => {
    setLoader(true);
    try {
      const result = await homeBanner();
      if (result?.status) {
        setLoader(false);
        const mainBanners = result?.data?.filter((item, index) => item?.banner_type !== 'section_banner')
        const secondaryBanners = result?.data?.filter((item, index) => item?.banner_type == 'section_banner')
        setBanner(mainBanners);
        setSecBanners(secondaryBanners);
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const getNewArrivals = async name => {

    try {
      const result = await newArrivals(name);
      console.log('-->>trending', result)
      if (result?.status) {
        // setIsLoader(false);
        // setArrivalData(result?.data);
        setArrivalData(prev => [...prev, result?.data]);
        // setOptionNameOne(name);
      } else {
        setIsLoader(false);
      }
    } catch (error) {
      
      setIsLoader(false);
      console.log(error);
    }finally{
      setLoader(false);
    }
  };



  const getNewArrivalsTwo = async name => {
    try {
      const result = await newArrivals(name);
      if (result?.status) {
        setIsLoader(false);
        setArrivalDataTwo(result?.data);
        setOptionNameTwo(name);
      } else {
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      console.log(error);
    }
  };

  const getNewArrivalsThree = async name => {
    try {
      const result = await newArrivals(name);
      if (result?.status) {
        setIsLoader(false);
        setArrivalDataThree(result?.data);
        setOptionNameThree(name);
      } else {
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      console.log(error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <Animatable.View
        animation={animationMain}
        duration={durationInner}
        delay={(1 + index) * delayInner}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('SameProduct', {
              text: 'Shirts2',
              subC_ID: 25,
            })

          }>
          <View style={[styles.item, { marginHorizontal: ITEM_MARGIN * 0.1 }]}>
            <ImageBackground
              source={{ uri: item?.image }}
              style={{ width: width / 1.3, height: 160 }}
              borderRadius={20}>
              <View style={{ paddingLeft: 15, paddingTop: 20 }}>
                {/* <Text style={styles.discountTxt}>{item?.title_line_1}</Text>
                <Text style={styles.discountTitle}>{item?.title_line_2}</Text>
                <Text style={styles.subTitleTxt}>{item?.title_line_3}</Text> */}
                {/* <TouchableOpacity style={styles.getNowBtn} onPress={() => navigation.navigate('CategoriesList')}>
                            <Text style={styles.getNowBtnTxt}>Get Now</Text>
                        </TouchableOpacity> */}
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const renderArrivalItem = ({ item, index }) => {
    return (
      <SingleProductCard
        item={item}
        onPress={() => navigation.navigate('ProductDetails', { id: item?.pid })}
      />
    );
  };

  const renderCategories = ({ item, index }) => {
    return (
      <Animatable.View
        animation={animation}
        duration={durationInner}
        delay={(1 + index) * delayInner}
        style={styles.cateListBox}>
        <AnimatedPressButton
          style={{ alignItems: 'center', marginBottom: 15 }}
          animation="rubberBand"
          mode="contained"
          onPress={() => {
            setTimeout(() => {
              navigation.navigate('SameProduct', {
                text: item?.name,
                subC_ID: item?.id,
              });
            }, 300);

            ReactNativeHapticFeedback.trigger('impactLight');
          }}>
          <ImageBackground
            source={{ uri: item.image }}
            style={{ width: 60, height: 60, marginRight: 5 }}
            borderRadius={10}></ImageBackground>
          <Text
            style={{
              fontSize: 10,
              marginTop: 5,
              textAlign: 'center',
              height: 40,
              paddingHorizontal: 0,
              flexWrap: 'wrap',
              flexShrink: 1,
              color: "#000"
            }}>
            {item?.name}
          </Text>
        </AnimatedPressButton>
      </Animatable.View>
    );
  };
  // || isLoader
  if (loader) {
    return <ScreenLoader />;
  }


  console.log('shehzadData', arrivalData)


  return (
    <View style={styles.mainContainer}>
      <HeaderBox
        isDrawer={true}
        cartIcon={true}
      />



      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.welcomeTxt}>{t('welcome')}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.subTxt, { color: color.gray }]}>
          {t('welcomeSub')}
        </Text>
      </View>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={[styles.searchBox]}
          onPress={() => setModalVisible(true)}>
          {/* <SearchInput 
                    value={search}
                    onChangeText={setSearch}
                    
                    /> */}
          <ExportSvg.Search
            style={{
              marginLeft: 18,
              marginRight: 10,
            }}
          />
          <Text style={{ color: '#00000080' }}>{t('search_here')}</Text>
        </TouchableOpacity>
        {/*<TouchableOpacity onPress={() => navigation.navigate('Filters')}>
                    <ExportSvg.Filter />
                </TouchableOpacity>*/}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Platform.OS == 'ios' ? 70 : 50,
        }}>
        <View style={{ marginRight: -15 }}>
          <FlatList
            horizontal
            data={banner}
            renderItem={renderItem}
            keyExtractor={(item, index) => index?.toString()}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 0.2}
            snapToAlignment="start"
            decelerationRate="fast"
          />
        </View>

        <View style={{ ...styles.arrivalBox, marginTop: 15 }}>
          <Text style={styles.arrivalTxt}>{t('the_categories')}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllProducts')}>
            <Text style={styles.viewTxt}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <FlatList
            horizontal
            data={getCategoies}
            keyExtractor={(item, index) => index?.toString()}
            renderItem={renderCategories}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 0.2}
            snapToAlignment="start"
            decelerationRate="fast"
          //numColumns={2}
          //columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1 }}
          />
        </View>

        {/* <>
          <View style={styles.arrivalBox}>
            <Text style={styles.arrivalTxt}>{getOptionNameOne}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SameProduct', {
                selected: getOptionNameOne,
                subC_ID: 48
              })}>
              <Text style={styles.viewTxt}>{t('view_all')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <FlatList
              horizontal
              data={arrivalData}
              keyExtractor={(item, index) => index?.toString()}
              renderItem={renderArrivalItem}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 0.2}
              snapToAlignment="start"
              decelerationRate="fast"
            //numColumns={2}
            //columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1 }}
            />
          </View>
        </> */}


        {
          arrivalCategories?.map((item, index) => {
            return (
              <>
                {
                  arrivalData[index]?.length > 0 &&
                  <View style={styles.arrivalBox}>
                    <Text style={styles.arrivalTxt}>{item?.value}</Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('SameProduct', {
                        selected: item?.value,
                        subC_ID: 48
                      })}>
                      <Text style={styles.viewTxt}>{t('view_all')}</Text>
                    </TouchableOpacity>
                  </View>

                }


                <View style={{ flex: 1 }}>
                  <FlatList
                    horizontal
                    data={arrivalData[index]}
                    keyExtractor={(item, index) => index?.toString()}
                    renderItem={renderArrivalItem}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 0.2}
                    snapToAlignment="start"
                    decelerationRate="fast"
                  //numColumns={2}
                  //columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1 }}
                  />




                  {secBanners?.map((banner) => {
                    console.log('showmeBannnerssss',banner)
                    return (
                      banner.show_after_section_number === (index) && (
                        // <div className="section-banner my-4" key={`banner-${banner.id}`}>
                        //   <img
                        //     src={banner.image}
                        //     alt={banner.link_category}
                        //     className="img-fluid w-100"
                        //     style={{ maxHeight: '300px', objectFit: 'cover' }}
                        //   />
                        // </div>

                         <Image source={{ uri: banner.image }}    borderRadius={10}           style={{ width: "100%" , height: 180,marginVertical:15 }}/>

                      )
                    )
                  })}
                </View>
              </>
            )
          })
        }



        {/* {arrivalData.length > 0 && (
          <>
            <View style={styles.arrivalBox}>
              <Text style={styles.arrivalTxt}>{getOptionNameOne}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SameProduct', {
                  selected: getOptionNameOne,
                  subC_ID: 48
                })}>
                <Text style={styles.viewTxt}>{t('view_all')}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <FlatList
                horizontal
                data={arrivalData}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderArrivalItem}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 0.2}
                snapToAlignment="start"
                decelerationRate="fast"
              //numColumns={2}
              //columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1 }}
              />
            </View>
          </>
        )}
        {arrivalDataTwo.length > 0 && (
          <>
            <View style={styles.arrivalBox}>
              <Text style={styles.arrivalTxt}>{getOptionNameTwo}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SameProduct', {
                  selected: getOptionNameTwo,
                  subC_ID: 48
                })}
              >
                <Text style={styles.viewTxt}>{t('view_all')}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <FlatList
                horizontal
                data={arrivalDataTwo}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderArrivalItem}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 0.2}
                snapToAlignment="start"
                decelerationRate="fast"
              //numColumns={2}
              //columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1 }}
              />
            </View>
          </>
        )}
        {arrivalDataThree.length > 0 && (
          <>
            <View style={styles.arrivalBox}>
              <Text style={styles.arrivalTxt}>{getOptionNameThree}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SameProduct', {
                  selected: getOptionNameThree,
                  subC_ID: 48
                })}
              >
                <Text style={styles.viewTxt}>{t('view_all')}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <FlatList
                horizontal
                data={arrivalDataThree}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderArrivalItem}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 0.2}
                snapToAlignment="start"
                decelerationRate="fast"
              //numColumns={2}
              //columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1 }}
              />
            </View>
          </>
        )} */}
      </ScrollView>

      <SearchModal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        navigation={navigation}
      />
    </View>
  );
};

export default HomeScreen;

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
    marginBottom: 5,
    marginTop: 15,
    paddingHorizontal: 0,
  },
  welcomeTxt: {
    fontSize: 25,
    fontWeight: '600',
    color: color.theme,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'capitalize',
  },
  subTxt: {
    fontSize: 20,
    fontWeight: '600',
    color: color.gray,
    fontFamily: 'Montserrat-SemiBold',
    textTransform: 'capitalize',
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
    marginTop: 0,
    marginBottom: 10,
  },
  arrivalTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: color.theme,
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
    fontFamily: 'Montserrat-SemiBold',
  },
  arrivalSubTitle: {
    color: color.gray,
    // fontWeight: "300",
    marginVertical: 2,
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
  },
  arrivalPrice: {
    color: color.theme,
    // fontWeight: "500",
    fontFamily: 'Montserrat-SemiBold',
  },
  cateListBox: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation: 9,
    borderColor: '#301A58',
    borderRadius: 10,
    width: 70,
    height: 130,
    marginHorizontal: 2,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },

  item: {
    width: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#ccc',
    paddingHorizontal: 20,
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
