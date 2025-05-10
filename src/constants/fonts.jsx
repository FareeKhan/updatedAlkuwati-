import { I18nManager, Platform } from "react-native";

const getFont = (rtlFont, ltrFont) => (I18nManager.isRTL ?  ltrFont:rtlFont );


export const fonts = {
  light: getFont(Platform.OS == 'ios'? 'Inter18pt-Light' :'Inter_18pt-Light' , 'Cairo-Light'),
  regular: getFont(Platform.OS == 'ios'? 'Inter18pt-Regular' :'Inter_18pt-Regular' , 'Cairo-Regular'),
  medium: getFont(Platform.OS == 'ios'? 'Inter18pt-Medium' :'Inter_18pt-Medium' , 'Cairo-Medium'),
  semiBold: getFont(Platform.OS == 'ios'?'Inter18pt-SemiBold':'Inter_18pt-SemiBold' , 'Cairo-SemiBold'),
  bold: getFont(Platform.OS == 'ios' ? 'Inter18pt-Bold' : 'Inter_18pt-Bold' , 'Cairo-Bold'),
};