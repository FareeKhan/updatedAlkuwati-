import { FlatList, I18nManager, Image, Modal, Platform, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ExportSvg from '../../constants/ExportSvg'
import SearchInput from '../../components/SearchInput'
import { color } from '../../constants/color'
import ProgressBar from '../../components/ProgressBar'
import PaymentSuccessModal from '../../components/PaymentSuccessModal'
import { getOrder } from '../../services/UserServices'
import { useSelector } from 'react-redux'
import ScreenLoader from '../../components/ScreenLoader'
import HeaderLogo from '../../components/HeaderLogo'
import { useTranslation } from 'react-i18next';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons'
import EmptyScreen from '../../components/EmptyScreen'
import Text from '../../components/CustomText'
import { fonts } from '../../constants/fonts'
import SmallImageLoader from '../../components/SmallImageLoader'
import HeaderBox from '../../components/HeaderBox'

const TrackOrder = ({ navigation }) => {

    const userId = useSelector((state) => state.auth?.userId)
    const [currentPosition, setCurrentPosition] = useState(0);
    const [storeOrder, setStoreOrder] = useState([]);
    const [singleOrder, setSingleOrder] = useState('');
    const [isRefresh, setIsRefresh] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const { t } = useTranslation();

    const [orderTracking, SetorderTracking] = useState(false);
    const [orderHistory, SetorderHistory] = useState(false);

    useEffect(() => {
        orderData()
    }, [])

    const FunorderTracking = (SetorderTrackingV) => {
        if (orderTracking.a) {
            SetorderTracking({ a: false, b: SetorderTrackingV });
        } else {
            SetorderTracking({ a: true, b: SetorderTrackingV });
        }

    }

    const FunorderHistory = (SetorderHistoryV) => {
        if (orderHistory.a) {
            SetorderHistory({ a: false, b: SetorderHistoryV });
        } else {
            SetorderHistory({ a: true, b: SetorderHistoryV });
        }

    }


    const statusCHangeORder = (orderStatusName) => {
        if (orderStatusName == 'Confirmed') {
            return 0;
        } else if (orderStatusName == 'Preparing') {
            return 1;
        } else if (orderStatusName == 'Ready for delivery') {
            return 2;
        } else if (orderStatusName == 'Out for delivery') {
            return 3;
        } else if (orderStatusName == 'Delivered') {
            return 4;
        } else {
            return 0;
        }
    }



    useEffect(() => {

        /*  if (singleOrder?.order_status == 'confirmed') {
              setCurrentPosition(0)
          } else if (singleOrder?.order_status == 'processing') {
              setCurrentPosition(1)
          } else if (singleOrder?.order_status == 'delivery') {
              setCurrentPosition(2)
          } else if (singleOrder?.order_status == 'completed') {
              setCurrentPosition(3)
          }*/

    }, [singleOrder])

    const orderData = async () => {
        setIsLoader(true)
        try {
            const response = await getOrder(userId)
            console.log('response', response)
            if (response?.status == 'success') {
                setIsLoader(false)
                setStoreOrder(response?.data)
                setSingleOrder(response?.data[0])
            } else {
                setIsLoader(false)
            }
        } catch (error) {
            setIsLoader(false)
            console.log(error)
        }
    }

    const onOrderPress = (item) => {
        setSingleOrder(item)
        if (item?.order_status == 'confirmed') {
            setCurrentPosition(0)
        } else if (item?.order_status == 'processing') {
            setCurrentPosition(1)
        }
    }


    const TextStatusShow = (text) => {

        if (text == 'Preparing') {
            return t("Preparing");
        } else if (text == 'Ready for delivery') {
            return t('Readyfordelivery');
        } else if (text == 'Out for delivery') {
            return t('Outfordelivery');
        } else if (text == 'Delivered') {
            return t('Delivered');
        } else {
            return t('Confirmed');
        }
        return t('Confirmed');
    }

    const currencyType = "KD"

    const renderItem = ({ item, index }) => {
        const text = item?.order_status.charAt(0).toUpperCase() + item?.order_status.slice(1).toLowerCase();
        return (
            <>
                {text == "Delivered" &&
                    <>
                        <TouchableOpacity onPress={() => FunorderHistory(item?.id)} style={styles.TrackingStatusBox}>

                            <ExportSvg.Car />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ ...styles.trackingNo, textAlign: I18nManager.isRTL ? 'left' : 'left' }}>{item?.id}</Text>
                                <Text style={{ ...styles.expressTxt, textAlign: I18nManager.isRTL ? 'left' : 'left' }}>{item?.address}</Text>
                                <Text style={styles.expressTxt}>Delivery Date: {item?.delivered_datetime}</Text>
                            </View>
                            {/* <Text style={[styles.TrackingTxt, { color: TrackingStatus == 'Delivered' ? '#AAAAAA' : TrackingStatus == 'On the way' ? color.theme : '#333333' }]}>{item?.order_status}</Text> */}
                            <Text style={[styles.TrackingTxt, { color: item?.order_status == 'confirmed' ? '#333333' : item?.order_status == 'processing' ? '#AAAAAA' : item?.order_status == 'delivery' ? '#AAAAAA' : 'green' }]}>{TextStatusShow(text)}</Text>

                        </TouchableOpacity>

                        {orderHistory.a && item?.id == orderHistory.b &&
                            item.products &&
                            (
                                <Animatable.View
                                    animation={'bounceIn'}
                                    duration={1000}
                                    delay={100}
                                    style={{ flex: 1 }}
                                >
                                    <View style={{ ...styles.TrackingStatusBoxTwo, display: 'flex' }}>

                                        {item.products?.map((item, index) => {
                                            return (
                                                <>
                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderStyle: 'solid', borderColor: '#eee', paddingBottom: 5, paddingTop: 5 }}>
                                                        <Image source={{ uri: item.image }} style={{ width: 40, height: 40 }} />
                                                        <Text>{item.name}</Text>
                                                        <Text>KWD{item.price} - Qty:{item.quantity}</Text>
                                                    </View>
                                                </>
                                            )
                                        })
                                        }

                                    </View>
                                </Animatable.View>
                            )
                        }
                    </>
                }
            </>
        )
    }


    const renderItemCurrent = ({ item, index }) => {
        const text = item?.order_status.charAt(0).toUpperCase() + item?.order_status.slice(1).toLowerCase();

        return (
            <>
                {text !== "Delivered" &&
                    <>
                        <TouchableOpacity onPress={() => FunorderTracking(item?.id)} >

                            <View style={styles.TrackingNumberBox}>
                                <ExportSvg.CurveIcon style={{ marginTop: 4 }} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ ...styles.trackingNo, textAlign: I18nManager.isRTL ? 'left' : 'left' }}>{item?.id}</Text>
                                    {/*<Text style={styles.trackingNo}>{singleOrder?.track_number}</Text>*/}
                                    <Text style={styles.expressTxt}>{item?.order_datetime}</Text>
                                </View>
                                <Text style={[styles.orderPlacedTxt, { color: item?.order_status == 'confirmed' ? '#333333' : item?.order_status == 'processing' ? '#AAAAAA' : item?.order_status == 'delivery' ? '#AAAAAA' : 'green' }]}>{TextStatusShow(text)}</Text>

                            </View>

                            <ProgressBar
                                currentPosition={statusCHangeORder(item?.order_status)}
                            // setCurrentPosition={setCurrentPosition}
                            />
                        </TouchableOpacity>

                        {orderTracking.a && item?.id == orderTracking.b &&
                            item.products &&
                            (
                                <Animatable.View
                                    animation={'bounceIn'}
                                    duration={1000}
                                    delay={100}
                                    style={{ flex: 1 }}
                                >
                                    <View style={{ ...styles.TrackingStatusBoxTwo, }}>

                                        {item.products?.map((itm, index) => {
                                            return (
                                                <View>
                                                    <View style={{ flex: 1, flexDirection: 'row', gap: 10, borderStyle: 'solid', borderColor: '#eee', paddingBottom: 5, paddingTop: 5 }}>
                                                        {/* <Image source={{ uri: itm.image }} style={{ width: 40, height: 40 }} /> */}
                                                        <SmallImageLoader
                                                            container={{ width: "12%" }}
                                                            imagePath={itm.image}
                                                            imgStyle={{ width: 40, height: 40, borderRadius: 5 }}
                                                        />


                                                        <View style={{ flexDirection: "row", alignItems: "center", width: "70%" }}>
                                                            <Text style={{ textAlign: "left" }} numberOfLines={2}>{itm.name} </Text>
                                                            <Text style={{}} numberOfLines={2}> {itm.quantity}x</Text>

                                                        </View>

                                                        {/* <Text>Qty:{item.quantity} KWD{item.price}</Text> */}
                                                    </View>

                                                </View>
                                            )
                                        })
                                        }
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 5, paddingTop: 5 }}>
                                            <Text style={{}} numberOfLines={2}>{t('subTotal')}</Text>
                                            <Text style={{}} numberOfLines={2}>{currencyType} {item.subtotal_price}</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 5, paddingTop: 5 }}>
                                            <Text style={{}} numberOfLines={2}>{t('delivery')}</Text>
                                            <Text style={{}} numberOfLines={2}>{currencyType} {item.delivery_price}</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 5, paddingTop: 5 }}>
                                            <Text style={{}} numberOfLines={2}>{t('discount')}</Text>
                                            <Text style={{}} numberOfLines={2}>{currencyType} {item.discount}</Text>
                                        </View>
                                        <View style={{ flex: 1, borderTopWidth: 1, borderColor: "#ececec", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 5, paddingTop: 5 }}>
                                            <Text style={{}} numberOfLines={2}>{t('total')}</Text>
                                            <Text style={{}} numberOfLines={2}>{currencyType} {item.total_price}</Text>
                                        </View>
                                    </View>

                                </Animatable.View>
                            )
                        }
                    </>
                }
            </>
        )
    }



    const onRefresh = async () => {
        setIsRefresh(true)
        try {
            const response = await getOrder(userId)
            if (response?.status == 'success') {
                setIsRefresh(false)
                setStoreOrder(response?.data)
                setSingleOrder(response?.data[0])
            } else {
                setIsRefresh(false)
            }
        } catch (error) {
            console.log(error)
            setIsRefresh(false)

        }
    }

    if (isLoader) {
        return (
            <ScreenLoader />
        )
    }

    return (
        <View style={styles.mainContainer}>
            {/* <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons size={40} name={I18nManager.isRTL ? 'chevron-forward-circle' : 'chevron-back-circle'} color={color.theme} />
                </TouchableOpacity>
                <HeaderLogo />
            </View> */}
            <HeaderBox 
            cartIcon={true}
            
            />

            {/* <View style={styles.searchContainer}>
                <View style={{ width: "82%" }}>
                    <SearchInput />
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Filters')}>
                    <ExportSvg.Scanner />
                </TouchableOpacity>
            </View> */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}

                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
                }
            >

                {
                    storeOrder?.length > 0 ?

                        <>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.TitleTracking}>{t("tracking")}</Text>
                            </View>
                            <FlatList
                                data={storeOrder}
                                refreshing={isRefresh}
                                onRefresh={onRefresh}
                                style={{ flex: 1 }}

                                keyExtractor={(item, index) => index?.toString()}
                                renderItem={renderItemCurrent}
                                ListEmptyComponent={<EmptyScreen />}
                                contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 0 }}
                                showsVerticalScrollIndicator={false}

                            />
                        </>
                        :

                        <EmptyScreen />


                }


                {/*  <View style={styles.TrackingNumberBox}>
                <ExportSvg.CurveIcon style={{ marginTop: 4 }} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.trackingNo}>{singleOrder?.track_number}</Text>
                    <Text style={styles.expressTxt}>{t("express")}</Text>
                </View>
                <Text style={styles.orderPlacedTxt}>{t("order_placed")}</Text>
            </View>
            <ProgressBar
                currentPosition={currentPosition}
                setCurrentPosition={setCurrentPosition}
            />
*/}
                {/* <View style={styles.dateLocationBox}>
                <TouchableOpacity onPress={() => setCurrentPosition(currentPosition < 3 ? currentPosition + 1 : 3)}>
                    <Text style={styles.expressTxt}>25 June,2021</Text>
                    <Text style={styles.trackingNo}>Warehouse 01</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentPosition(currentPosition != 0 ? currentPosition - 1 : 0)}>
                    <Text style={styles.expressTxt}>25 June,2021</Text>
                    <Text style={styles.trackingNo}>Hawali-Kuwait</Text>
                </TouchableOpacity>
            </View> */}
                {/* 
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.TitleTracking}>{t("history")}</Text>
                </View>

                <FlatList
                    data={storeOrder}
                    refreshing={isRefresh}
                    onRefresh={onRefresh}
                    keyExtractor={(item, index) => index?.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}

                /> */}
            </ScrollView>

            {/* <TrackingBox
                trackingSvg={<ExportSvg.Car />}
                TrackingId={'US 2343445668'}
                TrackingAddress={'Hawali - Kuwait'}
                TrackingStatus={'Delivered'}

            /> */}

            {/* <TrackingBox
                trackingSvg={<ExportSvg.Bike />}
                TrackingId={'US 2343445652'}
                TrackingAddress={'Hawali - Kuwait'}
                TrackingStatus={'On the way'}

            />

            <TrackingBox
                trackingSvg={<ExportSvg.Van />}
                TrackingId={'US 2343445638'}
                TrackingAddress={'Haali - Kuwait'}
                TrackingStatus={'Confirmed'}

            /> */}

        </View>
    )
}

export default TrackOrder

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        paddingBottom: 100
    },
    mainContainer: {
        flex: 1,
        paddingTop:Platform.OS == 'ios'? 60:20,
        paddingHorizontal: 15,
        // marginHorizontal: 15,
        backgroundColor: "#fff",

    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
        width: "70%"
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 20
    },
    TrackingNumberBox: {
        flexDirection: "row",
        paddingLeft: 20,
        marginTop: 30,
        marginBottom: 10
    },
    trackingNo: {
        fontFamily: "Montserrat-Bold",
        fontWeight: "600",
        color: color.theme,
    },
    expressTxt: {
        fontFamily: "Montserrat-Regular",
        color: color.gray,
        fontSize: 11
    },
    orderPlacedTxt: {
        marginLeft: "auto",
        fontFamily: "Montserrat-Bold",
        color: color.theme,
        fontWeight: "600",
        fontSize: 11
    },
    dateLocationBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // marginTop: 30,
        paddingLeft: 15,
        paddingRight: 10
    },
    TitleTracking: {
        fontSize: 15,
        color: color.theme,
        marginTop: 40,
        fontFamily: fonts.bold

    },
    TrackingStatusBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 13
    },
    TrackingStatusBoxTwo: {

        marginTop: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 3,
        marginBottom:10,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 13
    },
    TrackingTxt: {
        marginLeft: "auto",
        fontFamily: "Montserrat-SemiBold",
        color: color.theme,
        fontWeight: "600",
        fontSize: 13,
        marginBottom: 15
    },
    // Modal

})