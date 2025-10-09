import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  InteractionManager,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import ExportSvg from '../../constants/ExportSvg';
import {color} from '../../constants/color';
import SingleProductCard from '../../components/SingleProductCard';
import Text from '../../components/CustomText';
import SearchModal from '../../components/SearchModal';
import {
  preloadImagesInBatches,
  extractProductImages,
  isImagePreloaded,
  PRIORITY,
  CACHE,
} from '../../utils/ImagePreloader';

const ITEM_WIDTH = Dimensions.get('window').width * 0.8;

import Animated, {
  FadeInDown,
  FadeInRight,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';
import {categoriesListSub} from '../../services/UserServices';
import EmptyScreen from '../../components/EmptyScreen';
import {useTranslation} from 'react-i18next';

import HeaderBox from '../../components/HeaderBox';
import {fonts} from '../../constants/fonts';
import {useNavigation} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import CustomLoader from '../../components/CustomLoader';

const SameProduct = ({route, subId}) => {
  const navigation = useNavigation();
  const {text, subC_ID} = route?.params || '';

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoader, setIsLoader] = useState(true);
  const [productLoader, setProductLoader] = useState(false);
  const [selectedCat, setSelectedCat] = useState(subC_ID || subId);
  const [storeCategories, setStoreCategories] = useState([]);
  const [preloadedImages, setPreloadedImages] = useState({});
  const [visibleItems, setVisibleItems] = useState([]);
  const [allCategoriesProducts, setAllCategoriesProducts] = useState({});
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [categoryLoadProgress, setCategoryLoadProgress] = useState({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [imageLoadingProgress, setImageLoadingProgress] = useState(0);
  const [lastLoadedCategoryId, setLastLoadedCategoryId] = useState(null);
  const [preloadingQueue, setPreloadingQueue] = useState([]);
  const abortControllerRef = useRef();
  const isMountedRef = useRef(true);
  const {t} = useTranslation();

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 20,
    minimumViewTime: 100,
  };

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    const visibleItemIds = viewableItems.map(item => item.item.id);
    setVisibleItems(visibleItemIds);

    const newImagesToPreload = viewableItems
      .filter(viewableItem => !preloadedImages[viewableItem.item.id])
      .map(viewableItem => viewableItem.item.image)
      .filter(Boolean);

    if (newImagesToPreload.length > 0) {
      preloadImagesInBatches(newImagesToPreload);

      const newPreloaded = {...preloadedImages};
      viewableItems.forEach(viewableItem => {
        if (viewableItem.item.id) {
          newPreloaded[viewableItem.item.id] = true;
        }
      });
      setPreloadedImages(prev => ({...prev, ...newPreloaded}));
    }
  }).current;

  useEffect(() => {
    getCatList();
    // Cleanup function to abort any pending requests when unmounting
    return () => {
      setTimeout(() => {
        isMountedRef.current = false;
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 500);
    };
  }, []);

  useEffect(() => {
    // If we have subcategories but no selectedCat is active yet, select the first one
    if (storeCategories?.subcategories?.length > 0) {
      const firstSubCat = storeCategories.subcategories[0];
      console.log(
        'Available subcategories:',
        storeCategories.subcategories.map(cat => cat.id),
      );

      // If no category is selected or the selected one isn't in the list, select the first one
      const isSelectedCatInList = storeCategories.subcategories.some(
        cat => parseInt(cat.id) === parseInt(selectedCat),
      );

      if (!isSelectedCatInList && firstSubCat?.id) {
        console.log(
          `Auto-selecting first subcategory: ${firstSubCat.id} (${firstSubCat.name})`,
        );
        handleSubCategory(firstSubCat.id);
      }
    }
  }, [storeCategories?.subcategories]);

  useEffect(() => {
    if (preloadingQueue.length > 0 && !backgroundLoading) {
      const processQueue = async () => {
        setBackgroundLoading(true);

        try {
          const nextBatch = preloadingQueue[0];
          console.log(
            `Processing preload queue: ${nextBatch.images.length} images for category ${nextBatch.categoryId}`,
          );

          // Preload images with lower priority since this is background work
          await preloadImagesInBatches(
            nextBatch.images,
            8, // Larger batch size for background loading
            null, // No progress tracking for background loading
            {
              priority: PRIORITY.LOW,
              cache: CACHE.IMMUTABLE,
            },
          );

          if (isMountedRef.current) {
            // Update the category loading progress
            setCategoryLoadProgress(prev => ({
              ...prev,
              [nextBatch.categoryId]: 'complete',
            }));

            // Remove the processed batch from queue
            setPreloadingQueue(prev => prev.slice(1));
          }
        } catch (error) {
          console.log('Error processing preload queue:', error);
        } finally {
          if (isMountedRef.current) {
            setBackgroundLoading(false);
          }
        }
      };

      processQueue();
    }
  }, [preloadingQueue, backgroundLoading]);

  useEffect(() => {
    if (Object.keys(allCategoriesProducts).length > 0) {
      console.log('Preloaded categories:', Object.keys(allCategoriesProducts));
    }
  }, [allCategoriesProducts]);

  const updateImageLoadingProgress = (current, total) => {
    const progress = Math.round((current / total) * 100);
    setImageLoadingProgress(progress);
  };

  const getCatList = async () => {
    setProductLoader(true);
    setIsLoader(true); // Ensure loader is visible

    try {
      const response = await categoriesListSub(selectedCat);
      if (response?.status) {
        setStoreCategories(response?.data);
        setLastLoadedCategoryId(selectedCat); // Track which category was loaded

        // Preload ALL products from selected category
        if (response?.data?.products && response.data.products.length > 0) {
          const allProducts = response.data.products;
          const totalProducts = allProducts.length;
          const imagesToPreload = extractProductImages(allProducts);
          const totalImages = imagesToPreload.length;

          // Remove fixed delay, only wait for images to load
          const preloadPromise = preloadImagesInBatches(
            imagesToPreload,
            5, // Batch size
            (completed, total) => updateImageLoadingProgress(completed, total),
            {priority: PRIORITY.HIGH}, // High priority for initial visible content
          );

          // Wait for image preloading to complete
          await preloadPromise;

          // Mark all images as preloaded
          const preloaded = {};
          allProducts.forEach(product => {
            if (product.id && product.image) {
              preloaded[product.id] = true;
            }
          });
          setPreloadedImages(preloaded);

          // Store current category products
          setAllCategoriesProducts(prev => ({
            ...prev,
            [selectedCat]: response.data.products,
          }));

          // Mark initial loading as complete - this will hide the loader
          setInitialLoadComplete(true);
          setIsLoader(false);
          setProductLoader(false);
        } else {
          // No products to load, so mark as complete
          setInitialLoadComplete(true);
          setIsLoader(false);
          setProductLoader(false);
        }

        // Start background loading of other subcategories AFTER the main category is loaded
        // This runs asynchronously and won't prevent hiding the loader
        if (
          response?.data?.subcategories &&
          response.data.subcategories.length > 0
        ) {
          // Start preloading all subcategories immediately
          startPreloadingAllSubcategories(
            response.data.subcategories,
            selectedCat,
          );
        }
      } else {
        setInitialLoadComplete(true); // Mark as complete even if error
        setIsLoader(false);
        setProductLoader(false);
      }
    } catch (error) {
      console.log(error);
      setInitialLoadComplete(true); // Mark as complete even if error
      setIsLoader(false);
      setProductLoader(false);
    }
    //  finally {
    //   setProductLoader(false);
    //   setIsLoader(false);
    // }
  };

  const startPreloadingAllSubcategories = (subcategories, currentCatId) => {
    // Skip subcategories that are already loaded or are the current category
    const subcatsToLoad = subcategories.filter(
      subcat => subcat.id !== currentCatId && !allCategoriesProducts[subcat.id],
    );

    if (subcatsToLoad.length === 0) return;

    console.log(
      `Adding ${subcatsToLoad.length} subcategories to preload queue`,
    );

    // Create a new AbortController for these requests
    abortControllerRef.current = new AbortController();
    const {signal} = abortControllerRef.current;

    // Update progress tracking
    const newProgress = {};
    subcatsToLoad.forEach(subcat => {
      newProgress[subcat.id] = 'pending';
    });
    setCategoryLoadProgress(prev => ({...prev, ...newProgress}));

    // Load all subcategories in parallel but process their images in the background queue
    subcatsToLoad.forEach(async subcat => {
      if (!isMountedRef.current || signal.aborted) return;

      try {
        setCategoryLoadProgress(prev => ({...prev, [subcat.id]: 'loading'}));
        const subcatResponse = await categoriesListSub(subcat.id, signal);

        if (
          subcatResponse?.status &&
          subcatResponse?.data?.products &&
          subcatResponse.data.products.length > 0
        ) {
          // Store the products for this subcategory
          setAllCategoriesProducts(prev => ({
            ...prev,
            [subcat.id]: subcatResponse.data.products,
          }));

          // Extract images to preload
          const subcatProducts = subcatResponse.data.products;
          const subcatImages = extractProductImages(subcatProducts);

          if (
            subcatImages.length > 0 &&
            !signal.aborted &&
            isMountedRef.current
          ) {
            // Add to preloading queue instead of loading immediately
            setPreloadingQueue(prev => [
              ...prev,
              {
                categoryId: subcat.id,
                images: subcatImages,
              },
            ]);

            // Mark products as having their images queued for preloading
            const newPreloaded = {};
            subcatProducts.forEach(product => {
              if (product.id) {
                newPreloaded[product.id] = true;
              }
            });
            setPreloadedImages(prev => ({...prev, ...newPreloaded}));
          }
        } else {
          setCategoryLoadProgress(prev => ({...prev, [subcat.id]: 'error'}));
        }
      } catch (err) {
        if (!signal.aborted && isMountedRef.current) {
          console.log(`Error loading subcategory ${subcat.id}:`, err);
          setCategoryLoadProgress(prev => ({...prev, [subcat.id]: 'error'}));
        }
      }
    });
  };

  // const CardShadow = () => {
  //   const renderCardItem = useCallback(() => {
  //     return (
  //       <Animated.View
  //         entering={FadeInDown}
  //         style={{
  //           marginBottom: 10,
  //           borderColor: '#cecece',
  //           width: 170,
  //           height: 200,
  //           marginRight: 5,
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           borderRadius: 20,
  //           zIndex: 100,
  //           top: 10,
  //         }}>
  //         <SkeletonPlaceholder borderRadius={4}>
  //           <View
  //             style={{
  //               borderWidth: 1,
  //               borderColor: '#eee',
  //               width: 170,
  //               height: 200,
  //               marginBottom: 10,
  //               borderRadius: 10,
  //             }}>
  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //                 justifyContent: 'space-between',
  //                 alignItems: 'center',
  //                 marginHorizontal: 10,
  //                 marginTop: 10,
  //               }}>
  //               <View width={25} height={25} borderRadius={50} style={{}} />
  //               <View width={25} height={25} borderRadius={50} style={{}} />
  //             </View>

  //             <View
  //               style={{
  //                 height: 150,
  //                 width: '100%',
  //                 marginTop: 'auto',
  //                 borderRadius: 0,
  //                 borderBottomLeftRadius: 10,
  //                 borderBottomRightRadius: 10,
  //               }}
  //             />
  //           </View>
  //         </SkeletonPlaceholder>
  //       </Animated.View>
  //     );
  //   });
  //   return (
  //     <View>
  //       <FlatList
  //         data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
  //         numColumns={2}
  //         keyExtractor={(item, index) => index?.toString()}
  //         renderItem={renderCardItem}
  //         columnWrapperStyle={{justifyContent:"space-between"}}
  //       />
  //     </View>
  //   );
  // };

  const SkeletonCard = React.memo(() => {
    return (
      <Animated.View
        entering={FadeInDown}
        style={{
          marginBottom: 10,
          borderColor: '#cecece',
          width: 170,
          height: 200,
          marginRight: 5,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          zIndex: 100,
          top: 10,
        }}>
        <SkeletonPlaceholder borderRadius={4}>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#eee',
              width: 170,
              height: 200,
              marginBottom: 10,
              borderRadius: 10,
            }}>
            {/* Header row */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 10,
                marginTop: 10,
              }}>
              <View width={25} height={25} borderRadius={50} />
              <View width={25} height={25} borderRadius={50} />
            </View>

            {/* Bottom section */}
            <View
              style={{
                height: 150,
                width: '100%',
                marginTop: 'auto',
                borderRadius: 0,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            />
          </View>
        </SkeletonPlaceholder>
      </Animated.View>
    );
  });
  const CardShadow = () => {
    // Static data (memoized once)
    const data = useMemo(() => Array.from({length: 10}, (_, i) => i + 1), []);

    // FlatList renderItem (returns memoized component)
    const renderItem = useCallback(() => <SkeletonCard />, []);

    return (
      <View>
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={item => item.toString()}
          renderItem={renderItem}
          removeClippedSubviews
          initialNumToRender={6} // ⚡ improves perf
          maxToRenderPerBatch={6} // ⚡ limits background renders
          windowSize={5} // ⚡ controls how many screens worth are kept
        />
      </View>
    );
  };

  const HorizontalShadow = () => {
    return (
      <View>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginRight: 10}}
          contentContainerStyle={{}}
          keyExtractor={(item, index) => index?.toString()}
          renderItem={({}) => {
            return (
              <View style={{}} entering={SlideOutRight}>
                <SkeletonPlaceholder borderRadius={4}>
                  <View
                    style={{
                      width: 130,
                      height: 45,
                      marginBottom: 10,
                      borderRadius: 50,
                      marginRight: 10,
                    }}></View>
                </SkeletonPlaceholder>
              </View>
            );
          }}
        />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    const isPreloaded = preloadedImages[item.id] || false;

    return (
      <>
        <SingleProductCard
          item={item}
          countList={1 + index}
          isDot={false}
          isShowPlusIcon={true}
          isPreloaded={isPreloaded}
          stockAvailable={item?.quantity > 0}
          hasVariant={item?.has_variants > 0}
          onPress={() =>
            navigation.navigate('ProductDetails', {
              id: item?.id,
              selectedCat: item?.name,
            })
          }
        />
      </>
    );
  };

  const handleSubCategory = id => {
    console.log(`Switching from category ${selectedCat} to ${id}`);

    if (id !== selectedCat) {
      // Always update selectedCat immediately for UI highlighting
      setSelectedCat(id);

      // If we have the products cached, use them immediately without showing a loader
      if (allCategoriesProducts[id] && allCategoriesProducts[id].length > 0) {
        console.log(`Using cached data for category ${id}, no loader needed`);

        // Preserve the existing subcategories list and category info when switching
        setStoreCategories(prev => {
          // Get the full category data to ensure we maintain proper structure
          // If we don't have current category name, get it from API silently in background
          if (!prev.category || prev.category.id !== id) {
            categoriesListSub(id).then(response => {
              if (response?.status && isMountedRef.current) {
                // Just update category metadata, not products (to avoid flicker)
                setStoreCategories(current => ({
                  ...current,
                  category: response.data.category,
                  subcategories:
                    response.data.subcategories || current.subcategories,
                }));
              }
            });
          }

          // Use cached products immediately
          return {
            ...prev,
            products: allCategoriesProducts[id],
          };
        });

        // Check if images are already preloaded
        const productsToCheck = allCategoriesProducts[id];
        const imagesToCheck = extractProductImages(productsToCheck);
        const allImagesPreloaded = imagesToCheck.every(img =>
          isImagePreloaded(img),
        );

        if (!allImagesPreloaded) {
          console.log(
            `Some images for category ${id} need preloading, doing it silently`,
          );
          // Silently preload or refresh images in background without showing loader
          preloadImagesInBatches(
            imagesToCheck,
            8, // Larger batch for already cached categories
            null, // No progress tracking for silent preloading
            {
              priority: PRIORITY.HIGH, // High priority for current view
              skipCache: false, // Skip already preloaded images
            },
          );
        }

        // Mark these images as preloaded
        const newPreloaded = {};
        allCategoriesProducts[id].forEach(product => {
          if (product.id && product.image) {
            newPreloaded[product.id] = true;
          }
        });
        setPreloadedImages(prev => ({...prev, ...newPreloaded}));

        // Get subcategories and start background loading if needed
        categoriesListSub(id).then(response => {
          if (
            response?.status &&
            response?.data?.subcategories &&
            isMountedRef.current
          ) {
            // Start background loading of other subcategories
            startPreloadingAllSubcategories(response.data.subcategories, id);
          }
        });
      } else {
        // For non-cached categories, show loader during loading
        console.log(`No cached data for category ${id}, showing loader`);
        setInitialLoadComplete(false);
        setImageLoadingProgress(0);
        setProductLoader(true);
        setIsLoader(true);

        // We don't have these products cached, so fetch them
        categoriesListSub(id)
          .then(response => {
            if (response?.status && isMountedRef.current) {
              setStoreCategories(response?.data);
              setLastLoadedCategoryId(id); // Track which category was loaded

              if (response?.data?.products) {
                setAllCategoriesProducts(prev => ({
                  ...prev,
                  [id]: response.data.products,
                }));

                // Preload ALL images from the fetched products
                const imagesToPreload = extractProductImages(
                  response.data.products,
                );

                // Remove fixed delay, only wait for images to load
                const preloadPromise = preloadImagesInBatches(
                  imagesToPreload,
                  5,
                  (completed, total) =>
                    updateImageLoadingProgress(completed, total),
                  {priority: PRIORITY.HIGH}, // High priority for visible content
                );
                // Wait for image preloading to complete
                return preloadPromise.then(() => {
                  if (!isMountedRef.current) return;

                  const newPreloaded = {};
                  response.data.products.forEach(product => {
                    if (product.id && product.image) {
                      newPreloaded[product.id] = true;
                    }
                  });
                  setPreloadedImages(prev => ({...prev, ...newPreloaded}));

                  // Start background loading of other subcategories
                  if (response?.data?.subcategories) {
                    startPreloadingAllSubcategories(
                      response.data.subcategories,
                      id,
                    );
                  }
                  setIsLoader(false);
                  setProductLoader(false);
                });
              }
              setIsLoader(false);
              setProductLoader(false);
            }
          })
          .catch(error => {
            console.log(error);
            setIsLoader(false);
            setProductLoader(false);
          })
          .finally(() => {
            if (isMountedRef.current) {
              setProductLoader(false);
              setInitialLoadComplete(true);
              setIsLoader(false);
            }
          });
      }
    } else {
      console.log(`Already on category ${id}, no action needed`);
    }
  };

  const CHUNK = 4;
  const DELAY = 40;

  const all = useMemo(() => storeCategories?.products ?? [], [storeCategories]);
  const [data, setData] = useState([]);
  const [isFooterLoader, setIsFooterLoader] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    setData([]);
    let i = 0;
    let cancelled = false;
    setIsFooterLoader(true);
    const pump = () => {
      if (cancelled) return;
      const next = all.slice(i, i + CHUNK);
      if (next.length === 0) return console.log('fgarede');
      setData(prev => prev.concat(next));
      i += CHUNK;
      if (i < all.length) {
        console.log('--', i);
        timerRef.current = setTimeout(
          () => InteractionManager.runAfterInteractions(pump),
          DELAY,
        );
      } else {
        setIsFooterLoader(false);
      }
    };

    InteractionManager.runAfterInteractions(pump);
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [all]);

  return (
    <Animated.View entering={SlideInRight} style={{flex: 1}}>
      <View style={styles.mainContainer}>
        {!subId && (
          <>
            <HeaderBox cartIcon={true} />
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
                <Text style={{color: '#00000080'}}>{t('search_here')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={styles.arrivalTxt}>{text}</Text>

        <View style={styles.catBox}>
          {isLoader ? (
            <View>
              <HorizontalShadow />
            </View>
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}
              data={storeCategories?.subcategories}
              extraData={selectedCat}
              renderItem={({item, index}) => {
                const isLoading = categoryLoadProgress[item.id] === 'loading';
                const isLoaded =
                  allCategoriesProducts[item?.id] &&
                  allCategoriesProducts[item?.id].length > 0;
                const isSelected = parseInt(selectedCat) === parseInt(item?.id);

                return (
                  <Animated.View
                    entering={FadeInRight.delay(index * 100).duration(600)}
                    key={`cat-${item.id}`}>
                    <TouchableOpacity
                      onPress={() => handleSubCategory(item?.id)}
                      style={[
                        styles.innerCatBox,
                        isSelected && styles.selectedCategory,
                        isLoaded && !isSelected && styles.preloadedCategory,
                      ]}>
                      <Text
                        style={[styles.catTxt, isSelected && {color: '#fff'}]}>
                        {item?.name}
                        {/* {isLoading ? ' •' : ''} */}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
              keyExtractor={item => `category-${item.id}`}
            />
          )}
        </View>

        {productLoader || isLoader ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={color.theme} />
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              selectedCat + '_' + item.id + '_' + index
            }
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            ListEmptyComponent={
              storeCategories?.products?.length == 0 && (
                <EmptyScreen text={t('no_data_found')} />
              )
            }
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={10}
            removeClippedSubviews={Platform.OS === 'android'}
            updateCellsBatchingPeriod={50}
          />
        )}

        {isFooterLoader &&
          storeCategories?.products?.length > 0 &&
          !isLoader && (
            <View>
              <ActivityIndicator size={'large'} color={color.theme} />
            </View>
          )}

        <SearchModal
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          navigation={navigation}
        />
      </View>
    </Animated.View>
  );
};

export default SameProduct;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 70 : 20,
    marginHorizontal: 10,
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
    textAlign: 'left',
    fontFamily: fonts.semiBold,
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
    width: '100%',
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
  selectedCategory: {
    backgroundColor: color.theme,
    borderColor: color.theme,
  },
  preloadedCategory: {
    borderColor: color.theme + '80', // 50% opacity theme color to indicate preloaded
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  progressText: {
    color: color.theme,
    fontSize: 14,
    marginBottom: 8,
    fontFamily: fonts.medium,
  },
  progressBarOuter: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: color.theme,
  },
  loadingText: {
    marginTop: 10,
    color: color.theme,
    fontFamily: fonts.medium,
  },
});

// import {
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
//   InteractionManager,
//   LogBox,
//   Platform,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
// import ExportSvg from '../../constants/ExportSvg';
// import {color} from '../../constants/color';
// import ScreenLoader from '../../components/ScreenLoader';
// import SingleProductCard from '../../components/SingleProductCard';
// import Text from '../../components/CustomText';
// import SearchModal from '../../components/SearchModal';
// import {
//   preloadImagesInBatches,
//   extractProductImages,
//   isImagePreloaded,
//   markImagesAsPreloaded,
//   PRIORITY,
//   CACHE,
// } from '../../utils/ImagePreloader';
// import Animated, { FadeInRight } from 'react-native-reanimated';

// const ITEM_WIDTH = Dimensions.get('window').width * 0.8;

// import {categoriesListSub} from '../../services/UserServices';
// import EmptyScreen from '../../components/EmptyScreen';
// import {useTranslation} from 'react-i18next';

// import HeaderBox from '../../components/HeaderBox';
// import CustomLoader from '../../components/CustomLoader';
// import {fonts} from '../../constants/fonts';
// import {useNavigation} from '@react-navigation/native';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// const SameProduct = ({route, subId}) => {
//   const navigation = useNavigation();
//   const {text, subC_ID, selected, navID} = route?.params || '';

//   const [modalVisible, setModalVisible] = useState(false);
//   const [isLoader, setIsLoader] = useState(true);
//   const [productLoader, setProductLoader] = useState(false);
//   const [selectedCat, setSelectedCat] = useState(subC_ID || subId);
//   const [storeCategories, setStoreCategories] = useState([]);
//   const [preloadedImages, setPreloadedImages] = useState({});
//   const [allCategoriesProducts, setAllCategoriesProducts] = useState({});
//   const [categoryLoadProgress, setCategoryLoadProgress] = useState({});
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false);
//   const [imageLoadingProgress, setImageLoadingProgress] = useState(0);

//   const {t} = useTranslation();

//   useEffect(() => {
//     getCatList();
//   }, [selectedCat]);

//   const getCatList = async () => {
//     try {
//       const response = await categoriesListSub(selectedCat);
//       console.log('response---',response?.status)
//       if (response?.status) {
//         setStoreCategories(response?.data);
//       }
//     } catch (error) {
//       console.log(error);
//       setInitialLoadComplete(true);
//       setIsLoader(false);
//       setProductLoader(false);
//     }

//   };

//   const CardShadow = () => {
//     return (
//       <View
//         style={{
//           // borderWidth: 1,
//           marginBottom: 10,
//           borderColor: '#cecece',
//           width: 170,
//           height: 200,
//           marginRight: 5,
//           alignItems: 'center',
//           justifyContent: 'center',
//           borderRadius: 20,
//           zIndex: 100,
//           top: 50,
//         }}>
//         {/* <LottieView
//             source={require('../assets/loader.json')} // Local JSON file
//             autoPlay
//             loop
//             style={{width: 100, height: 100, color: 'red'}}
//           /> */}
//         <SkeletonPlaceholder borderRadius={4}>
//           <View
//             style={{
//               borderWidth: 1,
//               width: 170,
//               height: 200,
//               marginBottom: 10,
//               borderRadius: 10,
//             }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginHorizontal: 10,
//                 marginTop: 10,
//               }}>
//               <View width={25} height={25} borderRadius={50} style={{}} />
//               <View width={25} height={25} borderRadius={50} style={{}} />
//             </View>

//             <View
//               style={{
//                 height: 150,
//                 width: '100%',
//                 marginTop: 'auto',
//                 borderRadius: 0,
//                 borderBottomLeftRadius: 10,
//                 borderBottomRightRadius: 10,
//               }}
//             />
//           </View>
//         </SkeletonPlaceholder>
//       </View>
//     );
//   };

//   const renderItem = ({item, index}) => {
//     const isPreloaded = preloadedImages[item.id] || false;

//     return (
//       <>
//         <SingleProductCard
//           item={item}
//           countList={1 + index}
//           isDot={false}
//           isShowPlusIcon={true}
//           isPreloaded={isPreloaded}
//           onPress={() =>
//             navigation.navigate('ProductDetails', {
//               id: item?.id,
//               selectedCat: item?.name,
//             })
//           }
//         />
//       </>
//     );
//   };

// alert('sffff')

//   // const all = useMemo(() => storeCategories?.products ?? [], [storeCategories]);
//   // const [data, setData] = useState([]);
//   // const [isFooterLoader, setIsFooterLoader] = useState(false);

//   // const timerRef = useRef(null);

//   // useEffect(() => {
//   //   setData([]);
//   //   let i = 0;
//   //   let cancelled = false;
//   //   setIsFooterLoader(true);
//   //   const pump = () => {
//   //     if (cancelled) return;
//   //     const next = all.slice(i, i + CHUNK);
//   //     if (next.length === 0) return console.log('fgarede');
//   //     setData(prev => prev.concat(next));
//   //     i += CHUNK;
//   //     if (i < all.length) {
//   //       console.log('--', i);
//   //       timerRef.current = setTimeout(
//   //         () => InteractionManager.runAfterInteractions(pump),
//   //         DELAY,
//   //       );
//   //     } else {
//   //       setIsFooterLoader(false);
//   //     }
//   //   };

//   //   InteractionManager.runAfterInteractions(pump);
//   //   return () => {
//   //     cancelled = true;
//   //     if (timerRef.current) clearTimeout(timerRef.current);
//   //   };
//   // }, [all]);

//   return (
//     <Animated.View
//          entering={FadeInRight}
//       animation={'slideInLeft'}
//       duration={1000}
//       delay={100}
//       style={{flex: 1}}>
//       <View style={styles.mainContainer}>
//         {!subId && (
//           <>
//             <HeaderBox cartIcon={true} />
//             <View style={styles.searchContainer}>
//               <TouchableOpacity
//                 style={[styles.searchBox]}
//                 onPress={() => setModalVisible(true)}>
//                 <ExportSvg.Search
//                   style={{
//                     marginLeft: 18,
//                     marginRight: 10,
//                   }}
//                 />
//                 <Text style={{color: '#00000080'}}>{t('search_here')}</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         )}

//         {/* <Text style={styles.arrivalTxt}>{storeCategories?.category?.name}</Text> */}
//         <Text style={styles.arrivalTxt}>{text}</Text>

//         <View style={styles.catBox}>
//           <FlatList
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{flexGrow: 1}}
//             data={storeCategories?.subcategories}
//             extraData={selectedCat}
//             renderItem={({item, index}) => {
//               const isLoading = categoryLoadProgress[item.id] === 'loading';
//               const isLoaded =
//                 allCategoriesProducts[item?.id] &&
//                 allCategoriesProducts[item?.id].length > 0;
//               const isSelected = parseInt(selectedCat) === parseInt(item?.id);

//               return (
//                 <Animated.View
//                      entering={FadeInRight.delay(index * 100).duration(600)}

//                   key={`cat-${item.id}`}>
//                   <TouchableOpacity
//                     onPress={() => setSelectedCat(item?.id)}
//                     style={[
//                       styles.innerCatBox,
//                       isSelected && styles.selectedCategory,
//                       isLoaded && !isSelected && styles.preloadedCategory,
//                     ]}>
//                     <Text
//                       style={[styles.catTxt, isSelected && {color: '#fff'}]}>
//                       {item?.name}
//                       {isLoading ? ' •' : ''}
//                     </Text>
//                   </TouchableOpacity>
//                 </Animated.View>
//               );
//             }}
//             keyExtractor={item => `category-${item.id}`}
//           />
//         </View>

//         {productLoader ? (
//           <View
//             style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//             <CustomLoader bg={false} colors={color.theme} size={'large'} />
//             <Text style={styles.loadingText}>{t('loading_products')}</Text>
//             {imageLoadingProgress > 0 && (
//               <View style={styles.progressContainer}>
//                 <Text style={styles.progressText}>
//                   {t('loading_images')}: {imageLoadingProgress}%
//                 </Text>
//                 <View style={styles.progressBarOuter}>
//                   <View
//                     style={[
//                       styles.progressBarInner,
//                       {width: `${imageLoadingProgress}%`},
//                     ]}
//                   />
//                 </View>
//               </View>
//             )}
//           </View>
//         ) : (
//           <FlatList
//             // data={storeCategories?.products?.slice(0,2)}
//             data={storeCategories?.products}
//             renderItem={renderItem}
//             keyExtractor={(item, index) =>
//               selectedCat + '_' + item.id + '_' + index
//             }
//             showsVerticalScrollIndicator={false}
//             numColumns={2}
//             columnWrapperStyle={{justifyContent: 'space-between'}}
//             ListEmptyComponent={
//               storeCategories?.products?.length == 0 && (
//                 <EmptyScreen text={t('no_data_found')} />
//               )
//             }
//             // onViewableItemsChanged={handleViewableItemsChanged}
//             // viewabilityConfig={viewabilityConfig}
//             initialNumToRender={6}
//             maxToRenderPerBatch={6}
//             windowSize={10}
//             removeClippedSubviews={Platform.OS === 'android'}
//             updateCellsBatchingPeriod={50}
//             // ListFooterComponent={}
//           />
//         )}

//         {/* {isFooterLoader && (
//           <View>
//             <ActivityIndicator size={'large'} color={color.theme} />
//           </View>
//         )} */}

//         <SearchModal
//           setModalVisible={setModalVisible}
//           modalVisible={modalVisible}
//           navigation={navigation}
//         />
//       </View>
//     </Animated.View>
//   );
// };

// export default SameProduct;

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     paddingTop: Platform.OS == 'ios' ? 70 : 20,
//     marginHorizontal: 10,
//     marginBottom: 80,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//     marginTop: 15,
//     paddingHorizontal: 15,
//   },
//   arrivalTxt: {
//     fontSize: 17,
//     color: color.theme,
//     textAlign: 'left',
//     fontFamily: fonts.semiBold,
//   },
//   arrivalTitle: {
//     fontSize: 15,
//     color: color.theme,
//     marginTop: 5,
//   },
//   arrivalSubTitle: {
//     color: color.gray,
//     marginVertical: 2,
//     fontFamily: 'Montserrat-Regular',
//     fontSize: 13,
//   },
//   arrivalPrice: {
//     color: color.theme,
//     fontFamily: 'Montserrat-SemiBold',
//   },
//   getNowBtn: {
//     backgroundColor: color.theme,
//     paddingVertical: 6,
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     alignSelf: 'flex-start',
//     marginTop: 20,
//   },
//   getNowBtnTxt: {
//     fontWeight: '700',
//     color: '#fff',
//     fontSize: 11,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginVertical: 20,
//   },
//   searchBox: {
//     backgroundColor: color.gray.concat('10'),
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: 50,
//     borderRadius: 30,
//     width: '100%',
//   },
//   discountTxt: {
//     color: color.theme,
//     fontWeight: '700',
//     fontSize: 22,
//   },
//   discountTitle: {
//     color: color.theme,
//     fontWeight: '300',
//     fontSize: 20,
//   },
//   subTitleTxt: {
//     color: color.gray,
//     fontSize: 12,
//     marginTop: 12,
//   },
//   arrivalBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   viewTxt: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: color.gray,
//   },
//   item: {
//     width: ITEM_WIDTH,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     borderColor: '#ccc',
//     paddingHorizontal: 20,
//   },
//   catBox: {
//     flexDirection: 'row',
//     marginVertical: 15,
//   },
//   innerCatBox: {
//     borderWidth: 1,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     marginRight: 10,
//     borderRadius: 50,
//     borderColor: '#ccc',
//   },
//   selectedCategory: {
//     backgroundColor: color.theme,
//     borderColor: color.theme,
//   },
//   preloadedCategory: {
//     borderColor: color.theme + '80', // 50% opacity theme color to indicate preloaded
//   },
//   catTxt: {
//     color: color.theme,
//   },
//   imgTitle: {
//     color: color.theme,
//     fontWeight: '600',
//   },
//   imgSubTitle: {
//     color: color.gray,
//     fontSize: 13,
//     fontWeight: '300',
//     marginVertical: 4,
//   },
//   imgPriceTitle: {
//     color: color.theme,
//     fontWeight: '600',
//   },
//   rightIconNumber: {
//     position: 'absolute',
//     backgroundColor: '#cecece',
//     width: 15,
//     height: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 50,
//     right: -5,
//   },
//   noOfItemTxt: {
//     color: '#000',
//     fontSize: 10,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   progressContainer: {
//     marginTop: 20,
//     width: '80%',
//     alignItems: 'center',
//   },
//   progressText: {
//     color: color.theme,
//     fontSize: 14,
//     marginBottom: 8,
//     fontFamily: fonts.medium,
//   },
//   progressBarOuter: {
//     width: '100%',
//     height: 8,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   progressBarInner: {
//     height: '100%',
//     backgroundColor: color.theme,
//   },
//   loadingText: {
//     marginTop: 10,
//     color: color.theme,
//     fontFamily: fonts.medium,
//   },
// });
