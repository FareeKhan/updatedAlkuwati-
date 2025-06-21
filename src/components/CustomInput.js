import { I18nManager, StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'
import { fonts } from '../constants/fonts'
import Text from './CustomText'

const CustomInput = ({ placeholder, value, onChangeText, title, style, ...props }) => {
  return (
    <View style={style}>
      {
        title &&
        <Text style={{ textAlign:"left",marginBottom: 5, color: color.theme, }}>{title}</Text>
      }
      <TextInput
      
      autoCorrect={false}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={color.lightGray}
        style={{ textAlign:I18nManager.isRTL?'right':'left',ddingVertical:15, height:40,borderBottomWidth: 1, paddingBottom: 7, borderColor: color.lightGray, paddingRight: 10,color:"#000" ,fontFamily:fonts.regular}}
        {...props}
      />
    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({})