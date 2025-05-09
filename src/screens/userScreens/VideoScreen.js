import React, { useState, useRef, useEffect } from 'react';
import { FlatList, View, StyleSheet, Dimensions, TouchableOpacity, StatusBar, ActivityIndicator, Text } from 'react-native';
import Video from 'react-native-video';
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import { color } from '../../constants/color';
import { getReels } from '../../services/UserServices';
import CustomLoader from '../../components/CustomLoader';

const { height, width } = Dimensions.get('window');

const VideoScreen = ({navigation}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [isMute, setIsMute] = useState(false);
    const [data, setData] = useState([]);
    const [isLoader, setIsLoader] = useState(false);


    const videoData = [
        require('../../assets/naat.mp4'),
        require('../../assets/girl.mp4'),
        // Add more local videos
    ];

    useEffect(() => {
        GetReels()
    }, [])

    const GetReels = async () => {
        setIsLoader(true)
        try {
            const response = await getReels()
        console.log('//',response)

            if (response?.length > 0) {
                setData(response)
            } else {
                setData([])
            }
        } catch (error) {
            console.log('error', error)
        }finally{
            setIsLoader(false)
        }
    }

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 80 });

    const renderItem = ({ item, index }) => (
        <TouchableOpacity activeOpacity={1} onPress={() => setPaused(!paused)} style={styles.videoContainer}>
            <Video
                source={{ uri:item?.video_url }}
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
            <TouchableOpacity onPress={() => 
            navigation.navigate("ProductDetails",{
                id:item?.product_id
            })
            } style={{ position: "absolute", bottom: "14%", left: 40 }}>
               <Text style={{fontSize:16,color:color.black,fontWeight:"600"}}>{item?.video_title}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );


    if(isLoader){
        return(
            <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                <ActivityIndicator size={'large'} color={color.theme}  />
            </View>
        )
    }

    return (
        <View>
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
