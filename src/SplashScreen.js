import { Dimensions, I18nManager, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { color } from './constants/color'
import ExportSvg from './constants/ExportSvg'
import { useSelector } from 'react-redux'
import Video, { VideoRef } from 'react-native-video';
import { preloadImagesInBatches, extractProductImages } from './utils/ImagePreloader';
import { newArrivalsData, getFeaturedData, homeBanner } from './services/UserServices';
import ScreenLoader from './components/ScreenLoader'

const { width, height } = Dimensions.get('screen')

const SplashScreen = ({ navigation }) => {
  const isLanguage = useSelector(state => state.auth?.isLanguage);
  const [isPreloading, setIsPreloading] = useState(true);
  const [isVideo, setIsVideo] = useState(true);
  const videoRef = useRef();

  useEffect(() => {
    if (isLanguage === 'ar') {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
    } else {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
    }
  }, [isLanguage])

  useEffect(() => {
    const preloadHomepageImages = async () => {
      try {
        // Fetch all necessary data in parallel
        const [newArrivalsResult, featuredResult, bannerResult] = await Promise.all([
          newArrivalsData(),
          getFeaturedData(),
          homeBanner()
        ]);

        // Extract and collect all images that need preloading
        const imagesToPreload = [];
        
        // New arrivals images
        if (newArrivalsResult?.status === 'success' && newArrivalsResult?.data) {
          newArrivalsResult.data.forEach(item => {
            if (item?.category?.products && Array.isArray(item.category.products)) {
              const productImages = extractProductImages(item.category.products);
              imagesToPreload.push(...productImages);
            }
          });
        }
        
        // Featured products images
        if (featuredResult?.status && featuredResult?.data) {
          const featuredImages = extractProductImages(featuredResult.data);
          imagesToPreload.push(...featuredImages);
        }
        
        // Banner images
        if (bannerResult?.status && bannerResult?.data) {
          bannerResult.data.forEach(banner => {
            if (banner?.image) {
              imagesToPreload.push(banner.image);
            }
          });
        }

        // Preload images in batches
        await preloadImagesInBatches(imagesToPreload);
        
        // Mark preloading as complete
        setIsPreloading(false);
      } catch (error) {
        console.log('Error preloading images:', error);
        // Continue even if preloading fails
        setIsPreloading(false);
      }
    };

    preloadHomepageImages();
  }, []);

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setIsVideo(false)
    },1000)

   return ()=> clearTimeout(timer)
  },[])

  const onVideoEnd = () => {
    if (!isPreloading) {
      // Video has ended and preloading is complete, ready to transition
      // Note: This function does not navigate, it just signals readiness
    }
  };

  return (
    <View style={styles.mainContainer}>
      {
        isVideo ?
             <Video
        source={require('./assets/splash.mp4')}
        ref={videoRef}
        style={styles.backgroundVideo}
        onEnd={onVideoEnd}
        repeat={isPreloading} 
      />
        :
        <ScreenLoader/>
      }
 
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#e8e7ec"
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})