import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'

const CustomLoader = ({title,onPress,style,size,bg=true,colors}) => {
  return (
    <TouchableOpacity style={[styles.btnContainer,bg && { backgroundColor:color.theme},style,]} onPress={onPress}>
      <ActivityIndicator size={size? size:"small"} color={colors?colors:'#fff'} />
    </TouchableOpacity>
  )
}

export default CustomLoader

const styles = StyleSheet.create({
  btnContainer: {

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