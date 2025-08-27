import { ActivityIndicator, Alert, Animated as Anim, Dimensions, FlatList, I18nManager, Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import Carousel from 'react-native-snap-carousel';
import { color } from '../constants/color';
import ExportSvg from '../constants/ExportSvg';
import { useDispatch, useSelector } from 'react-redux';
import { productFavorite, removeFavorite } from '../redux/reducer/AddFavorite';
import CustomText from './CustomText';
import Entypo from 'react-native-vector-icons/Entypo'
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
const { width, height } = Dimensions.get('screen')
import ImageViewer from 'react-native-image-zoom-viewer';
import Video from 'react-native-video';
import YoutubePlayer from 'react-native-youtube-iframe';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FastImage from 'react-native-fast-image';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';


const ProductSlider = ({ variantArray, carouselRef, currentIndex, setSelectedVariant, selectedVariant, setCurrentIndex, data, setImgUrl, item, setSelectedImage, selectedImage }) => {
   const {t} = useTranslation()
   
    const userId = useSelector(state => state.auth?.userId);
 
    const youtubeUrls = typeof item?.youtube_urls === 'string'
        ? JSON.parse(item.youtube_urls || '[]')
        : item?.youtube_urls || [];

    const conCatImages = [
        ...(youtubeUrls.length > 0 ? youtubeUrls : []),
        ...(data?.map((item) => item?.image_url) || [])
    ];


    const playerRef = useRef();
    const dispatch = useDispatch()
    const [modalVisible, setModalVisible] = useState(false);
    const [loader, setLoader] = useState(true);
    const [smallImagesLoader, setSmallImagesLoader] = useState(true);
    const [paused, setPaused] = useState(false);
    const [playing, setPlaying] = useState(false);


    const favoriteList = useSelector((state) => state?.favorite?.AddInFavorite)
    const isFavorite = favoriteList.some(favorite => favorite.id === item.id);

    const images = data?.map((item) => ({ url: item?.image_url }))

    const removeHTMLCode = (value) => {
        if (value) {
            const regex = /(<([^>]+)>)/ig;
            const val = value.replace(regex, "");
            const string = val.replace(/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/ig, "");
            return string;
        }
        return "";
    }

    const favoriteProduct = (item) => {
if(userId){
 if (isFavorite) {
            dispatch(removeFavorite({
                id: item?.id
            }))
        } else {
            dispatch(productFavorite({
                price: item?.price,
                id: item?.id,
                productName: item?.name,
                description: removeHTMLCode(item?.description),
                image: data[0]?.image_url
            }))
        }
}else{
     showMessage({
            type:"warning",
            message:t('loginFavorite')
          })
}
       
    }

    const onStateChange = useCallback((state) => {
        if (state === 'ended') {
            setPlaying(false);
        }
    }, []);


    const renderItem1 = ({ item: mediaItem, index }) => {
        const isVideo = mediaItem?.includes("youtu") || mediaItem?.endsWith(".mp4") || mediaItem?.endsWith(".mov");
        return (
            <View style={styles.renderItem1_container}>
                {
                    loader &&
                    <View style={[styles.renderItem1_img, { marginBottom: 10, borderColor: "#cecece", marginRight: 5, alignItems: "center", justifyContent: "center", borderRadius: 20, position: "absolute", zIndex: 100 }]} >
                        <ActivityIndicator size="large" color={color.theme} style={styles.loader} />
                    </View>
                }


                {
                    isVideo ?
                        <View style={{}}  >
                            <YoutubePlayer
                                ref={playerRef}
                                height={250}
                                play={playing}
                                videoId={
                                    mediaItem?.includes("v=")
                                        ? mediaItem?.split("v=")[1]?.split("&")[0]
                                        : mediaItem?.includes("/embed/")
                                            ? mediaItem?.split("/embed/")[1]?.split("?")[0]
                                            : mediaItem
                                }
                                onChangeState={onStateChange}
                            />

                        </View>
                        :

                        <TouchableOpacity activeOpacity={1} onPress={() => setModalVisible(true)} style={[styles.renderItem1_img]}>

                            <FastImage
                                onLoadEnd={() => setLoader(false)}
                                source={{
                                    uri: selectedImage ? selectedImage : selectedVariant ? selectedVariant?.main_image : mediaItem,
                                    priority: FastImage.priority.high,
                                }}
                                style={{ width: width, height: width, borderRadius: 10 }}
                                resizeMode={FastImage.resizeMode.contain}
                            />

                        </TouchableOpacity>
                }
            </View>
        );
    };


    const handleImageSelection = (item) => {
        console.log('itemitemitem', item)
        setSelectedImage(item)
        setCurrentIndex(item)
        const handleVariantImage = variantArray?.find((i) => i?.main_image == item)
        setSelectedVariant(handleVariantImage)
    }



    const isRTL = I18nManager.isRTL;
    // const displayImages = isRTL ? [...conCatImages].reverse() : conCatImages;
    const displayImages = isRTL ? conCatImages : conCatImages;

    return (
        <GestureHandlerRootView>
            <View style={styles.carouselContainer}>
                <Carousel
                    ref={carouselRef}
                    layout={"default"}
                    data={displayImages}
                    renderItem={renderItem1}
                    sliderWidth={Dimensions.get('screen').width}
                    itemWidth={Dimensions.get('screen').width}
                    autoplayInterval={4000}
                    loop={true}
                    inactiveSlideScale={1}
                    pagingEnabled={true}
                    horizontal={true}
                    useScrollView={true}
                    scrollEnabled={false}
                    // onSnapToItem={(index) => {
                    //     const actualIndex = isRTL ? displayImages.length - 1 - index : index;
                    //     handleSnapToItem(actualIndex);
                    // }}
                    enableMomentum={true}

                />

                {/* {
                    conCatImages?.length > 1 &&
                    <TouchableOpacity
                        style={[styles.iconCommon, styles.iconLeft]}
                        onPress={() => {
                            if (carouselRef.current) {
                                const previousIndex = I18nManager.isRTL
                                    ? currentIndex < conCatImages.length - 1 ? currentIndex + 1 : 0
                                    : currentIndex > 0 ? currentIndex - 1 : conCatImages.length - 1;

                                carouselRef.current.snapToItem(previousIndex);
                                setSelectedImage(null);
                            }
                        }}
                    >
                        <Ionicons name={'arrow-back-circle-outline'} style={{ transform: [{ rotate: I18nManager.isRTL ? "180deg" : "0deg" }] }} size={25} color={"#cecece"} />
                    </TouchableOpacity>
                } */}


                {/* {
                    conCatImages?.length > 1 &&
                    <TouchableOpacity
                        style={[styles.iconCommon, styles.iconRight]}

                        onPress={() => {
                            if (carouselRef.current) {
                                const nextIndex = I18nManager.isRTL
                                    ? currentIndex > 0 ? currentIndex - 1 : conCatImages.length - 1
                                    : currentIndex < conCatImages.length - 1 ? currentIndex + 1 : 0;

                                carouselRef.current.snapToItem(nextIndex);
                                console.log('Next Index:', nextIndex);
                                setSelectedImage(null);
                            }
                        }}
                    >
                        <Ionicons name={'arrow-back-circle-outline'} style={{ transform: [{ rotate: I18nManager.isRTL ? "0deg" : "180deg" }] }} size={25} color={"#cecece"} />

                    </TouchableOpacity>
                } */}

                {/* Favorite Icon */}
                <TouchableOpacity onPress={() => favoriteProduct(item)} style={{ right: 15, position: "absolute", bottom: 20 }}>
                    {
                        isFavorite ?
                            <ExportSvg.LoveColorFav />
                            :
                            <ExportSvg.LoveFav />
                    }
                </TouchableOpacity>

                {/* Dots Style */}
                {/* <View style={{ flexDirection: "row", justifyContent: "center", top: -30 }}>
                    {
                        data?.length > 1 &&
                        data?.map((item, index) => {
                            return (
                                <View key={index} style={{ marginRight: 10 }}>
                                    <View style={{ width: currentIndex == index ? 20 : 7, height: 7, backgroundColor: currentIndex == index ? color.theme : '#CCCCCC', borderRadius: 50 }} />
                                </View >

                            )
                        })
                    }
                </View> */}
            </View>

            {
                conCatImages?.length > 0 &&
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, gap: 10 }} >
                    {
                        conCatImages?.map((item, index) => {
                            return (

                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleImageSelection(item)}

                                    style={{ alignItems: "center", justifyContent: "center", marginBottom: 10, gap: 10, width: 70, height: 70, backgroundColor: "#cecece", borderRadius: 10 }}>

                                    <FastImage
                                        onLoadEnd={() => setSmallImagesLoader(false)}
                                        source={{
                                            uri: item,
                                            priority: FastImage.priority.high,
                                        }}
                                        //    style={[{ width: 70, height: 70, gap: 10, }]}
                                        style={[{ width: 70, height: 70, gap: 10,borderRadius:10 }, currentIndex == item && { borderWidth: 1, borderColor: color.theme }]}

                                        resizeMode={FastImage.resizeMode.contain}
                                    />

                                    {
                                        smallImagesLoader && <View style={{ position: "absolute" }}>
                                            <ActivityIndicator size={'small'} color={color.theme} />
                                        </View>
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            }


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{ height: 30, width: 30, backgroundColor: color.theme, borderRadius: 50, alignItems: "center", justifyContent: "center", position: "absolute", zIndex: 1000, top: Platform.OS == 'ios' ? 50 : 30, left: Platform.OS == 'ios' ? 30 : 20 }}>
                            <Entypo name={'cross'} size={20} color={color.white} />
                        </TouchableOpacity>
                        <ImageViewer imageUrls={images} backgroundColor={'#fff'} />

                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    )
}

export default ProductSlider

const styles = StyleSheet.create({
    renderItem1_container: {
        flex: 1,
    },
    renderItem1_img: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height / 2 - 20,
    },
    carouselContainer: {
        alignItems: "center",
        marginTop: 10
    },

    iconLeft: {
        left: -30,
    },
    iconRight: {
        right: -30,
    },
    iconCommon: {
        position: 'absolute',
        top: '40%',
        transform: [{ translateY: -12 }],
        padding: 20,
        paddingHorizontal: 30,
        zIndex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
    },
    modalView: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    video: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height / 3,
    },
})

