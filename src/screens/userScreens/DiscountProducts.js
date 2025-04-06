import { Dimensions, FlatList, I18nManager, ImageBackground, LogBox, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import ExportSvg from '../../constants/ExportSvg'
import { color } from '../../constants/color'
import { bags, discountProducts, electronics } from '../../constants/data'
import { getSameProduct, newArrivals, offerBanner } from '../../services/UserServices'
import ScreenLoader from '../../components/ScreenLoader'
import SingleProductCard from '../../components/SingleProductCard'
import HeaderLogo from '../../components/HeaderLogo'
import SearchModal from '../../components/SearchModal'
const { width, height } = Dimensions.get('screen')
const ITEM_WIDTH = Dimensions.get('window').width * 0.8;
const ITEM_MARGIN = Dimensions.get('window').width * 0.1;
import * as Animatable from 'react-native-animatable';
import { categoriesList, fetchCategoryProducts } from '../../services/UserServices';
import EmptyScreen from '../../components/EmptyScreen'
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons'

const DiscountProducts = ({ navigation, route }) => {
    const { t } = useTranslation();
    const text = t('discounts_offer') 
    const [modalVisible, setModalVisible] = useState(false);
    const [storeData, setStoreData] = useState()
    const [OfferBannerList, setOfferBannerList] = useState([])
    const [isLoader, setIsLoader] = useState(false)
    const [selectedCat, setSelectedCat] = useState()
    const [storeCategories, setStoreCategories] = useState()

    const viewRef = useRef(null);
    const animation = 'fadeInRightBig';
    const animationMain = 'fadeInRight';
    const durationMain = 100;
    const durationInner = 1000;
    const delayInner = 100;

    const categoryList = [
        {
            title: "Dresses"
        },
        {
            title: "Jackets"
        },
        {
            title: "Jeans"
        },
        {
            title: "Shoes"
        },
    ]

    const getcategoriesData = async () => {
        setIsLoader(true)
        try {
            const response = await categoriesList()
            if (response?.status) {
                setIsLoader(false)
                setStoreCategories(response?.data)
            } else {
                setIsLoader(false)
            }
        } catch (error) {
            setIsLoader(false)
            console.log(error)
        }
    }

    const getBannerOffers = async () => {
        setIsLoader(true)
        try {
            const response = await offerBanner()
            if (response?.status) {
                setIsLoader(false)
                setOfferBannerList(response?.data)
            } else {
                setIsLoader(false)
            }
        } catch (error) {
            setIsLoader(false)
            console.log(error)
        }
    }

    const getcategoriesProduct = async (value) => {
        //setIsLoader(true)
        try {
            const response = await fetchCategoryProducts(value)
            if (response?.status) {
                setIsLoader(false)
                console.log(response?.data, value)
                setStoreData(response?.data)
            } else {
                setIsLoader(false)
            }
        } catch (error) {
            setIsLoader(false)
            console.log(error)
        }
    }

    const funCategories = (val) => {
        getcategoriesProduct(val);
        setSelectedCat(val)
    }

   /* useEffect(() => {
        getcategoriesProduct(selectedCat);
    }, [selectedCat])*/

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
        getcategoriesData();
        getBannerOffers();
    }, [])

    const renderItem = ({ item, index }) => {
        return (
           
            <SingleProductCard
                item={item}
                onPress={() => navigation.navigate('ProductDetails', { id: item?.pid })}
            />
        )
    }

    const renderItems = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={()=>
                navigation.navigate('SameProduct', {
                    text: item?.link_category,
                    subC_ID: item?.CID,
                })
            }>	
             
            <ImageBackground source={{uri:item?.image}} style={{ width: '100%', height: 160, marginRight: 15, marginBottom: 15 }} borderRadius={20}>
                <View style={{ paddingLeft: 15, paddingTop: 20 }}>
                    <Text style={{ color: color.theme, fontWeight: "700", fontSize: 22 }}>{item?.title_line_1}</Text>
                    <Text style={{ color: color.theme, fontWeight: "300", fontSize: 20 }}>{item?.title_line_2}</Text>
                  {/*  <TouchableOpacity style={styles.getNowBtn}>
                        <Text style={styles.getNowBtnTxt}>{item?.button_text}</Text>
                    </TouchableOpacity> */}
                </View>
            </ImageBackground>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        similarProducts()
    }, [])

    const similarProducts = async () => {
        setIsLoader(true)
        try {
            const result = await getSameProduct(text)
            if (result?.status) {
                setIsLoader(false)
                setStoreData(result?.data)
            } else {
                setIsLoader(false)
                alert(response?.message)
            }
        } catch (error) {
            setIsLoader(false)
            console.log(error)
        }
    }

    if (isLoader) {
        return (
            <ScreenLoader />
        )
    }

    return (
        <Animatable.View
        animation={'slideInLeft'}
        duration={1000}
        delay={100}
        style={{ flex: 1 }}
      >
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons size={40} name={I18nManager.isRTL ? 'chevron-forward-circle': 'chevron-back-circle'} color={color.theme} />
                      </TouchableOpacity>
                <HeaderLogo />
                <TouchableOpacity onPress={() => navigation.navigate('MyCart')}>
                    <ExportSvg.Cart />
                </TouchableOpacity>

            </View>
         
         <View style={{flexDirection:'row'}}>
            
            <Text style={{...styles.arrivalTxt,}}>{text}</Text>
            </View>

            <View style={{marginTop:15,marginBottom:180}}>
                
            <FlatList
                            data={OfferBannerList}
                            keyExtractor={(item, index) => index?.toString()}
                            renderItem={renderItems}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={<EmptyScreen
                                text={t('no_data_found')}
                            />}
                        />
            </View>
               
            <SearchModal
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                navigation={navigation}
            />

        </View>
        </Animatable.View>
    )
}

export default DiscountProducts

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 40 : 20,
        paddingHorizontal: 15

    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
        marginTop: 15,
        paddingHorizontal: 15,
    },
    arrivalTxt: {
        fontSize: 17,
        fontWeight: "700",
        color: color.theme,
        marginBottom: 10,
    },

    arrivalTitle: {
        fontSize: 15,
        color: color.theme,
        marginTop: 5,
        fontFamily: "Montserrat-SemiBold"
    },
    arrivalSubTitle: {
        color: color.gray,
        marginVertical: 2,
        fontFamily: "Montserrat-Regular",
        fontSize: 13


    },
    arrivalPrice: {
        color: color.theme,
        fontFamily: "Montserrat-SemiBold"
    },
    getNowBtn: {
        backgroundColor: color.theme,
        paddingVertical: 6,
        borderRadius: 20,
        paddingHorizontal: 12,
        alignSelf: "flex-start",
        marginTop: 20
    },
    getNowBtnTxt: {
        fontWeight: "700",
        color: "#fff",
        fontSize: 11,

    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 20
    },

    searchBox: {
        backgroundColor: color.gray.concat('10'),
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        borderRadius: 30,
        width: "82%",
    },
    getNowBtn: {
        backgroundColor: color.theme,
        paddingVertical: 6,
        borderRadius: 20,
        paddingHorizontal: 12,
        alignSelf: "flex-start",
        marginTop: 20
    },
    discountTxt: {
        color: color.theme,
        fontWeight: "700",
        fontSize: 22
    },
    discountTitle: {
        color: color.theme,
        fontWeight: "300",
        fontSize: 20
    },
    subTitleTxt: {
        color: color.gray,
        fontSize: 12,
        marginTop: 12
    },
    getNowBtnTxt: {
        fontWeight: "700",
        color: "#fff",
        fontSize: 11,

    },
    arrivalBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 10
    },
    arrivalTxt: {
        fontSize: 18,
        fontWeight: "700",
        color: color.theme
    },
    viewTxt: {
        fontSize: 12,
        fontWeight: "600",
        color: color.gray

    },
    arrivalTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: color.theme,
        marginTop: 5,
        fontFamily: "Montserrat-SemiBold"

    },
    arrivalSubTitle: {
        color: color.gray,
        // fontWeight: "300",
        marginVertical: 2,
        fontFamily: "Montserrat-Regular",
        fontSize: 12


    },
    arrivalPrice: {
        color: color.theme,
        // fontWeight: "500",
        fontFamily: "Montserrat-SemiBold"

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
        flexDirection: "row",
        marginVertical: 15
    },
    innerCatBox: {
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 50,
        borderColor: "#ccc"
    },
    catTxt: {
        color: color.theme,
        fontFamily: 'Montserrat-SemiBold',
        // fontWeight: "500"
    },

    imgTitle: {
        color: color.theme,
        fontFamily: 'Montserrat-SemiBold',
        fontWeight: "600"
    },
    imgSubTitle: {
        color: color.gray,
        fontSize: 13,
        fontWeight: "300",
        marginVertical: 4,
        fontFamily: 'Montserrat-Regular',

    },
    imgPriceTitle: {
        color: color.theme,
        fontFamily: 'Montserrat-SemiBold',
        fontWeight: "600"
    }

})