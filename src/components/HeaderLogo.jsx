import { View, StyleSheet, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import ExportSvg from '../constants/ExportSvg'
import * as Animatable from 'react-native-animatable';
import RNBounceable from '@freakycoder/react-native-bounceable';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const HeaderLogo = () => {
    const navigation = useNavigation();
    return (
        <View style={{}}>
            <Animatable.Text animation="pulse" iterationCount="infinite" direction="alternate">
                <RNBounceable
                    onPress={() => {
                        ReactNativeHapticFeedback.trigger('impactLight');
                        navigation.navigate('HomeScreen')
                    }}
                    underlayColor='#000'
                    bounceEffectIn={1.1}
                    bounceEffectOut={1}
                    style={{}}
                >
                    <Image  source={require('../assets/logoShow.png')} style={{width:100,height:50}} /> 
                    {/* <Image source={require('../assets/logoImg.png')} style={{width:100,height:100}}  /> */}
                    {/* <ExportSvg.SmallLogo /> */}
                </RNBounceable>
            </Animatable.Text>
        </View>

    )
}

export default HeaderLogo

const styles = StyleSheet.create({

});
