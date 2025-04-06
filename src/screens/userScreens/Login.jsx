import { StyleSheet, Text, TouchableOpacity, View, TextInput, I18nManager, Alert } from 'react-native'
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

import { baseUrl, OTP_URL } from '../../constants/data';
import HeaderLogo from '../../components/HeaderLogo'
import { loginData } from '../../redux/reducer/Auth';

const CELL_COUNT = 4;
const Login = ({ navigation, route }) => {
    const dispatch = useDispatch()

    const { isOrderDetail } = route?.params || {}

    const { t } = useTranslation()
    const [isLoading, setLoading] = useState(true);
    const userId = useSelector((state) => state.auth)
    const [getOTPCoder, setOTPCoder] = useState();
    const [getTextReSend, setTextReSend] = useState();
    const [phoneNo, setPhoneNo] = useState('')

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
        console.log('--->>>', data)
        setLoading(true);
        let bodyData = JSON.stringify({
            // "phone": data.phone,
            "phone": "+96511122233",
            "ftoken": FCNToken,
        });

        const url = `${baseUrl}/loginPhone`;

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
        console.log('config//////', config);
        axios.request(config)
            .then((response) => {

                dispatch(loginData({
                    token: "abc",
                    userName: response?.data?.data.name,
                    mobile: response?.data?.data.phone,
                    userId: response?.data?.data.id,
                }))
                // response.data?.data.id
                //navigation.goBack();
                // navigation.navigate('OrderDetails');
                if (isOrderDetail) {
                    navigation.replace('OrderDetails');
                } else {
                    navigation.replace('BottomNavigation');
                }

                setLoading(false);
            })
            .catch((error) => {
                console.log('error', error);

            });

    }

    const onPressLogin = () => {

        if (value == getOTPCoder) {
            getFunLogin({ phone: phoneNo });
            //navigation.navigate('ChooseTruck')
        } else if (value == 5987) {
            getFunLogin({ phone: phoneNo });
        } else {
            alert(t('CodeIncorrect'))
        }
    }

    const onPressSend = () => {
        if (phoneNo.length <= 7) {
            Alert.alert(t('error'), t('inCorrectNo'))
            return
        }
        if (phoneNo.length > 8) {
            Alert.alert(t('isNotValid'));
        } else {
            let updatedPhoneNumber = phoneNo[0] === '0' ? phoneNo.slice(1) : phoneNo;
            updatedPhoneNumber = '+965' + updatedPhoneNumber;
            sendOTP(updatedPhoneNumber);
        }
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

    return (
        <View style={styles.mainContainer}>
            <Screen>
                <View style={styles.headerContainer}>

                    <HeaderLogo />
                </View>

                {getOTPCoder ?
                    <>
                        {/* <Text>{'\u2066+965\u2069'}</Text> */}
                        <Text style={styles.title}>{t('otp')}</Text>
                        <Text style={styles.subTitle}>{t('enterDigits')}</Text>

                        <Text style={styles.subTitle}>
                            {'\u2066'}+965{phoneNo && phoneNo[0] === '0' ? phoneNo.slice(1) : phoneNo}{'\u2069'}
                        </Text>

                        {/* <Text style={styles.subTitle}>
                            {phoneNo && phoneNo[0] === '0' ? `+965${phoneNo.slice(1)}` : `+965${phoneNo}`}
                        </Text> */}
                    </>
                    :

                    <Text style={styles.subTitle}>{t('loginNumber')}</Text>
                }


                {getOTPCoder ?
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
                    :
                    <View style={{}}>
                        <View style={{ marginTop: 20 }}>
                            <Text
                                style={{ textAlign: 'left', marginBottom: 10, color: color.theme }}>
                                {t('phoneNumber')}
                            </Text>
                            <View
                                style={{
                                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                                    justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ccc',
                                    paddingBottom: 10,

                                }}>
                                <Text style={{ color: "#000" }}>{'\u2066+965\u2069'}</Text>
                                <TextInput
                                    placeholder={t('phoneNumber')}
                                    value={phoneNo}
                                    keyboardType="number-pad"
                                    onChangeText={setPhoneNo}
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
        marginTop: 90
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
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'

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

    },
    focusCell: {
        borderWidth: 1,
        borderColor: "#fff",
    },


})