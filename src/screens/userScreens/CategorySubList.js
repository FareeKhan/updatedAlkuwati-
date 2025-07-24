import { Alert, FlatList,  Platform, StyleSheet, Text, Button, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'

import { color } from '../../constants/color'

import RNBounceable from '@freakycoder/react-native-bounceable';
import * as Animatable from 'react-native-animatable';
import { LayoutAnimation, UIManager } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { preloadImagesInBatches } from '../../utils/ImagePreloader';

import withPressAnimated from './hocs/withPressAnimated';
import registercustomAnimations, { ANIMATIONS } from './animations';
import { fonts } from '../../constants/fonts'
const width = Dimensions.get('screen')

registercustomAnimations()
const AnimatedPressButton = withPressAnimated(RNBounceable)

const CategorySubList = ({ navigation, innetCate }) => {
    const { t } = useTranslation();
    const [visibleItems, setVisibleItems] = useState([]);
    const [preloadedImages, setPreloadedImages] = useState({});

    const handleViewRef = useRef(null);
    const viewRef = useRef(null);
    const animationMain = 'fadeInDownBig';
    const durationMain = 100;
    const durationInner = 1000;
    const delayInner = 100;

    useEffect(() => {
        // Preload the first 6 subcategory images when this component mounts
        if (innetCate && innetCate.length > 0) {
            const imagesToPreload = innetCate.slice(0, 6).map(item => item.image).filter(Boolean);
            
            preloadImagesInBatches(imagesToPreload).then(() => {
                // Mark these images as preloaded
                const preloaded = {};
                innetCate.slice(0, 6).forEach(item => {
                    if (item.id && item.image) {
                        preloaded[item.id] = true;
                    }
                });
                setPreloadedImages(preloaded);
            });
        }
    }, [innetCate]);

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
        const isPreloaded = preloadedImages[item.id] || false;
        
        return (
            <>
                <Animatable.View
                    animation={animationMain}
                    duration={durationInner}
                    delay={(1 + index) * delayInner}
                    style={{width:"33%"}}
                >
                   
                    <AnimatedPressButton style={{width:width}} animation='swing' mode="contained"
                        onPress={() => {
                            ReactNativeHapticFeedback.trigger('impactLight');
                            setTimeout(() => {
                                // Preload the product details images when navigating to SameProduct
                                navigation.navigate('SameProduct', {
                                    text: item?.name,
                                    subC_ID: item?.id,
                                });
                            }, 300)
                        }
                        }
                    >
                        <View style={{...styles.itemBox}}>
                            <FastImage 
                                source={{ 
                                    uri: item?.image,
                                    priority: isPreloaded ? FastImage.priority.normal : FastImage.priority.high,
                                    cache: FastImage.cacheControl.immutable
                                }} 
                                style={{ borderRadius: 10, width: '75%', height: 60 }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <Text style={styles.textBox}>{item?.name}</Text>
                        </View>
                    </AnimatedPressButton>
                </Animatable.View>
            </>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <Animatable.View
                ref={viewRef}
                easing={'ease-in-out'}
                style={{ marginTop: -10 }}
                duration={durationMain}>

                <View style={{ marginTop: 0, marginBottom: 0 }}>
                    <View style={styles.containerBox}>
                        <FlatList
                            data={innetCate}
                            numColumns={3}
                            key={(item, index) => index?.toString()}
                            renderItem={renderItem}
                            estimatedItemSize={400}
                            onViewableItemsChanged={handleViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            initialNumToRender={6}
                            maxToRenderPerBatch={6}
                            contentContainerStyle={{gap:40}}
                            windowSize={7}
                            removeClippedSubviews={true}
                            updateCellsBatchingPeriod={50}
                            columnWrapperStyle={{gap:2,width:"100%"}}
                        />
                    </View>
                </View>

            </Animatable.View>
        </View>
    )
}

export default CategorySubList

const styles = StyleSheet.create({
    containerBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    itemBox: {
        width: Platform.OS == 'ios'? 110:105, // is 50% of container width
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
    textBox: { fontSize: 12, marginTop: 8, color: color.theme ,fontFamily:fonts.regular},
    mainContainer: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 20 : 20,
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
