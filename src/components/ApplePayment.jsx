// import React, { useRef } from "react";
// import { Platform, StyleSheet, View, Button, Dimensions } from "react-native";
// import {
//   MFApplePayButtonView,
//   MFApplePayStyle,
//   MFExecutePaymentRequest,
//   MFCurrencyISO,
//   MFLanguage,
// } from "myfatoorah-reactnative";
// import CustomButton from "./CustomButton";

// const ApplePayment = ({sessionId}) => {
// console.log('fareed',sessionId)

//       var applePayView: MFApplePayButtonView | null;

//       	const applePayStyle = () => {
//     var applePayButton = new MFApplePayStyle(50, 50, 'Buy with', true);
//     return applePayButton;
//   };


//     const applePay = async () => {
//     var executePaymentRequest = new MFExecutePaymentRequest(10);
//     executePaymentRequest.displayCurrencyIso = MFCurrencyISO.KUWAIT_KWD;
//     executePaymentRequest.sessionId = sessionId ?? '';

//     await applePayView
//       ?.applePayPayment(executePaymentRequest, MFLanguage.ARABIC, (invoiceId: string) => console.log('invoiceId: ' + invoiceId))
//       .then((success) => console.log(success))
//       .catch((error) => console.log(error));
//   };



//   return (
//      <View style={styles.container}>
//       {Platform.OS === 'ios' && (
//         <MFApplePayButtonView
//           ref={applePayView}
//           style={styles.applePayButton}
//           applePayButtonStyle={applePayStyle()}
//         />
//       )}

//       {/* <CustomButton onPress={applePay} title={'Pay'} /> */}
//     </View>
//   )
// }

// export default ApplePayment

// const styles = StyleSheet.create({
//     container: {
//     // alignItems: 'center',
//   },
//   applePayButton: {
//     width: Dimensions.get('window').width - 120, // full width minus padding
//     marginBottom: 20,
//   },
// })

import React, { useRef } from "react";
import { Platform, StyleSheet, View, Dimensions } from "react-native";
import {
  MFApplePayButtonView,
  MFApplePayStyle,
  MFExecutePaymentRequest,
  MFCurrencyISO,
  MFLanguage,
} from "myfatoorah-reactnative";

const ApplePayment = ({ sessionId }) => {
  let applePayView: MFApplePayButtonView | null = null;
  console.log('ss',sessionId)

  const applePayStyle = () => new MFApplePayStyle(50, 50, 'Buy with', true);

  const applePay = async () => {
    const executePaymentRequest = new MFExecutePaymentRequest(10);
    executePaymentRequest.displayCurrencyIso = MFCurrencyISO.KUWAIT_KWD;
    executePaymentRequest.sessionId = sessionId ?? '';

    try {
      const success = await applePayView?.applePayPayment(
        executePaymentRequest,
        MFLanguage.ARABIC,
        (invoiceId: string) => console.log('invoiceId:', invoiceId)
      );
      console.log('Apple Pay Success:', success);
    } catch (error) {
      console.log('Apple Pay Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && (
        <MFApplePayButtonView
          ref={(ref) => { applePayView = ref }}
          style={styles.applePayButton}
          applePayButtonStyle={applePayStyle()}
        />
      )}
    </View>
  );
};

export default ApplePayment;

const styles = StyleSheet.create({
  container: {},
  applePayButton: {
    width: Dimensions.get('window').width - 120,
    height: 50, // must set height
    marginBottom: 20,
  },
});
