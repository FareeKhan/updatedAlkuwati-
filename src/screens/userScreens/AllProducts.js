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

import withPressAnimated from './hocs/withPressAnimated';
import registercustomAnimations, { ANIMATIONS } from './animations';
import CategorySubList from './CategorySubList'
import DrawerSceneWrapper from '../../Navigation/DrawerSceneWrapper'


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
            console.log('shobanaaaa', response)
            if (response?.status) {
                setIsLoader(false)
                setStoreCat(response?.data)
            }
        } catch (error) {
            setIsLoader(false)
            console.log(error)
        }
    }

    const OnBoxT = (id) => {
        //itemListAnimation
        if (innetCate == id) {
            setInnetCate(0)
            //setItemListAnimation('')
            /*setTimeout(() => {
                setItemListAnimation('fadeOut');
            }, 1000)*/
        } else {
            setInnetCate(id)
            /*setTimeout(() => {
                setItemListAnimation('fadeInDown');
            }, 200)*/
        }
        //innetCate == id ? {setInnetCate(0)} : setInnetCate(id);
        ReactNativeHapticFeedback.trigger('notificationError');
    }




    const renderItem = ({ item, index }) => {
        const isTextLeft = index % 2 === 0;
        console.log('console', item)
        return (
            <>
                <Animatable.View
                    animation={isTextLeft ? animationRight : animationLeft}
                    duration={durationInner}
                    delay={(1 + index) * delayInner}

                //iterationCount="infinite" direction="alternate"
                >
                    <RNBounceable
                        onPress={() => OnBoxT(item?.id)}
                        underlayColor='#000'
                        bounceEffectIn={1.1}
                        bounceEffectOut={1}
                        style={{ marginTop: 15, /*borderColor:'red',borderWidth:1,borderRadius: 10,*/ }}
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
                                    <Image source={{ uri: item?.image }} style={{ borderRadius: 10, width: '99%', height: 98, objectFit: 'cover', }} />
                                </View>
                                <View style={{
                                    width: '35%',
                                    justifyContent: 'center', paddingHorizontal: 10
                                }}>
                                    <Text style={{ ...styles.titleTxt, color: innetCate == item?.id ? "white" : "#67300f" }}>{item?.name}</Text>
                                    {/* <Text style={{...styles.subTxt,color: innetCate == item?.id ? "white" : "#67300f"}}>{item?.total_products} {t('count_product')}</Text> */}
                                </View>
                            </View>
                        </View>

                    </RNBounceable>
                </Animatable.View>

                {innetCate == item?.id &&
                    <View style={{}}>
                        <CategorySubList innetCate={innetCate} navigation={navigation} />
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
                    <View style={styles.headerContainer}>
                        {/* <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <ExportSvg.MenuBar />
                </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons size={40} name={I18nManager.isRTL ? 'chevron-forward-circle' : 'chevron-back-circle'} color={color.theme} />
                        </TouchableOpacity>
                        <HeaderLogo />
                        <TouchableOpacity onPress={() => navigation.navigate('MyCart')}>
                            <ExportSvg.Cart />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchContainer}>
                        <TouchableOpacity style={[styles.searchBox]} onPress={() => setModalVisible(true)}>
                            <ExportSvg.Search style={{
                                marginLeft: 18,
                                marginRight: 10
                            }} />
                            <Text style={{ color: "#00000080" }}>{t("search_here")}</Text>
                        </TouchableOpacity>
                    </View>

                    <Animatable.View
                        ref={viewRef}
                        easing={'ease-in-out'}
                        style={{ marginTop: -10, paddingHorizontal: 15 }}
                        duration={durationMain}>
                        <FlatList
                            data={storeCat}
                            key={(item, index) => index?.toString()}
                            renderItem={renderItem}
                            style={{ paddingHorizontal: I18nManager.isRTL ? 0 : 15, }}
                            contentContainerStyle={{ paddingBottom: 300 }}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={FlatListItemSeparator}
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
        paddingTop: Platform.OS == 'ios' ? 40 : 20,
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