import { I18nManager, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'

const CustomInput = ({ placeholder, value, onChangeText, title, style, ...props }) => {
  return (
    <View style={style}>
      {
        title &&
        <View style={{flexDirection:'row' }}>
        <Text style={{ marginBottom: 5, color: color.theme, fontFamily: "Montserrat-Medium",}}>{title}</Text>
        </View>
      }
      <TextInput
      
      autoCorrect={false}
        placeholder={placeholder}
        value={value}
        
        onChangeText={onChangeText}
        placeholderTextColor={color.lightGray}
        style={{ textAlign:I18nManager.isRTL?'right':'left',ddingVertical:15, height:40,borderBottomWidth: 1, paddingBottom: 7, borderColor: color.lightGray, paddingRight: 10,color:"#000" }}
        {...props}
      />
    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({})