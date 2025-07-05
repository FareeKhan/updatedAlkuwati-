import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { color } from '../constants/color'
import FastImage from 'react-native-fast-image'

const SmallImageLoader = ({ imagePath ,imgStyle,container}) => {
    const [imageLoader, setImageLoader] = useState(false)

    return (
        <View style={[{ width: "25%" },container]}>
            {/* <Image
                borderRadius={5}
                source={{ uri: imagePath }}
                style={{ width: 80, height: 80 }}
            /> */}

            <FastImage
                onLoadEnd={() => setImageLoader(false)}
                source={{
                    uri: imagePath,
                    priority: FastImage.priority.high,
                }}
                style={[{ width: 80, height: 80, borderRadius: 10 },imgStyle]}
                resizeMode={FastImage.resizeMode.contain}
            />

            {
                imageLoader &&
                <View style={{ position: "absolute", alignItems: "center", justifyContent: "center", height: 80, width: 80 }}>
                    <ActivityIndicator size={'small'} color={color.theme} />
                </View>
            }

        </View>

    )
}

export default SmallImageLoader

const styles = StyleSheet.create({})