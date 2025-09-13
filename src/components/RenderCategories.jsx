import { I18nManager, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RNBounceable from '@freakycoder/react-native-bounceable';
import withPressAnimated from '../screens/userScreens/hocs/withPressAnimated';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { fonts } from '../constants/fonts';

const RenderCategories = ({item, index,setSameScreenId}) => {
    const AnimatedPressButton = withPressAnimated(RNBounceable);
   return (
      <Animated.View
     entering={FadeInRight.delay(index * 100).duration(600)}
        style={styles.cateListBox}>
        <AnimatedPressButton
          style={{alignItems: 'center', marginBottom: 15}}
          animation="rubberBand"
          mode="contained"
          onPress={() => setSameScreenId(item?.id)}>
          <ImageBackground
            source={{uri: item.image}}
            style={{width: 60, height: 60, marginRight: 5}}
            borderRadius={10}/>
          <Text
            style={{
              fontSize: 12,
              marginTop: 5,
              textAlign: 'center',
              fontFamily:fonts.regular
            }}>
            {I18nManager.isRTL?  item?.name : item?.name_en  || item?.name}
          </Text>
        </AnimatedPressButton>
      </Animated.View>
    );
}

export default RenderCategories

const styles = StyleSheet.create({
      cateListBox: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderColor: '#301A58',
    borderRadius: 10,
    width: 70,
    height: 130,
    marginHorizontal: 2,
    marginVertical: 10,
  },

})