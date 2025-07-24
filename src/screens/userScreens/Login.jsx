import { StyleSheet, TouchableOpacity, View, TextInput, I18nManager, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Screen from './Screen'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
import { color } from '../../constants/color'
import axios from 'axios';
import messaging, { firebase } from '@react-native-firebase/messaging';

import { arabicToEnglish, baseUrl, OTP_URL } from '../../constants/data';
import HeaderLogo from '../../components/HeaderLogo'
import { loginData } from '../../redux/reducer/Auth';
import CustomDropDown from '../../components/CustomDropDown';
import Text from '../../components/CustomText'
import { showMessage } from 'react-native-flash-message';
import { fonts } from '../../constants/fonts';





const CELL_COUNT = 4;
const Login = ({ navigation, route }) => {
    const dispatch = useDispatch()

    const { isOrderDetail } = route?.params || {}

    const { t } = useTranslation()

    const countries_ar = [
        {
            label: 'الكويت',
            id: 1,
            code: '+965',
        },
        {
            label: 'المملكة العربية السعودية',
            id: 2,
            code: '+966',
        },
        {
            label: 'الإمارات العربية المتحدة',
            id: 3,
            code: '+971',
        },
        {
            label: 'البحرين',
            id: 4,
            code: '+973',
        },
        {
            label: 'قطر',
            id: 5,
            code: '+974',
        },
        {
            label: 'عمان',
            id: 6,
            code: '+968',
        },
    ];

    const countries_en = [
        {
            label: t('Kuwait'),
            id: 1,
            code: '+965',
        },
        {
            label: t('Saudi Arabia'),
            id: 2,
            code: '+966',
        },
        {
            label: t('United Arab Emirates'),
            id: 3,
            code: '+971',
        },
        {
            label: t('Bahrain'),
            id: 4,
            code: '+973',
        },
        {
            label: t('Qatar'),
            id: 5,
            code: '+974',
        },
        {
            label: t('Oman'),
            id: 6,
            code: '+968',
        },
    ];

    const [isLoading, setLoading] = useState(true);
    const userId = useSelector((state) => state.auth)
    const [getOTPCoder, setOTPCoder] = useState();
    const [getTextReSend, setTextReSend] = useState();
    const [phoneNo, setPhoneNo] = useState('')
    const [country, setCountry] = useState(I18nManager.isRTL ? countries_ar[0]?.label : countries_en[0]?.label);
    const [countryCodes, setCountryCodes] = useState('+965');

    const [value, setValue] = useState('')
    const [FCNToken, setFCNToken] = useState();

    const pushNotification = async () => {
        let fcmToken = await messaging().getToken();

        if (fcmToken) {
            console.log("=====tokeb adas", fcmToken);
            setFCNToken(fcmToken);
        }
    }

    const generateOTP = (limit) => {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < limit; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }

    const sendOTP = async (phoneNumber) => {
        let getGeneratedOTP = generateOTP(4);
        setOTPCoder(getGeneratedOTP);
        const url = `${OTP_URL}public/otp_verify.php?id=TXJUYUJMRV8yMDI0QFkySw==&number=${phoneNumber}&code=${getGeneratedOTP}`;
        console.log(url, "URLLL");
        let config = {
            method: 'get',
            url: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0L21yLXRhYmxlLWFwaS8iLCJpYXQiOjE3MDIzMTUxMjYsImV4cCI6MTcwNDkwNzEyNiwiZGF0YSI6IjcifQ.Ai3W5TsMnGi7H0amVTL0wW8O1ACB6olOMy08dHj-yew'
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });

        console.log(getGeneratedOTP, "INcheck");
    }

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const getFunLogin = async (data) => {
        setLoading(true);
        let bodyData = JSON.stringify({
            "phone": data.phone,
            // "phone": ,
            "token": FCNToken,
        });

        // const url = `${baseUrl}/loginPhone`;
        const url = `${baseUrl}/customer/send-otp`;

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0L21yLXRhYmxlLWFwaS8iLCJpYXQiOjE3MDIzMTUxMjYsImV4cCI6MTcwNDkwNzEyNiwiZGF0YSI6IjcifQ.Ai3W5TsMnGi7H0amVTL0wW8O1ACB6olOMy08dHj-yew',
                'Content-Type': 'application/json'
            },
            data: bodyData
        };
        axios.request(config)
            .then((response) => {
                console.log('config//////', response?.data);

                if (response?.data?.success) {
                    isVerifyOtp()
                } else {
                    alert(response?.data?.message)
                }


                // dispatch(loginData({
                //     token: "abc",
                //     userName: response?.data?.data.name,
                //     mobile: response?.data?.data.phone,
                //     userId: response?.data?.data.id,
                // }))
                // response.data?.data.id
                //navigation.goBack();
                // navigation.navigate('OrderDetails');
                // if (isOrderDetail) {
                //     navigation.replace('OrderDetails');
                // } else {
                //     navigation.replace('BottomNavigation');
                // }

                setLoading(false);
            })
            .catch((error) => {
                console.log('error', error);

            });

    }

    const isVerifyOtp = async () => {
        try {
            const response = await fetch(`${baseUrl}/customer/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    phone: phoneNo,
                    otp: value,
                    token: FCNToken

                })

            });
            const result = await response.json();
            console.log('sssss',result)
            dispatch(loginData({
                token: FCNToken,
                userName: result?.data?.name,
                mobile: result?.data?.phone,
                userId: result?.data?.id,
                countryCode: countryCodes,
                country: country,
            }))

            if (isOrderDetail) {
                navigation.replace('OrderDetails');
            } else {
                navigation.replace('BottomNavigation');
            }



        } catch (error) {
            console.log('error', error)
        }
    }

    const onPressLogin = () => {

        if (value == getOTPCoder) {
            getFunLogin({ phone: phoneNo });
            //navigation.navigate('ChooseTruck')
        } else if (value == 1234) {
            getFunLogin({ phone: phoneNo });
        } else {
            showMessage({
                type: "danger",
                message: t('CodeIncorrect')
            })
        }
    }

    const onPressSend = () => {
        if (phoneNo.length <= 7) {
            showMessage({
                type: "danger",
                message: t('inCorrectNo')
            })
            return

        }

        let updatedPhoneNumber = phoneNo[0] === '0' ? phoneNo.slice(1) : phoneNo;
        updatedPhoneNumber = countryCodes + updatedPhoneNumber;
        sendOTP(updatedPhoneNumber);
    }

    useEffect(() => {
        //sendOTP(phoneNo);
        pushNotification()
    }, []);

    const resend = () => {
        let updatedPhoneNumber = phoneNo[0] === '0' ? phoneNo.slice(1) : phoneNo;
        updatedPhoneNumber = '+965' + updatedPhoneNumber;
        sendOTP(updatedPhoneNumber);
        setTextReSend(t('sent'));
        setTimeout(function () {
            setTextReSend(t("Resend"));
        }, 5000)

    }

    const backLogin = () => {
        setOTPCoder()
    }

    useEffect(() => {
        const selectedCountry = countries_en.find((item) => item.label === country);

        if (selectedCountry) {
            setCountryCodes(selectedCountry.code);
        } else {
            setCountryCodes(''); // Optional fallback
        }
    }, [country]);

    return (
        <View style={styles.mainContainer}>

            <Screen scrollable={true}>
                <View style={styles.headerContainer}>

                    <HeaderLogo />
                </View>

                {!getOTPCoder &&
                    <Text style={styles.subTitle}>{t('loginNumber')}</Text>
                }

                {getOTPCoder ?

                    <KeyboardAvoidingView behavior='position' contentContainerStyle={{ paddingBottom: 60 }}>


                        <View>
                            {/* <Text>{'\u2066+965\u2069'}</Text> */}
                            <Text style={styles.title}>{t('otp')}</Text>
                            <Text style={styles.subTitle}>{t('enterDigits')}</Text>

                            <Text style={styles.subTitle}>
                                {'\u2066'}{countryCodes}{phoneNo && phoneNo[0] === '0' ? phoneNo.slice(1) : phoneNo}{'\u2069'}
                            </Text>

                            {/* <Text style={styles.subTitle}>
                            {phoneNo && phoneNo[0] === '0' ? `+965${phoneNo.slice(1)}` : `+965${phoneNo}`}
                        </Text> */}
                            <View style={styles.innerContainer}>
                                <CodeField
                                    ref={ref}
                                    autoFocus
                                    {...props}
                                    value={value}
                                    onChangeText={(text) => {
                                        const digitsOtp = arabicToEnglish(text)
                                        setValue(digitsOtp)
                                    }}
                                    cellCount={CELL_COUNT}
                                    rootStyle={styles.codeFieldRoot}
                                    keyboardType="phone-pad"
                                    textContentType="oneTimeCode"
                                    textInputStyle={{ textAlign: "right", writingDirection: "ltr", textDecorationLine: "line-through" }}
                                    renderCell={({ index, symbol, isFocused }) => (
                                        <View
                                            key={index}
                                            style={[styles.cell, isFocused && styles.focusCell]}
                                        >
                                            <Text
                                                style={[styles.cellTxt]}
                                                onLayout={getCellOnLayoutHandler(index)}
                                            >
                                                {symbol || (isFocused ? <Cursor /> : null)}
                                            </Text>
                                        </View>
                                    )}
                                />


                                <TouchableOpacity onPress={() => resend()}>
                                    <Text style={[styles.subTitle, { marginTop: 15 }]}>{t("DidntRcvcode")} <Text>{getTextReSend ? getTextReSend : t("Resend")}</Text></Text>
                                </TouchableOpacity>


                                <TouchableOpacity onPress={() => backLogin()}>
                                    <Text style={[styles.subTitle, { marginTop: 15 }]}>{t("backtoLogin")}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => onPressLogin()} style={styles.bottomPlaceOrderBox}>
                                    <Text style={[styles.orderTxt, { textAlign: 'center' }]}>{t("verify")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>

                    :
                    <View style={{}}>
                        <View style={{ marginTop: 20 }}>

                            <CustomDropDown
                                data={I18nManager.isRTL ? countries_ar : countries_en}
                                title={t('Country')}
                                placeholder={t('Country')}
                                setValue={setCountry}
                                value={country}
                            />



                            <Text
                                style={{ textAlign: 'left', marginBottom: 10, color: color.theme, marginTop: 20 }}>
                                {t('phoneNumber')}
                            </Text>
                            <View
                                style={{
                                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                                    // justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ccc',
                                    paddingBottom: 10,
                                    gap: 5

                                }}>
                                <Text style={{ color: "#000" }}>{`\u2066${countryCodes}\u2069`}</Text>
                                <TextInput
                                    placeholder={t('phoneNumber')}
                                    value={phoneNo}
                                    keyboardType="number-pad"
                                    onChangeText={(text) => {
                                        const phoneNoDigits = arabicToEnglish(text);
                                        setPhoneNo(phoneNoDigits);
                                    }}
                                    autoCorrect={false}
                                    maxLength={10}
                                    style={{ color: "#000" }}
                                    placeholderTextColor={'#cecece'}

                                />
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => onPressSend()} style={styles.bottomPlaceOrderBox}>
                            <Text style={[styles.orderTxt, { textAlign: 'center' }]}>{t("send")}</Text>
                        </TouchableOpacity>
                    </View>

                }

            </Screen>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 40 : 20,
        backgroundColor: "#fff",
        // paddingHorizontal: 15

    },

    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 15,
        width: '100%',
        justifyContent: 'center'
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
        marginTop: 120,
        color: "#000"
    },
    bottomPlaceOrderBox: {
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: color.theme,
        borderRadius: 50,
        marginTop: 15
    },
    subTitle: {
        fontSize: 13,
        color: "grey",
        textAlign: "center"

    },
    innerContainer: {
        paddingHorizontal: 20,
        marginTop: 30
    },
    phoneTxt: {
        color: "grey",
        fontFamily: "OpenSans-Medium",
        paddingLeft: 10
    },
    con: {
        borderRadius: 10,
        paddingHorizontal: 5,
        shadowColor: "#00000090",
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowOpacity: 0.58,
        shadowRadius: 3,
        backgroundColor: "#fff",
        elevation: 24,
        marginVertical: 15,
        marginBottom: 30,
        width: "92%",
        alignSelf: "center"

    },
    textInput: {
        width: "80%",
        color: "#000"
    },


    orderTxt: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600"
    },



    codeFieldRoot: {
        marginBottom: 30,
        width: "85%",
        alignSelf: "center",
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'

    },
    cell: {
        width: 45,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        paddingBottom: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.29,
        shadowRadius: 3,
        backgroundColor: "#fff",
        elevation: 7,
    },
    cellTxt: {
        fontSize: 25,
        color: "#000",
        top: I18nManager.isRTL ? -4 : -3


    },
    focusCell: {
        borderWidth: 1,
        borderColor: "#fff",
    },


})