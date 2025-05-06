import React, { useState, useRef } from 'react';
import { FlatList, View, StyleSheet, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import Video from 'react-native-video';
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import { color } from '../../constants/color';

const { height, width } = Dimensions.get('window');

const VideoScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [isMute, setIsMute] = useState(false);
    const videoData = [
        require('../../assets/naat.mp4'),
        require('../../assets/girl.mp4'),
        // Add more local videos
    ];

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 80 });

    const renderItem = ({ item, index }) => (
        <TouchableOpacity activeOpacity={1} onPress={() => setPaused(!paused)} style={styles.videoContainer}>
            <Video
                source={item}
                style={styles.video}
                resizeMode="cover"
                repeat
                muted={isMute || index !== currentIndex}
                paused={paused || index !== currentIndex}
            />

            {
                paused &&
                <TouchableOpacity onPress={() => setPaused(false)} style={{ position: "absolute", top: "35%", right: "35%" }}>
                    <Entypo name={'controller-play'} size={100} color={"#ffffff80"} />
                </TouchableOpacity>
            }


            <TouchableOpacity onPress={() => setIsMute(!isMute)} style={{ position: "absolute", bottom: "14%", right: "8%" }}>
                {
                    isMute ?
                    <Ionicons name={'volume-mute'} size={40} color={"#ffffff80"} />
                    :
                    <Octicons name={'unmute'} size={40} color={"#ffffff80"} />
                }
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View>
            <StatusBar backgroundColor={'#000'} />
            <FlatList
                data={videoData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToAlignment="start"
                decelerationRate="fast"
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    videoContainer: {
        height,
        width,
    },
    video: {
        height: '100%',
        width: '100%',
    },
});

export default VideoScreen;
