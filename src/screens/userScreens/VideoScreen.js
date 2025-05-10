import React, { useState, useRef, useEffect } from 'react';
import {
    FlatList,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Text,
} from 'react-native';
import Video from 'react-native-video';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { color } from '../../constants/color';
import { getReels } from '../../services/UserServices';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');

const VideoScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const isFocused = useIsFocused();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [isMute, setIsMute] = useState(false);
    const [data, setData] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    console.log('isFocused',isFocused)

    useEffect(() => {
        GetReels();
    }, []);

    useEffect(() => {
        setPaused(!isFocused);
    }, [isFocused]);

    const GetReels = async () => {
        setIsLoader(true);
        try {
            const response = await getReels();
            if (response?.length > 0) {
                setData(response);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setIsLoader(false);
        }
    };

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 80 });

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => setPaused(!paused)}
            style={styles.videoContainer}
        >
            <Video
                source={{ uri: item?.video_url }}
                style={styles.video}
                resizeMode="cover"
                repeat
                muted={isMute || index !== currentIndex}
                paused={paused || index !== currentIndex}
            />

            {paused && (
                <TouchableOpacity onPress={() => setPaused(false)} style={styles.playButtonContainer}>
                    <Entypo name={'controller-play'} size={100} color={'#ffffff80'} />
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setIsMute(!isMute)} style={styles.muteButton}>
                {isMute ? (
                    <Ionicons name={'volume-mute-outline'} size={28} color={'#ffffff'} />
                ) : (
                    <Ionicons name={'volume-high-outline'} size={28} color={'#ffffff'} />
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setIsMute(!isMute)
                    navigation.navigate('ProductDetails', {
                        id: item?.product_id,
                    })
                }
                }
                style={styles.moreInfoButton}
            >
                <Text style={styles.moreInfoText}>{t('MoreInfo')}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (isLoader) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={color.theme} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#000'} />
            <FlatList
                data={data}
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
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoContainer: {
        height,
        width,
    },
    video: {
        height: '100%',
        width: '100%',
    },
    playButtonContainer: {
        position: 'absolute',
        top: '35%',
        right: '35%',
    },
    muteButton: {
        position: 'absolute',
        bottom: '14%',
        right: '8%',
        borderWidth: 1,
        borderRadius: 50,
        borderColor: color.white,
        padding: 5,
        backgroundColor: '#ffffff50',
    },
    moreInfoButton: {
        position: 'absolute',
        bottom: '15%',
        right: 90,
        backgroundColor: '#ffffff50',
        paddingHorizontal: 13,
        borderRadius: 3,
    },
    moreInfoText: {
        fontSize: 16,
        color: color.white,
        fontWeight: '600',
    },
    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default VideoScreen;
