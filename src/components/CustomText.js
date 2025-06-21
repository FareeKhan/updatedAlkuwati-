import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'
import { fonts } from '../constants/fonts'



const CustomText = ({style,children,...props}) => {
  return (
      <Text style={[styles.txtStyle,style]}    {...props}>{children}</Text>
  )
}

export default CustomText

const styles = StyleSheet.create({
    txtStyle:{
        color:color.black,
        textAlign:"left",
        fontFamily:fonts.regular
    }
})