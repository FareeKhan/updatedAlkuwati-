import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'
import * as Animatable from 'react-native-animatable';
import ExportSvg from '../constants/ExportSvg';

const ScreenLoader = ({ title, onPress, style }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <Animatable.View  animation="slideInDown" iterationCount="infinite" direction="alternate">
        <Image  source={require('../assets/logoShow.png')} resizeMode='center'   /> 
      </Animatable.View>       */}
      <ActivityIndicator color="#bb5533" size="large"  style={{marginTop:25}} />
    </View>
  )
}

export default ScreenLoader

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: color.theme,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 50,
    paddingHorizontal: 10
  },

})

        {/* <ExportSvg.SmallLogo /> */}
