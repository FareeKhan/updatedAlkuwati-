import {
  Dimensions,
  FlatList,
  I18nManager,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {color} from '../constants/color';
import { useNavigation } from '@react-navigation/native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// ITEM SIZE
const ITEM_HORIZONTAL_MARGIN = 10;
const ITEM_WIDTH = SCREEN_WIDTH * 0.9; // 90% of screen
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_HORIZONTAL_MARGIN * 2;

const SliderDots = ({data, imageHeights, dataIndex,setSameScreenId}) => {
  const navigation = useNavigation()
  const [currentIndexDot, setCurrentIndexDot] = useState(0);
  const flatListRef = useRef(null);

  const handleScrollEnd = e => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SNAP_INTERVAL);
    setCurrentIndexDot(index);
  };

  const renderListBanner = ({item, index}) => {
    const bannerHeight = imageHeights[item.id] || 150;

      return (
        <View
          style={{width: ITEM_WIDTH, marginHorizontal: ITEM_HORIZONTAL_MARGIN}}>
          <TouchableOpacity onPress={()=>setSameScreenId(item?.link_category)} activeOpacity={1}>
            <ImageBackground
              source={{uri: item?.image}}
              style={{width: '100%', height: bannerHeight}}
              imageStyle={{borderRadius: 10}}
            />
          </TouchableOpacity>
        </View>
      );
  };

  return (
    <View style={{marginLeft: -17, marginVertical: 10}}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={data}
        renderItem={renderListBanner}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        snapToAlignment="start"
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{paddingHorizontal: ITEM_HORIZONTAL_MARGIN}}
      />

      {/* <View style={styles.dotsContainer}>
                {data?.map((_, dotIndex) => (
                    <View
                        key={dotIndex}
                        style={[
                            styles.dot,

                            {
                                backgroundColor:
                                    currentIndexDot === dotIndex ? color.theme : 'lightgray',
                            },
                        ]}
                    />
                ))}
            </View> */}
    </View>
  );
};

export default SliderDots;

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
