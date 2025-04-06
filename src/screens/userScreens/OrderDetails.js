import { ActivityIndicator, Alert, FlatList, I18nManager, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ExportSvg from '../../constants/ExportSvg'
import { color } from '../../constants/color'
import { bags } from '../../constants/data'
import { useDispatch, useSelector } from 'react-redux'
import { postPromoCoder, promoCodes, userShippingAddress } from '../../services/UserServices'
import HeaderLogo from '../../components/HeaderLogo'
import { decrementCounter, deleteProduct, handlePromo, handleTotalPrice, incrementCounter, selectTotalPrice } from '../../redux/reducer/ProductAddToCart'
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomText from '../../components/CustomText'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import LottieView from 'lottie-react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CircleLoader from '../../components/CircleLoader'
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
    const [successPromo, setSuccessPromo] = useState(false)

    const { t } = useTranslation();

    console.log('userAddress--', userAddress)
    // const calculateTotalPrice = (items) => {
    //     return items.reduce((total, item) => {
    //         return total + (item.counter * parseFloat(item.price));
    //     }, 0).toFixed(2);
    // };
    const { userAddressA } = route?.params || ''
    const isFocused = useIsFocused();

    const applyCode = async () => {
        if (!promoCode) {
            Alert.alert('', t('PleasePromo'), [
                { text: t('ok'), onPress: () => console.log('OK pressed') }
            ]);
            return;
        }
        setPromoLoader(true)
        try {
            const result = await postPromoCoder(promoCode)

            if (!result?.error) {
                const discountAmount = (totalPrice * result?.promo_code?.discount) / 100
                const finalValue = totalPrice - discountAmount
                dispatch(handleTotalPrice(finalValue?.toFixed(2)))
                dispatch(handlePromo())

            } else {
                Alert.alert('', t('promoExpire'))
            }
        } catch (error) {
            console.log('error', error)
        } finally {
            setPromoLoader(false)
        }
    }



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
            console.log('sajidToro', response)
            console.log('tangaiiii', response)
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
        if( !userAddress?.phone){
            Alert.alert('', t('addAddress'))
            return
        }
        if (userId) {
            navigation.navigate('PaymentOrder', {
                totalPrice: totalPrice
            })
        } else if (userAddress !== undefined) {
            navigation.navigate('VerifyCode', {
                totalPrice: totalPrice,
                phoneNo: userAddress?.phone
            })
        }
       
    }


    const renderItem = ({ item, index }) => {
        console.log('----', item)
        return (
            <View style={styles.productContainer}>
                <Image borderRadius={5} source={{ uri: item?.image }} style={{ width: 60, height: 60 }} />

                <View style={{ marginLeft: 10, }}>
                    <Text style={{ ...styles.productTitle, textAlign: I18nManager.isRTL ? 'left' : 'left' }}>{item?.productName}</Text>
                    <Text style={{ ...styles.subTitle, textAlign: I18nManager.isRTL ? 'left' : 'left' }}>{item?.subText}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }} >
                        <Text style={{ ...styles.productPrice, textAlign: I18nManager.isRTL ? 'left' : 'left' }}>{item?.price}</Text>
                        <CustomText style={{ color: color.theme, fontWeight: '500' }}>{item?.counter}x</CustomText>
                    </View>
                </View>
            </View>
        )
    }


    const onPressEmptyAddress = () => {
        navigation.navigate("ShippingAddress")
        // if (userId) {
        //     navigation.navigate("ShippingAddress")
        // } else {
        //     Alert.alert(
        //         t(''),
        //         t('addressSaved'),
        //         [
        //             {
        //                 text: t('ok'), onPress: () => navigation.navigate('StackNavigations', {
        //                     screen: "Login",
        //                     params: { isOrderDetail: true }
        //                 }
        //                 )
        //             }
        //         ],
        //         {
        //             textAlign: I18nManager.isRTL ? 'right' : 'left'  // Align title based on language direction
        //         }
        //     );
        // }

    }
    console.log('shumaila', address?.length)

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
                            <View style={styles.addCardPlusBox}>
                                <Text style={styles.plusIcon}>+</Text>
                            </View>
                            <Text style={{ fontSize: 16, fontFamily: "Montserrat-Medium", color: color.theme }}>{t('add_delivery_address')}</Text>
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
 {                         !userId &&  <TouchableOpacity onPress={() => navigation.navigate('ShippingAddress')} style={styles.editBox}>
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
                            style={{ color: "#000", textAlign: I18nManager.isRTL ? 'left' : 'left', height: 38 }}
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
                            isPromo ?
                                <View style={{ top: 10 }} >
                                    <AntDesign name={'checkcircle'} size={18} color={'green'} />
                                </View>
                                :
                                <TouchableOpacity onPress={() => applyCode()} style={{ justifyContent: "center", paddingHorizontal: 5 }}>
                                    <CustomText style={{ color: color.theme, fontWeight: "500" }}>{t('apply')}</CustomText>
                                </TouchableOpacity>

                    }
                </View>


                <View style={{ flex: 1, justifyContent: "flex-end", marginVertical: 30, }}>
                    <View style={styles.bottomContent}>
                        <View>
                            <Text style={{ fontSize: 10, color: "#AAA" }}>{t("total_price")}</Text>
                            <Text style={styles.bottomPrice}>KD{totalPrice}</Text>
                        </View>

                        {
                            <TouchableOpacity
                                style={{ ...styles.bottomPlaceOrderBox, backgroundColor:  color.theme  }} onPress={handleOnPress}>
                                <Text style={styles.orderTxt}>{t("continue")}</Text>
                            </TouchableOpacity>
                        }
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
        fontFamily: "Montserrat-Bold",
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
        fontFamily: "Montserrat-Regular",
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
        fontFamily: "Montserrat-SemiBold"
    },
    subTitle: {
        fontWeight: '400',
        color: color.gray,
        fontFamily: "Montserrat-Regular",
        fontSize: 12,
        marginVertical: Platform.OS == 'ios' ? 2 : 1

    },
    productPrice: {
        fontWeight: "600",
        color: color.theme,
        fontFamily: "Montserrat-SemiBold"


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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    bottomPlaceOrderBox: {
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: color.theme,
        borderRadius: 50
    },
    bottomPrice: {
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "Montserrat-Bold",
        color: color.theme
    },
    orderTxt: {
        fontSize: 16,
        fontFamily: "Montserrat-SemiBold",
        color: "#fff",
        fontWeight: "600"
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
        zIndex: -1
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