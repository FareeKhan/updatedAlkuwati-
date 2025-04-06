import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'

const EmptyScreen = ({text}) => {
  return (
    <View style={{flex:1,alignItems:"center",justifyContent:"center",marginBottom:100,marginTop:50}}>
    <Text style={{fontSize:16,fontFamily:"Montserrat-SemiBold",color:color.theme}}>{text}</Text>
</View>
  )
}

export default EmptyScreen

const styles = StyleSheet.create({})