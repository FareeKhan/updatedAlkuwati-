import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'
import { useTranslation } from 'react-i18next'
import Text from './CustomText'

const EmptyScreen = ({text}) => {
  const {t} = useTranslation()
  return (
    <View style={{flex:1,alignItems:"center",justifyContent:"center",marginBottom:100,marginTop:50}}>
    <Text style={{fontSize:16,color:color.theme}}>{text ?text :t('noDataFound')}</Text>
</View>
  )
}

export default EmptyScreen

const styles = StyleSheet.create({})