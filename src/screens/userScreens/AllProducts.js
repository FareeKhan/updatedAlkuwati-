import { Alert, FlatList, Image, ImageBackground, Platform, StyleSheet, Text, Button, TouchableOpacity, View, I18nManager } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import ExportSvg from '../../constants/ExportSvg'
import SearchInput from '../../components/SearchInput'
import { allProducts } from '../../constants/data'
import { color } from '../../constants/color'
import { categoriesList } from '../../services/UserServices'
import ScreenLoader from '../../components/ScreenLoader'
import SearchModal from '../../components/SearchModal'
import { useDispatch } from 'react-redux'
import { DrawerActions } from '@react-navigation/native'
import HeaderLogo from '../../components/HeaderLogo'
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as Animatable from 'react-native-animatable';
import { LayoutAnimation, UIManager } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FastImage from 'react-native-fast-image'
import { preloadImagesInBatches } from '../../utils/ImagePreloader'

import withPressAnimated from './hocs/withPressAnimated';
import registercustomAnimations, { ANIMATIONS } from './animations';
import CategorySubList from './CategorySubList'
import DrawerSceneWrapper from '../../Navigation/DrawerSceneWrapper'
import HeaderBox from '../../components/HeaderBox'
import EmptyScreen from '../../components/EmptyScreen'


registercustomAnimations()
const AnimatedPressButton = withPressAnimated(RNBounceable)

const AllProducts = ({ navigation }) => {
    const dispatch = useDispatch()
    const [storeCat, setStoreCat] = useState()
    const [isLoader, setIsLoader] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [innetCate, setInnetCate] = useState(0);
    const [itemListAnimation, setItemListAnimation] = useState('');
    const { t } = useTranslation();
    const [data, setData] = useState();
    const [expanded, setExpanded] = useState(false);
    const [show, setShow] = useState(false);
    const [visibleItems, setVisibleItems] = useState([]);
    const [preloadedImages, setPreloadedImages] = useState({});

    const handleViewRef = useRef(null);

    const viewRef = useRef(null);
    const animation = 'fadeInDown';
    const animationMain = 'fadeInDownBig';
    const animationRight = 'slideInRight';
    const animationLeft = 'slideInLeft';
    const durationMain = 100;
    const durationInner = 1000;
    const delayInner = 100;
    const shadowColorDefault = "grey";
    const shadowColorError = "red";
    const IconColorGreen = "green";
    const IconColorRed = "red";
    const IconColorSize = 32;

    useEffect(() => {
        getCatList()
    }, [])

    onClick = (index) => {
        const temp = this.state.data.slice()
        temp[index].value = !temp[index].value
        this.setState({ data: temp })
    }

    toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expanded: !this.state.expanded })
    }

    const getCatList = async () => {
        setIsLoader(true)
        try {
            const response = await categoriesList()
            console.log('===>>>', response)
            if (response?.status) {
                setIsLoader(false)
                setStoreCat(response?.data)

                // Preload images for the first few visible items
                if (response?.data && response.data.length > 0) {
                    const imagesToPreload = response.data.slice(0, 6).map(item => item.image).filter(Boolean);
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
            }else{
                setStoreCat([])

            }
        } catch (error) {
            setIsLoader(false)
            console.log(error)
        } finally {
            setIsLoader(false)
        }
    }

    const OnBoxT = (id) => {
        if (innetCate == id) {
            setInnetCate(0)
        } else {
            setInnetCate(id)

            // When a category is selected, preload its subcategories' images
            if (storeCat) {
                const selectedCategory = storeCat.find(cat => cat.id === id);
                if (selectedCategory && selectedCategory.childrens && selectedCategory.childrens.length > 0) {
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
    }

    // Handle visible items for lazy loading
    const handleViewableItemsChanged = useRef(({ viewableItems }) => {
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
            const newPreloaded = { ...preloadedImages };
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

    const renderItem = ({ item, index }) => {
        const isTextLeft = index % 2 === 0;
        const isPreloaded = preloadedImages[item.id] || false;

        return (
            <>
                <Animatable.View
                    animation={isTextLeft ? animationRight : animationLeft}
                    duration={durationInner}
                    delay={(1 + index) * delayInner}
                >
                    <RNBounceable
                        onPress={() => OnBoxT(item?.id)}
                        underlayColor='#000'
                        bounceEffectIn={1.1}
                        bounceEffectOut={1}
                        style={{ marginTop: 15 }}
                    >
                        <View style={{
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
                            borderRadius: 10, backgroundColor: innetCate == item?.id ? "#67300f" : '#dbdfe0', flex: 1, flexDirection: 'row'
                        }} >

                            <View style={{ flexDirection: isTextLeft ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ width: '65%', }}>
                                    <FastImage
                                        source={{
                                            uri: item?.image,
                                            priority: isPreloaded ? FastImage.priority.normal : FastImage.priority.high,
                                            cache: FastImage.cacheControl.immutable
                                        }}
                                        style={{ borderRadius: 10, width: '99%', height: 98 }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={{
                                    width: '35%',
                                    justifyContent: 'center', paddingHorizontal: 10
                                }}>
                                    <Text style={{ ...styles.titleTxt, color: innetCate == item?.id ? "white" : "#67300f" }}>{item?.name}</Text>
                                </View>
                            </View>
                        </View>

                    </RNBounceable>
                </Animatable.View>

                {innetCate == item?.id &&
                    <View style={{}}>
                        <CategorySubList innetCate={item?.childrens} navigation={navigation} />
                    </View>
                }
            </>
        )
    }

    if (isLoader) {
        return (
            <ScreenLoader />
        )
    }

    const FlatListItemSeparator = () => <View style={styles.line} />;

    return (
        <DrawerSceneWrapper>
            <Animatable.View
                animation={'slideInLeft'}
                duration={1000}
                delay={100}
                style={{ flex: 1 }}
            >
                <View style={styles.mainContainer}>
                    <HeaderBox
                        cartIcon={true}
                        style={{ paddingHorizontal: 20 }}

                    />

                    <Animatable.View
                        ref={viewRef}
                        easing={'ease-in-out'}
                        style={{ paddingHorizontal: 15, marginTop: 30 }}
                        duration={durationMain}>
                        <FlatList
                            data={storeCat}
                            key={(item, index) => index?.toString()}
                            renderItem={renderItem}
                            style={{ paddingHorizontal: I18nManager.isRTL ? 0 : 15, }}
                            contentContainerStyle={{ paddingBottom: 300 }}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={FlatListItemSeparator}
                            onViewableItemsChanged={handleViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            initialNumToRender={6}
                            maxToRenderPerBatch={6}
                            windowSize={10}
                            removeClippedSubviews={true}
                            updateCellsBatchingPeriod={50}
                            ListEmptyComponent={()=><EmptyScreen />}
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
    )
}

export default AllProducts

const styles = StyleSheet.create({
    containerBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    itemBox: {
        width: 105, // is 50% of container width
        height: 100,
        margin: 5,
        shadowColor: '#301A58',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: '#301A58',
        borderRadius: 10, backgroundColor: '#dbdfe0',
    },
    textBox: { fontSize: 12, fontWeight: '500', marginTop: 8, color: color.theme },
    mainContainer: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 70 : 20,
        paddingHorizontal: 0,
        backgroundColor: "#fff",


    },
    line: { backgroundColor: 'red' },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
        marginTop: 15,
        paddingHorizontal: 15,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 20,
        paddingHorizontal: 15,
    },
    searchBox: {
        backgroundColor: color.gray.concat('10'),
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        borderRadius: 30,
        width: "100%",
    },
    leftBox: {
        flex: 1,
        justifyContent: "center",
        paddingLeft: 20,
    },
    rightBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 15
    },
    bgContainer: {
        width: "100%",
        height: 100,
        marginBottom: 0
    },
    titleTxt: {
        fontSize: 16,
        fontWeight: "800",
        color: color.theme,
        textTransform: "capitalize"
    },
    subTxt: {
        fontSize: 12,
        fontWeight: "500",
        color: color.theme,
        marginTop: 3,
        fontFamily: "Montserrat-SemiBold"
    }
})