import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'
import { discount } from '../constants/data'

const CustomButton = ({title,onPress,style,disabled}) => {
  return (
    <TouchableOpacity disabled={disabled} style={[styles.btnContainer,style,disabled&&{backgroundColor:"gray"}]} onPress={onPress}>
      <Text style={styles.innerBtn}>{title }</Text>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: color.theme,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 50,
    paddingHorizontal: 10
  },
  innerBtn: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17
  }
})