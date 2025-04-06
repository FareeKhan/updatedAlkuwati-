import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Screen = ({scrollable,children,style}) => {
    return (
        <View style={[styles.mainContainer,style]}>
            {
                scrollable ?
                    <ScrollView contentContainerStyle={{paddingBottom:Platform.OS == 'ios' ? 350 :100,paddingHorizontal:5,}} showsVerticalScrollIndicator={false}>
                        {children}
                    </ScrollView>

                    :
              children 
            }
        </View>
    )
}

export default Screen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 15 : -10,
        paddingHorizontal: 20,
        backgroundColor:"#fff"
    }
})