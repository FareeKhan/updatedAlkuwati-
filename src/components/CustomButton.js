import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'
import { discount } from '../constants/data'
import { fonts } from '../constants/fonts'

const CustomButton = ({title,onPress,style,disabled,isLoader}) => {
  return (
    <TouchableOpacity disabled={disabled} style={[styles.btnContainer,style,disabled&&{backgroundColor:"gray"}]} onPress={onPress}>
      <Text style={styles.innerBtn}>{title} {isLoader &&  <ActivityIndicator size={'small'} color={"#fff"}  style={{marginTop:2}}/>}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: color.theme,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  innerBtn: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
    fontFamily:fonts.regular
  }
})