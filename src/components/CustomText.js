import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'



const CustomText = ({style,children,...props}) => {
  return (
      <Text style={[styles.txtStyle,style]}    {...props}>{children}</Text>
  )
}

export default CustomText

const styles = StyleSheet.create({
    txtStyle:{
        // fontFamily:fonts.regular,
        color:color.black,
        textAlign:"left"
        
    }
})