import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  I18nManager,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {color} from '../../constants/color';
import {categoriesList} from '../../services/UserServices';
import ScreenLoader from '../../components/ScreenLoader';
import SearchModal from '../../components/SearchModal';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as Animatable from 'react-native-animatable';
import {LayoutAnimation} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {preloadImagesInBatches} from '../../utils/ImagePreloader';

import CategorySubList from './CategorySubList';
import DrawerSceneWrapper from '../../Navigation/DrawerSceneWrapper';
import HeaderBox from '../../components/HeaderBox';
import EmptyScreen from '../../components/EmptyScreen';
import {fonts} from '../../constants/fonts';


const AllProducts = ({navigation}) => {
  const [storeCat, setStoreCat] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [innetCate, setInnetCate] = useState(0);
  const {t} = useTranslation();

  const [visibleItems, setVisibleItems] = useState([]);
  const [preloadedImages, setPreloadedImages] = useState({});

  const viewRef = useRef(null);
  const animationRight = 'slideInRight';
  const animationLeft = 'slideInLeft';
  const durationMain = 100;
  const durationInner = 1000;
  const delayInner = 100;

  useEffect(() => {
    getCatList();
  }, []);

  onClick = index => {
    const temp = this.state.data.slice();
    temp[index].value = !temp[index].value;
    this.setState({data: temp});
  };

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded: !this.state.expanded});
  };

  const getCatList = async () => {
    setIsLoader(true);
    try {
      const response = await categoriesList();
      if (response?.status) {
        setIsLoader(false);
        setStoreCat(response?.data);

        // Preload images for the first few visible items
        if (response?.data && response.data.length > 0) {
          const imagesToPreload = response.data
            .slice(0, 6)
            .map(item => item.image)
            .filter(Boolean);
          await preloadImagesInBatches(imagesToPreload);

          // Mark these images as preloaded
          const preloaded = {};
          response.data.slice(0, 6).forEach(item => {
            if (item.id && item.image) {
              preloaded[item.id] = true;
            }
          });
          setPreloadedImages(preloaded);
        }
      } else {
        setStoreCat([]);
      }
    } catch (error) {
      setIsLoader(false);
      console.log(error);
    } finally {
      setIsLoader(false);
    }
  };

  const OnBoxT = id => {
    if (innetCate == id) {
      setInnetCate(0);
    } else {
      setInnetCate(id);

      // When a category is selected, preload its subcategories' images
      if (storeCat) {
        const selectedCategory = storeCat.find(cat => cat.id === id);
        if (
          selectedCategory &&
          selectedCategory.childrens &&
          selectedCategory.childrens.length > 0
        ) {
          const subCatImagesToPreload = selectedCategory.childrens
            .slice(0, 6) // Preload first 6 subcategories
            .map(item => item.image)
            .filter(Boolean);

          // Preload these images
          preloadImagesInBatches(subCatImagesToPreload);
        }
      }
    }
    ReactNativeHapticFeedback.trigger('notificationError');
  };

  // Handle visible items for lazy loading
  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    const visibleItemIds = viewableItems.map(item => item.item.id);
    setVisibleItems(visibleItemIds);

    // Preload images for newly visible items that haven't been preloaded yet
    const newImagesToPreload = viewableItems
      .filter(viewableItem => !preloadedImages[viewableItem.item.id])
      .map(viewableItem => viewableItem.item.image)
      .filter(Boolean);

    if (newImagesToPreload.length > 0) {
      preloadImagesInBatches(newImagesToPreload);

      // Mark these images as preloaded
      const newPreloaded = {...preloadedImages};
      viewableItems.forEach(viewableItem => {
        if (viewableItem.item.id) {
          newPreloaded[viewableItem.item.id] = true;
        }
      });
      setPreloadedImages(newPreloaded);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 20,
    minimumViewTime: 100,
  };

  const renderItem = ({item, index}) => {
    const isTextLeft = index % 2 === 0;
    const isPreloaded = preloadedImages[item.id] || false;

    return (
      <>
        <Animatable.View
          animation={isTextLeft ? animationRight : animationLeft}
          duration={durationInner}
          delay={(1 + index) * delayInner}>
          <RNBounceable
            onPress={() => OnBoxT(item?.id)}
            underlayColor="#000"
            bounceEffectIn={1.1}
            bounceEffectOut={1}
            style={{marginTop: 15}}>
            <View
              style={{
                ...styles.bgContainer,
                shadowColor: '#301A58',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,

                borderColor: '#301A58',
                borderRadius: 10,
                backgroundColor: innetCate == item?.id ? '#67300f' : '#dbdfe0',
                flex: 1,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flexDirection: isTextLeft ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '65%'}}>
                  <FastImage
                    source={{
                      uri: item?.image,
                      priority: isPreloaded
                        ? FastImage.priority.normal
                        : FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    style={{borderRadius: 10, width: '99%', height: 98}}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <View
                  style={{
                    width: '35%',
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                  }}>
                  <Text
                    style={{
                      ...styles.titleTxt,
                      color: innetCate == item?.id ? 'white' : '#67300f',
                      fontFamily: fonts.medium,
                    }}>
                    {item?.name}
                  </Text>
                </View>
              </View>
            </View>
          </RNBounceable>
        </Animatable.View>

        {innetCate == item?.id && (
          <View style={{}}>
            <CategorySubList
              innetCate={item?.childrens}
              navigation={navigation}
            />
          </View>
        )}
      </>
    );
  };

  if (isLoader) {
    return <ScreenLoader />;
  }

  const FlatListItemSeparator = () => <View style={styles.line} />;
  return (
    <DrawerSceneWrapper>
      <Animatable.View
        animation={'slideInLeft'}
        duration={1000}
        delay={100}
        style={{flex: 1}}>
        <View style={styles.mainContainer}>
          <HeaderBox cartIcon={true} style={{paddingHorizontal: 20}} />

          <Animatable.View
            ref={viewRef}
            easing={'ease-in-out'}
            style={{paddingHorizontal: 15, marginTop: 30}}
            duration={durationMain}>
            <FlatList
              data={storeCat}
              key={(item, index) => index?.toString()}
              renderItem={renderItem}
              style={{paddingHorizontal: I18nManager.isRTL ? 0 : 15}}
              contentContainerStyle={{paddingBottom: 300}}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={FlatListItemSeparator}
              onViewableItemsChanged={handleViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
              windowSize={10}
              removeClippedSubviews={true}
              updateCellsBatchingPeriod={50}
              ListEmptyComponent={() => <EmptyScreen />}
            />
          </Animatable.View>

          <View>
            <SearchModal
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
              navigation={navigation}
            />
          </View>
        </View>
      </Animatable.View>
    </DrawerSceneWrapper>
  );
};

export default AllProducts;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 70 : 20,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
  },
  line: {
    backgroundColor: 'red',
  },
  bgContainer: {
    width: '100%',
    height: 100,
    marginBottom: 0,
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: '800',
    color: color.theme,
    textTransform: 'capitalize',
  },
});
