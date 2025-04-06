import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const CircleLoader = () => {
    return (
        <LottieView
            //   source={require("../assets/loader.json")} // Local JSON file
            source={require("../assets/loader.json")} // Local JSON file
            autoPlay
            loop
            style={{ width: 60, height: 60, }}
        />
    )
}

export default CircleLoader

const styles = StyleSheet.create({})