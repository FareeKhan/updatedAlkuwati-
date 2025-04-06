import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import ExportSvg from '../constants/ExportSvg';
import { color } from '../constants/color';
import HeaderLogo from './HeaderLogo';
import { useTranslation } from 'react-i18next';

const PaymentSuccessModal = ({isPaymentSuccess,setIsPaymentSuccess,navigation}) => {
const {t} = useTranslation()
    const onPress = ()=>{
        setIsPaymentSuccess(false)
        navigation.replace('BottomNavigation')
    }

    return (
        <View>
           
            <Modal
                animationType="fade"
                transparent={true}
                visible={isPaymentSuccess}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setIsPaymentSuccess(!isPaymentSuccess);
                }}>
                {/* <TouchableWithoutFeedback onPress={() => setIsPaymentSuccess(false)} > */}
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalView}>
                                <HeaderLogo />
                                <Text style={styles.modalText}>{t('paymentSuccess')}</Text>
                                <Text style={styles.modalSmallTxt}>{t('paymentSubText')}</Text>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={onPress}>
                                    <Text style={styles.textStyle}>{t('continueShopping')}</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                {/* </TouchableWithoutFeedback> */}
            </Modal>
        </View>
    )
}

export default PaymentSuccessModal

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"#00000070"
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
        height: 325,
        justifyContent: "center",
        paddingTop: 30
    },
    button: {
        borderRadius: 20,
        paddingVertical: 8,
        elevation: 2,
        backgroundColor: color.theme,
        paddingHorizontal: 15
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        // backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        textAlign: 'center',
        fontFamily: "Montserrat-Bold",
        paddingHorizontal:15,
        paddingVertical:5,
        fontSize: 16,

    },
    modalText: {
        fontWeight: "700",
        fontFamily: "Montserrat-Bold",
        color: color.theme,
        fontSize: 25,
        marginTop: 25,
        marginBottom: 10
    },
    modalSmallTxt: {
        fontFamily: "Montserrat-Regular",
        color: color.gray,
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 20
    }
})