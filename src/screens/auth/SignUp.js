import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ExportSvg from '../../constants/ExportSvg'
import { color } from '../../constants/color'
// import CountryPicker from 'react-native-country-picker-modal';
import CustomButton from '../../components/CustomButton';
import { registerUser } from '../../services/AuthServices';
import CustomInput from '../../components/CustomInput';
import CustomLoader from '../../components/CustomLoader';
// import messaging, { firebase } from '@react-native-firebase/messaging';

const SignUp = ({ navigation }) => {
    const [countryCode, setCountryCode] = useState('+971');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isLoader, setIsLoader] = useState(false);
    const [getfcmToken, setfcmToken] = useState();

    const handleSelectCountry = (e) => {
        setCountryCode(`+${e?.callingCode[0]}`)
        setIsModalVisible(false)
    }
    const pushNotification = async () => {

        let fcmToken = await messaging().getToken();
    
        if (fcmToken) {
          console.log("=====tokeb Sigup", fcmToken);
          setfcmToken(fcmToken);
        }
       // Alert.alert(fcmToken,"asdasd");
      }

    const signUp = async () => {
        const phoneNumber = countryCode.concat(mobile)
        try {
            if (!userName) {
                alert('please Enter User name')
            } else if (!mobile) {
                alert('please Enter mobile number')
            } else if (!password) {
                alert('please Enter password')
            } else {
                setIsLoader(true)
                const response = await registerUser(userName, phoneNumber, password)
                if (response.status == true) {
                    setIsLoader(false)
                    alert('Account has been Successfully created')
                    setUserName('')
                    setMobile('')
                    setPassword('')
                } else {
                    alert(response.error.phone[0])
                    setIsLoader(false)

                }
            }

        } catch (error) {
            console.log(error)
            setIsLoader(false)

        }
    }


    // useEffect(() => {
    //     pushNotification();
    // }, []);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ExportSvg.Arrow2 />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <ExportSvg.LoginLogo />
                </View>
            </View>
            <Text style={styles.headerTxt}>SignUp your account here</Text>

            <Text style={[styles.mobileTxt]}>User Name</Text>

            <View style={{ marginBottom: 15 }}>
                <TextInput
                    placeholder='Enter your name'
                    style={styles.optInput}
                    value={userName}
                    onChangeText={setUserName}
                    placeholderTextColor={color.gray}
                />
            </View>


            <Text style={styles.mobileTxt}>Mobile Number</Text>
            <View style={[styles.mobileNumberContainer]}>
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    <Text style={{ paddingRight: 5, color: "#9B9B9B" }}>{countryCode}</Text>
                </TouchableOpacity>

                <TextInput
                    placeholder='Enter Number'
                    style={styles.inputStyle}
                    value={mobile}
                    onChangeText={setMobile}
                    placeholderTextColor={color.gray}
                />
                {
                    mobile.length > 5 && <View style={{}}>
                        <ExportSvg.CheckMark />
                    </View>
                }
            </View>

            <Text style={[styles.mobileTxt, { marginTop: 5 }]}>Password</Text>

            <View>
                <TextInput
                    placeholder='*****'
                    style={[styles.optInput, {}]}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={color.gray}
                />

                {
                    password?.length >= 4 &&
                    <View style={styles.checkMarkIconBox}>
                        <ExportSvg.CheckMark />
                    </View>
                }

            </View>

            <View style={{ marginTop: 30 }}>
                {
                    isLoader ?
                        <CustomLoader />
                        :

                        <CustomButton
                            title={'SignUp'}
                            onPress={signUp}
                         
                        />
                }

            </View>
            <Text style={[styles.headerSubTxt, { marginTop: 10 }]}>Have an account? Click for <Text style={styles.BoldSocialName} onPress={() => navigation.goBack()}>Login</Text></Text>

            <View style={styles.orTxtBox}>
                <View style={styles.orBorder} />
                <Text style={{ color: "#000" }}>or</Text>
                <View style={styles.orBorder} />
            </View>


            <View style={{ marginTop: 40 }}>
                <TouchableOpacity style={styles.SocialLoginBox}>
                    <ExportSvg.Google />
                    <Text style={styles.socialTxt}>Continue with <Text style={styles.BoldSocialName}>Google</Text></Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.SocialLoginBox}>
                    <ExportSvg.Apple />
                    <Text style={styles.socialTxt}>Continue with <Text style={styles.BoldSocialName}>Apple</Text></Text>
                </TouchableOpacity>
            </View>


            {/* <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <CountryPicker
                    withFilter
                    withFlag
                    withAlphaFilter
                    withCallingCode
                    withEmoji
                    onSelect={(e) => handleSelectCountry(e)}
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                />
            </Modal> */}

        </View>
    )
}

export default SignUp

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 15,
        backgroundColor: "#fff"
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
        marginTop: 15,
        paddingHorizontal: 15,
    },
    logoContainer: {
        alignItems: "center"
    },
    headerTxt: {
        fontSize: 17,
        fontFamily: "Montserrat-SemiBold",
        marginTop: 30,
        marginBottom: 10,
        color: "#000"

    },
    headerSubTxt: {
        fontFamily: "Montserrat-Regular",
        marginBottom: 30,
        color: "#000",
    },
    mobileTxt: {
        fontFamily: "Montserrat-SemiBold",
        color: "#000"
    },
    mobileNumberContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        paddingBottom: 5,
        marginTop: Platform.OS == 'ios' ? 5 : 0,
        borderColor: "#9B9B9B50",
        marginBottom: 10

    },
    inputStyle: {
        width: "85%",
        color: "#000",
        paddingVertical: 0
    },
    optInput: {
        borderBottomWidth: 1,
        borderColor: "#EEE",
        marginTop: 5,
        paddingVertical: 0,
        color: "#000",
        paddingBottom: 5

    },
    orTxtBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20
    },
    orBorder: {
        width: '43%',
        height: 2,
        backgroundColor: "#EEEEEE"
    },
    checkMarkIconBox: {
        position: "absolute",
        right: 0,
        top: 10
    },
    SocialLoginBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        height: 50,
        justifyContent: "center",
        borderRadius: 50,
        borderColor: "#EEEEEE",
        marginBottom: 20


    },
    BoldSocialName: { fontWeight: "600", fontFamily: "Montserrat-SemiBold", },
    socialTxt: {
        fontSize: 16,
        fontWeight: "500",
        fontFamily: "Montserrat-Medium",
        marginLeft: 15,
        color: color.theme
    }

})