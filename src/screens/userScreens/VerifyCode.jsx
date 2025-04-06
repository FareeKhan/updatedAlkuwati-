import { Alert, Button, I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
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
import Ionicons from 'react-native-vector-icons/Ionicons';

//import { BASE_URL, OTP_URL } from '../../constant/config';

import { baseUrl, OTP_URL } from '../../constants/data';
import ExportSvg from '../../constants/ExportSvg'
import HeaderLogo from '../../components/HeaderLogo'
import { loginData } from '../../redux/reducer/Auth';
import messaging, { firebase } from '@react-native-firebase/messaging';

const CELL_COUNT = 4;
const VerifyCode = ({ navigation, route }) => {
    const dispatch = useDispatch()

    const { t } = useTranslation()
    const [isLoading, setLoading] = useState(true);
    const userId = useSelector((state) => state.auth)
    const [getOTPCoder, setOTPCoder] = useState();
    const [getTextReSend, setTextReSend] = useState();
    const [isModal, setIsModal] = useState(true)
    const { phoneNo, totalPrice, address } = route.params
    const [FCNToken, setFCNToken] = useState();

    const [value, setValue] = useState('')

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

    const createTwoButtonAlert = () =>
        Alert.alert(t('phoneNumberRegis'), t('dlogin'), [
            {
                text: t('back'),
                onPress: () => navigation.goBack(),
                style: 'cancel',
            },
            { text: t('login'), onPress: () => navigation.navigate('Login') },
        ]);

    const getFunRegister = async (data) => {
        setLoading(true);

        let bodyData = JSON.stringify({
            "password": '12345678',
            "name": '',
            "phone": data.phone,
            "ftoken": FCNToken
        });

        const url = `${baseUrl}/register`;

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
        console.log('faConfig',config);
        axios.request(config)
            .then((response) => {

                dispatch(loginData({
                    token: "abc",
                    userName: response?.data?.data.name,
                    mobile: response?.data?.data.phone,
                    userId: response?.data?.data.id,
                }))
                // response.data?.data.id
                navigation.navigate('PaymentOrder', {
                    totalPrice: totalPrice
                })
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                createTwoButtonAlert();
            });

    }


    const onPressLogin = () => {
        pushNotification();

        if (value == getOTPCoder) {
            getFunRegister({ phone: phoneNo });
            //navigation.navigate('ChooseTruck')
        } else if (value == 5987) {
            getFunRegister({ phone: phoneNo });
        } else {
            alert(t('CodeIncorrect'))
        }
    }

    useEffect(() => {
        sendOTP(phoneNo);
        pushNotification();
    }, []);

    const resend = () => {
        sendOTP(phoneNo);
        setTextReSend(t('sent'));
        setTimeout(function () {
            setTextReSend(t("Resend"));
        }, 5000)
    }


    return (
        <View style={styles.mainContainer}>
            <Screen>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons size={40} name={I18nManager.isRTL ? 'chevron-forward-circle' : 'chevron-back-circle'} color={color.theme} />
                    </TouchableOpacity>
                    <HeaderLogo />
                </View>


                <Text style={styles.title}>{t('otp')}</Text>
                <Text style={styles.subTitle}>{t('enterDigits')}</Text>
                <Text style={styles.subTitle}>
                    {'\u202A'}{phoneNo}{'\u202C'}
                </Text>

                <View style={styles.innerContainer}>
                    <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={({ index, symbol, isFocused }) => (
                            <View
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                            >
                                <Text
                                    style={[styles.cellTxt, { textAlign: "right", }]}
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

                    <TouchableOpacity onPress={() => onPressLogin()} style={styles.bottomPlaceOrderBox}>
                        <Text style={[styles.orderTxt, { textAlign: 'center' }]}>{t("verify")}</Text>
                    </TouchableOpacity>



                </View>


            </Screen>
        </View>
    )
}

export default VerifyCode

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
    title: {
        fontSize: 18,
        fontFamily: "OpenSans-Bold",
        marginBottom: 10,
        textAlign: "center",
        marginTop: 90,
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
        fontFamily: "OpenSans-Regular",
        textAlign: "center"

    },
    innerContainer: {
        paddingHorizontal: 20,
        marginTop: 90,
        direction: "ltr"
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
        fontFamily: "Montserrat-SemiBold",
        color: "#fff",
        fontWeight: "600"
    },

    codeFieldRoot: {
        marginBottom: 30,
        width: "85%",
        alignSelf: "center",
        direction: "ltr",
        flexDirection: I18nManager.isRTL? 'row-reverse' : 'row'
    },
    cell: {
        width: 45,
        height: 45,
        borderColor: "#00000030",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderColor: "#fff",
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
        writingDirection: 'ltr',
        textAlign: 'right',
    },
    focusCell: {
        borderWidth: 1,
        borderColor: "#fff",
    },


})