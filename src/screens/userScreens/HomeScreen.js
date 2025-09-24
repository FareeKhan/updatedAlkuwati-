import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  I18nManager,
} from 'react-native';
import React, {useEffect, useState, useRef, Suspense} from 'react';
import ExportSvg from '../../constants/ExportSvg';
import {color} from '../../constants/color';

import {
  homeBanner,
  categoriesListSubTwoCategory,
  getFeaturedData,
  newArrivalsData,
} from '../../services/UserServices';
import Text from '../../components/CustomText';

import SingleProductCard from '../../components/SingleProductCard';
import SearchModal from '../../components/SearchModal';

const {width} = Dimensions.get('screen');
const ITEM_WIDTH = Dimensions.get('window').width * 0.8;
const ITEM_MARGIN = Dimensions.get('window').width * 0.1;
import {useTranslation} from 'react-i18next';
import * as Animatable from 'react-native-animatable';

import RNBounceable from '@freakycoder/react-native-bounceable';
import withPressAnimated from './hocs/withPressAnimated';
import registercustomAnimations, {ANIMATIONS} from './animations';
import {useSelector} from 'react-redux';
import HeaderBox from '../../components/HeaderBox';
import SliderDots from '../../components/SliderDots';
import ScreenLoader from '../../components/ScreenLoader';
import SameProduct from './SameProduct';
import FastImage from 'react-native-fast-image';
import { locationPermission } from '../../constants/helper';
import RenderArrivalItem from '../../components/RenderArrivalItem';
import RenderCategories from '../../components/RenderCategories';
import RenderFeature from '../../components/RenderFeature';

const screenWidth = Dimensions.get('window').width;

registercustomAnimations();
const AnimatedPressButton = withPressAnimated(RNBounceable);

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();

  const [banner, setBanner] = useState([]);
  const [secBanners, setSecBanners] = useState([]);
  const [zeroIndexBanner, setZeroIndexBanner] = useState([]);
  const [arrivalData, setArrivalData] = useState([]);
  const [getCategoies, setCategoies] = useState([]);
  const [loader, setLoader] = useState(false);
  const [featureData, setFeatureData] = useState([]);
  const [SameScreenId, setSameScreenId] = useState('');
  const [imageHeights, setImageHeights] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  useEffect(() => {
    fetchAllApi();

  }, []);

  const fetchAllApi = async () => {
    setLoader(true);
    try {
      const [topBanner, catSection, featureArray, arrivalData] =
        await Promise.all([
          homeBanner(),
          categoriesListSubTwoCategory(),
          getFeaturedData(),
          newArrivalsData(),
        ]);

      if (topBanner?.status) {
        const mainBanners = topBanner?.data?.filter(
          (item, index) => item?.banner_type !== 'section_banner',
        );
        const secondaryBanners = topBanner?.data?.filter(
          (item, index) => item?.banner_type == 'section_banner',
        );

        const zeroBanner = topBanner?.data?.filter(
          (item, index) =>
            item?.banner_type == 'section_banner' &&
            item?.show_after_section_number == 0,
        );
        setBanner(mainBanners);
        setSecBanners(secondaryBanners);
        setZeroIndexBanner(zeroBanner);
      }

      if (catSection?.status) {
        setCategoies(catSection?.data);
      }

      if (featureArray?.status) {
        setFeatureData(featureArray?.data);
      }

      if (featureArray?.status) {
        setFeatureData(featureArray?.data);
      }

      if (arrivalData?.status == 'success') {
        setArrivalData(arrivalData?.data);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    secBanners?.forEach(banner => {
      if (!imageHeights[banner.id]) {
        Image.getSize(
          banner.image,
          (width, height) => {
            const calculatedHeight = (screenWidth * height) / width;
            setImageHeights(prev => ({...prev, [banner.id]: calculatedHeight}));
          },
          error => console.log('Error loading image size:', error),
        );
      }
    });
  }, [secBanners]);

  const renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            // navigation.navigate('SameProduct', {
            //   text: item?.link_category,
            //   subC_ID: item?.id,
            // })

            setSameScreenId(item?.link_category)
          }>
          <View style={[styles.item, {marginHorizontal: ITEM_MARGIN * 0.1}]}>
            <ImageBackground
              source={{uri: item?.image}}
              style={{width: width / 1.3, height: 160}}
              borderRadius={20}>
              <View style={{paddingLeft: 15, paddingTop: 20}}>
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
      </View>
    );
  };

  const renderItemNewList = ({item, index}) => {
 
    return (
      <TouchableOpacity
        // onPress={() => navigation.navigate('SameProduct', {
        //  text: item?.name,
        //   subC_ID: item?.id,
        // })}
        onPress={() => setSameScreenId(item?.id)}
        style={styles.newCatContainer}>
        <FastImage
          source={{
            uri: item?.image,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{width: '100%', height: 150}}>
          <View style={styles.innerNewCatBox}>
            <Text style={styles.txtNewCat}>{item?.name}</Text>
          </View>
        </FastImage>
      </TouchableOpacity>
    );
  };

  if (loader) {
    return <ScreenLoader />;
  }

  return (
    <View style={styles.mainContainer}>
      <HeaderBox
        isDrawer={SameScreenId ? false : true}
        onBackPress={() => setSameScreenId('')}
        cartIcon={true}
      />

      <View style={{flexDirection: 'row'}}>
        <Text style={styles.welcomeTxt}>{t('welcome')}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.subTxt, {color: color.gray}]}>
          {t('welcomeSub')}
        </Text>
      </View>
      <View style={[styles.searchContainer, SameScreenId && {marginBottom: 0}]}>
        <TouchableOpacity
          style={[styles.searchBox]}
          onPress={() => setModalVisible(true)}>
          <ExportSvg.Search
            style={{
              marginLeft: 18,
              marginRight: 10,
            }}
          />
          <Text style={{color: '#00000080'}}>{t('search_here')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Platform.OS == 'ios' ? 70 : 50,
        }}>
        {SameScreenId ? (
          <Suspense fallback={<Text>Loading...</Text>}>

          <View style={{flex: 1, marginTop: Platform.OS == 'ios' ? -80 : -40}}>
            <SameProduct subId={SameScreenId} />
          </View>
          </Suspense>

        ) : (
          <View>
            <View style={{}}>
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

            <View style={{...styles.arrivalBox, marginTop: 15}}>
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
                renderItem={({item,index})=>{
                  return(
                    <RenderCategories  item={item}   index={index} setSameScreenId={setSameScreenId}/>
                  )
                }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 0.2}
                snapToAlignment="start"
                decelerationRate="fast"
              />
            </View>

            <FlatList
              data={featureData}
              keyExtractor={(item, index) => index?.toString()}
              renderItem={renderItemNewList}
                // renderItem={({ item }) => <RenderFeature item={item} />}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: 15,
              }}
              numColumns={2}
            />

            {zeroIndexBanner?.length > 0 && (
              <SliderDots
                setSameScreenId={setSameScreenId}
                data={zeroIndexBanner}
                imageHeights={imageHeights}
              />
            )}

            {/* <View style={{flex: 1}}>
              <FlatList
                // horizontal
                data={arrivalData?.slice(0,2)}
                keyExtractor={(item, index) => index?.toString()}
                // renderItem={renderArrivalItem}
                renderItem={renderArrivalItem}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 0.2}
                snapToAlignment="start"
                decelerationRate="fast"
              />
            </View> */}
            <RenderArrivalItem
            data={arrivalData}
            setSameScreenId={setSameScreenId}
            imageHeights={imageHeights}
            />
          </View>
        )}
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
    paddingTop: Platform.OS == 'ios' ? 70 : 20,
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
    marginTop: 20,
    marginBottom: 20,
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
    width: '100%',
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
    borderColor: '#301A58',
    borderRadius: 10,
    width: 70,
    height: 130,
    marginHorizontal: 2,
    marginVertical: 10,
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
  newCatContainer: {
    width: '48%',
    height: 150,
    borderRadius: 15,
    overflow: 'hidden',
  },
  innerNewCatBox: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  txtNewCat: {
    fontSize: 13,
    color: color.white,
    fontWeight: '500',
    backgroundColor: '#00000050',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});
