import { Alert, FlatList, I18nManager, Image, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { color } from '../../constants/color'
import { useDispatch, useSelector } from 'react-redux'
import { deliveryCharges, postPromoCoder, userShippingAddress } from '../../services/UserServices'
import HeaderLogo from '../../components/HeaderLogo'
import { handlePromo, handleTotalPrice } from '../../redux/reducer/ProductAddToCart'
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomText from '../../components/CustomText'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import CircleLoader from '../../components/CircleLoader'
import Text from '../../components/CustomText'
import { fonts } from '../../constants/fonts'
import { showMessage } from 'react-native-flash-message'
const OrderDetails = ({ navigation, route }) => {
    //const { totalPrice } = route?.params
    const dispatch = useDispatch()
    const data = useSelector((state) => state.cartProducts?.cartProducts)
    const userId = useSelector((state) => state.auth?.userId)
    const userAddress = useSelector((state) => state?.customerAddress?.storeAddress)
    const { isPromo } = useSelector((state) => state?.cartProducts)
    const { totalPrice } = useSelector(state => state.cartProducts);


    const [address, setAddress] = useState([])
    const [promoCode, setPromoCode] = useState('')
    const [promoLoader, setPromoLoader] = useState(false)
    const [promoCodeValue, setPromoCodeValue] = useState(0)
    const [deliveryChargesData, setDeliveryChargesData] = useState([])
    const [isDelvieryLoader, setIsDeliveryLoader] = useState(false)



    const { t } = useTranslation();

    const calculateTotalWeight = () => {
        return data.reduce((total, product) => {
            const weight = product.productWeight == "00000" || product.productWeight == null ? 0.5 : product.productWeight;
            return total + weight;
        }, 0);
    }
    const totalWeight = calculateTotalWeight();


    const getDeliveryCharges = () => {
        const countryRules = deliveryChargesData.filter(rule => rule.country === userAddress?.country);
        // Find matching range
        const matchedRule = countryRules.find(rule =>
            totalWeight >= rule.delivery_weight_range_start &&
            totalWeight <= rule.delivery_weight_range_end
        );


        if (!matchedRule) return null;
        // return totalWeight * matchedRule.per_kg_price;
        return matchedRule.per_kg_price;
    }
    const totalDeliveryCharges = getDeliveryCharges()
    const FinalTotal = Number(totalDeliveryCharges) + Number(totalPrice) - Number(promoCodeValue)
    console.log('FinalTotal', promoCodeValue)

    useEffect(() => {
        DeliveryCharges()
    }, [])


    const DeliveryCharges = async () => {
        try {
            const response = await deliveryCharges()
            if (response?.status) {
                setDeliveryChargesData(response?.data)
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    console.log('country', userAddress?.country)


    const applyCode = async () => {
        if (!promoCode) {
            showMessage({
                type: "danger",
                message: t('PleasePromo')
            })
            return;
        }
        setPromoLoader(true)
        try {
            const result = await postPromoCoder(promoCode)
            console.log('showmrREsukt', result)

            if (!result?.error) {
                const discountAmount = (FinalTotal * result?.promo_code?.discount) / 100
                setPromoCodeValue(discountAmount)
                // dispatch(handleTotalPrice(finalValue?.toFixed(2)))
                // dispatch(handlePromo())

            } else {
                Alert.alert('', t('promoExpire'))
            }
        } catch (error) {
            console.log('error', error)
        } finally {
            setPromoLoader(false)
        }
    }


    console.log('discountAmount', promoCodeValue)
    // useEffect(() => {
    //     addressArray()
    // }, [])
    useFocusEffect(
        useCallback(() => {
            addressArray()
        }, [])
    )




    const addressArray = async () => {
        try {
            const response = await userShippingAddress(userId);
            if (response?.data?.length > 0) {
                setAddress(response?.data)
            } else {
                setAddress([])
            }
        } catch (error) {
            console.log(error)
        }
    }





    const AddressLine = ({ label, value }) => (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
        }}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>: </Text>
            <Text style={styles.value}>{value}</Text>

        </View>
    );



    const handleOnPress = () => {
        if (!userAddress?.phone) {
            showMessage({
                type: "danger",
                message: t('addAddress')
            })
            return
        }
        if (userId) {
            navigation.navigate('PaymentOrder', {
                FinalTotal: FinalTotal,
                subTotal:totalPrice,
                discount:promoCodeValue,
                delCharges:totalDeliveryCharges
            })
        } else if (userAddress !== undefined) {
            navigation.navigate('VerifyCode', {
                totalPrice: totalPrice,
                phoneNo: userAddress?.phone
            })
        }

    }


    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.productContainer}>
                <Image borderRadius={5} source={{ uri: item?.image }} style={{ width: 60, height: 60 }} />

                <View style={{ marginLeft: 10, width: "80%" }}>
                    <Text numberOfLines={1} style={{ ...styles.productTitle, textAlign: I18nManager.isRTL ? 'left' : 'left' }}>{item?.productName}</Text>
                    <Text style={{ ...styles.subTitle, textAlign: I18nManager.isRTL ? 'left' : 'left' }}>{item?.subText}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }} >
                        <Text style={{ ...styles.productPrice, textAlign: I18nManager.isRTL ? 'left' : 'left' }}>KD {item?.price}</Text>
                        <CustomText style={{ color: color.theme, fontWeight: '500' }}>x{item?.counter}</CustomText>
                    </View>
                </View>
            </View>
        )
    }

    const onPressEmptyAddress = () => {
        navigation.navigate("ShippingAddress", {
            isMap: true
        })

    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons size={40} name={I18nManager.isRTL ? 'chevron-forward-circle' : 'chevron-back-circle'} color={color.theme} />
                </TouchableOpacity>
                <HeaderLogo />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <Text style={[styles.productName]}>{t("delivery_address")}</Text>
                {
                    address?.length !== 0 && userId &&
                    <TouchableOpacity style={{ borderWidth: 1, alignSelf: "baseline", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 5, borderColor: "#cecece" }} onPress={() => navigation.navigate('SavedAddresses')}>
                        <CustomText style={{ fontSize: 16, fontWeight: "600", color: color.theme, textAlign: "left" }}>{t('changeAddress')}</CustomText>
                    </TouchableOpacity>
                }
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 70 }}>

                {
                    Object?.keys(userAddress)?.length == 0 || userAddress == undefined
                        // userAddress == undefined
                        ?
                        // <TouchableOpacity onPress={() => navigation.navigate('ShippingAddress')} style={styles.addCardBox}>
                        <TouchableOpacity onPress={() => onPressEmptyAddress()} style={styles.addCardBox}>
                            <SimpleLineIcons name={'plus'} color={color.theme} size={20} style={{ marginTop: 5 }} />
                            <Text style={{ fontSize: 16, color: color.theme }}>{t('add_delivery_address')}</Text>
                        </TouchableOpacity>
                        :
                        <View>
                            <View style={styles.userAddressBox}>
                                <AddressLine label={t('Street')} value={userAddress?.street} />
                                <AddressLine label={t('City')} value={userAddress?.city} />
                                <AddressLine label={t('governorate')} value={userAddress?.area} />
                                <AddressLine label={t('phoneNumber')} value={`\u2066${userAddress?.phone}\u2069`} />
                                <AddressLine label={t('Country')} value={userAddress?.country} />
                            </View>
                            {!userId && <TouchableOpacity onPress={() => navigation.navigate('ShippingAddress')} style={styles.editBox}>
                                <Text style={{ color: color.theme }}>{t("edit")}</Text>
                            </TouchableOpacity>}
                        </View>
                }
                <View style={{ flexDirection: 'row' }}>

                    <Text style={[styles.productName, { fontSize: 15 }]}>{data?.length > 1 ? t("product_items") : t("product_item")}</Text>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <FlatList
                        // data={bags?.slice(2)}
                        data={data}
                        keyExtractor={(item, index) => index?.toString()}
                        renderItem={renderItem}
                    />
                </View>

                <Text style={[styles.productName, { fontSize: 15 }]}>{t('promoCoder')}</Text>

                <View style={[styles.productContainer, { justifyContent: "space-between" }]}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TextInput
                            placeholder={t('enderPromo')}
                            placeholderTextColor={'#cecece'}
                            style={{ fontFamily: fonts.semiBold, color: "#000", textAlign: I18nManager.isRTL ? 'right' : 'left', width: "85%" }}
                            value={promoCode}
                            onChangeText={setPromoCode}
                            maxLength={8}
                        />

                    </View>
                    {
                        promoLoader ?
                            <View style={{ position: "absolute", right: -5, top: -5 }} >
                                <CircleLoader />
                            </View>
                            :
                            promoCodeValue > 0 ?
                                <View style={{ top: 5 }} >
                                    <AntDesign name={'checkcircle'} size={18} color={'green'} />
                                </View>
                                :
                                <TouchableOpacity onPress={() => applyCode()} style={{ justifyContent: "center", paddingHorizontal: 5 }}>
                                    <CustomText style={{ color: color.theme, fontWeight: "500" }}>{t('apply')}</CustomText>
                                </TouchableOpacity>

                    }
                </View>


                <View style={{ flex: 1, marginVertical: 30, }}>
                    {/* <View>
                        <Text style={{ fontSize: 10, color: "#AAA" }}>{t("total_price")}</Text>
                        <Text style={styles.bottomPrice}>KD{totalPrice}</Text>
                    </View> */}
                   
                    <View style={styles.bottomContent}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <CustomText>{t('subTotal')}</CustomText>
                            <CustomText>KD {totalPrice}</CustomText>
                        </View>

                        {
                            Object?.keys(userAddress)?.length !== 0 && userAddress !== undefined ?
                                // Object?.keys(userAddress)?.length !== 0 || userAddress !== undefined &&
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <CustomText>{t('delivery')}</CustomText>
                                    <CustomText>KD {totalDeliveryCharges}</CustomText>
                                </View>
                                : ''
                        }

                        {
                            promoCodeValue > 0 &&
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <CustomText>{t('discount')}</CustomText>
                                <CustomText>KD {promoCodeValue}</CustomText>
                            </View>
                        }

                        <View style={{ width: "100%", height: 1, backgroundColor: "#ececec" }} />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <CustomText>{t('total')}</CustomText>
                            <CustomText>KD {FinalTotal}</CustomText>
                        </View>
                        <TouchableOpacity
                            style={{ ...styles.bottomPlaceOrderBox, backgroundColor: color.theme }} onPress={handleOnPress}>
                            <Text style={styles.orderTxt}>{t("continue")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}

export default OrderDetails

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 40 : 20,
        backgroundColor: "#fff",
        paddingHorizontal: 15

    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 15,
        width: '70%',
        justifyContent: 'space-between'
    },
    logoBox: {
        marginLeft: "auto",
        marginRight: "auto",
        right: 10
    },
    productName: {
        fontSize: 18,
        fontWeight: "600",
        color: color.theme,
        fontFamily: "Cairo-Medium",
        textAlign: "left"

    },
    editBox: {
        position: "absolute",
        right: 15,
        top: 30
    },
    userAddressBox: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: "#fff",
        // elevation: 5,
        borderWidth: 1,
        borderColor: "#00000020",

        padding: 20,
        borderRadius: 20,
        marginVertical: 15
    },
    label: {
        fontFamily: "Montserrat-SemiBold",
        fontWeight: "600",
        color: color.theme,
        textAlign: 'left',
        marginRight: 2
    },
    value: {
        color: color.grayShade,
        fontWeight: "400",
        textAlign: 'left',



    },
    productContainer: {
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4,
        backgroundColor: "#fff",
        // elevation: 2,
        marginHorizontal: 6,
        marginTop: 8,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#00000020',

        // justifyContent: "space-between",
        // alignItems: "center"
    },
    productTitle: {
        color: color.theme,
        fontFamily: "Cairo-SemiBold"
    },
    subTitle: {
        fontWeight: '400',
        color: color.gray,
        fontSize: 12,
        marginVertical: Platform.OS == 'ios' ? 2 : 1

    },
    productPrice: {
        fontWeight: "600",
        color: color.theme,
        fontFamily: "Cairo-SemiBold"


    },
    counterMainContainer: {
        flex: 1,
        justifyContent: "flex-end"
    },


    percentLogoBox: {
        width: 40,
        height: 40,
        backgroundColor: color.theme,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7
    },
    bottomContent: {
        // flexDirection: "row",
        // justifyContent: "space-between",
        // alignItems: "center"
    },
    bottomPlaceOrderBox: {
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: color.theme,
        borderRadius: 50,
        marginTop: 30
    },
    bottomPrice: {
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "Montserrat-Bold",
        color: color.theme
    },
    orderTxt: {
        fontSize: 16,
        fontFamily: fonts.semiBold,
        color: "#fff",
        fontWeight: "600",
        textAlign: "center"
    },
    addCardBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        height: 60,
        marginVertical: 25,
        borderStyle: 'dashed',
        borderColor: "#DDD",
        borderRadius: 13,
        zIndex: -1,
        gap: 10
    },
    addCardPlusBox: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#DDD",
        marginRight: 15

    },
    plusIcon: {
        color: color.theme,
        fontSize: 18
    },


})