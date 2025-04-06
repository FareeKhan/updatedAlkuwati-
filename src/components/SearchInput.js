import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import ExportSvg from '../constants/ExportSvg'
import { color } from '../constants/color'

const SearchInput = ({value,onChangeText}) => {
    return (
        <View style={styles.container}>
            <ExportSvg.Search style={{
                marginLeft: 18,
                marginRight: 10
            }} />
            <TextInput
                placeholder='Search...'
                style={{width:"80%",color:"#000"}}
                placeholderTextColor={color.gray}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
            />
        </View>
    )
}

export default SearchInput

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.gray.concat('10'),
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        borderRadius: 30,


    }
})