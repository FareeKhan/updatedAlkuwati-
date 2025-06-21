import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { color } from '../constants/color'

const SmallImageLoader = ({ imagePath }) => {
    const [imageLoader, setImageLoader] = useState(false)

    return (
        <View style={{ width: "25%" }}>
            <Image
                borderRadius={5}
                source={{ uri: imagePath }}
                style={{ width: 80, height: 80 }}
                onLoadEnd={() => setImageLoader(false)}
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