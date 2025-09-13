import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const RenderFeature = ({ item }) => {
  const rotateY = useSharedValue(180); // start from "back"

  // Animate once on mount
  useEffect(() => {
    rotateY.value = withTiming(0, { duration: 700 });
  }, []);

  // Container rotation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }],
  }));

  // Front card opacity


  // Back card opacity
  const backStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rotateY.value, [180, 90], [1, 0]),
  }));

  return (
    <View style={styles.cardContainer}>
      <Animated.View style={[styles.cardWrapper, animatedStyle]}>
        {/* Front */}
        <Animated.View style={[styles.card, ]}>
          <FastImage
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
            <Text style={styles.txtNewCat}>{item.name}</Text>
        </Animated.View>
       
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    height: 150,
    marginBottom: 15,
    perspective: 1000,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  innerNewCatBox: {
  },
  txtNewCat: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
    backgroundColor: '#00000050',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default RenderFeature;
