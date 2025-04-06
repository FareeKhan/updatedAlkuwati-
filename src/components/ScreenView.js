import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { color } from '../constants/color'

const ScreenView = ({ scrollable, ph = true, pt = true, children, style }) => {
    return (
        <View style={[styles.container, ph && styles.ph, pt && styles.pt, style]}>
            {
                scrollable ?
                    <ScrollView style={{ marginHorizontal: -20, paddingHorizontal: 20 }} contentContainerStyle={{ paddingBottom: 100 }}>
                        {children}
                    </ScrollView>
                    :
                    children
            }
        </View>
    )
}

export default ScreenView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
    },
    ph: {
        paddingHorizontal: 20
    },
    pt: {
        paddingTop: Platform.OS == 'ios' ? 40 : 20

    }
})