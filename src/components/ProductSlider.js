import { ActivityIndicator, Alert, Animated as Anim, Dimensions, FlatList, I18nManager, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
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




// const images = [{
//     // Simplest usage.
//     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',


// },]

const ProductSlider = ({ carouselRef, currentIndex, setCurrentIndex, data, setImgUrl, item }) => {
    const dispatch = useDispatch()
    const [modalVisible, setModalVisible] = useState(false);
    const [loader, setLoader] = useState(true);

    const favoriteList = useSelector((state) => state?.favorite?.AddInFavorite)
    const isFavorite = favoriteList.some(favorite => favorite.pid === item.pid);


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

    const handleSnapToItem = (index) => {
        setCurrentIndex(index)
        setImgUrl(data[index]?.image_url);
    }
    const favoriteProduct = (item) => {
        if (isFavorite) {
            dispatch(removeFavorite({
                id: item?.pid
            }))
        } else {

            dispatch(productFavorite({
                price: item?.price,
                pid: item?.pid,
                productName: item?.name,
                description: removeHTMLCode(item?.description),
                image: item?.image
            }))
        }
    }


    const renderItem1 = ({ item, index }) => {
        return (
            <View style={styles.renderItem1_container}>
                {
                    data?.length > 1 &&
                    <TouchableOpacity
                        style={[styles.iconCommon, styles.iconLeft]}
                        onPress={() => {
                            if (carouselRef.current) {
                                const previousIndex = index > 0 ? index - 1 : data.length - 1;
                                carouselRef.current.snapToItem(previousIndex);
                            }
                        }}
                    >
                        <ExportSvg.Arrow2 style={{ transform: [{ rotate: I18nManager.isRTL ? "180deg" : "0deg" }] }} />
                    </TouchableOpacity>

                }


                {
                    loader &&
                    <View style={[styles.renderItem1_img, { marginBottom: 10, borderColor: "#cecece", marginRight: 5, alignItems: "center", justifyContent: "center", borderRadius: 20, position: "absolute", zIndex: 100 }]} >
                        <ActivityIndicator size="large" color={color.theme} style={styles.loader} />
                    </View>

                }
                <TouchableOpacity activeOpacity={1} onPress={() => setModalVisible(true)} style={styles.renderItem1_img}>
                    <Image onLoad={() => setLoader(false)} onError={() => setLoader(false)} resizeMode='cover' source={{ uri: item?.image_url }} style={styles.renderItem1_img} />
                </TouchableOpacity>

                {
                    data?.length > 1 &&
                    <TouchableOpacity
                        style={[styles.iconCommon, styles.iconRight]}
                        onPress={() => {
                            if (carouselRef.current) {
                                const nextIndex = index < data.length - 1 ? index + 1 : 0;
                                carouselRef.current.snapToItem(nextIndex);
                            }
                        }}
                    >
                        <ExportSvg.Arrow1 style={{ transform: [{ rotate: I18nManager.isRTL ? "180deg" : "0deg" }] }} />
                    </TouchableOpacity>

                }

            </View>
        );
    };





    return (
        <GestureHandlerRootView>
            <View style={styles.carouselContainer}>
                <Carousel
                    ref={carouselRef}
                    layout={"default"}
                    data={data}
                    renderItem={renderItem1}
                    sliderWidth={Dimensions.get('screen').width}
                    itemWidth={Dimensions.get('screen').width}
                    onSnapToItem={handleSnapToItem}
                />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", top: -30 }}>
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
            </View>

            <TouchableOpacity onPress={() => favoriteProduct(item)} style={{ right: 15, position: "absolute", bottom: 20 }}>
                {
                    isFavorite ?
                        <ExportSvg.LoveColorFav />
                        :
                        <ExportSvg.LoveFav />
                }
            </TouchableOpacity>


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
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{ height: 30, width: 30, backgroundColor: color.theme, borderRadius: 50, alignItems: "center", justifyContent: "center", position: "absolute", zIndex: 1000, top:Platform.OS == 'ios'? 50:30, left:Platform.OS=='ios'? 30:20 }}>
                            <Entypo name={'cross'} size={20} color={color.white} />
                        </TouchableOpacity>
                        <ImageViewer imageUrls={images} />

                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    )
}

export default ProductSlider

const styles = StyleSheet.create({


    renderItem1_container: {
    },


    renderItem1_img: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height / 2 - 20,
    },

    carouselContainer: {
        alignItems: "center",
        // padding: 20,
        marginVertical: 10
    },

    iconLeft: {
        left: -15,

    },
    iconRight: {
        right: -15,
    },
    iconCommon: {
        position: 'absolute',
        top: '42%',
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
})

