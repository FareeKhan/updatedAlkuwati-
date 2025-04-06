import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { color } from '../constants/color'
import { useTranslation } from 'react-i18next'

const FlatListData = ({ data, selectedItem, setSelectedItem, title ,emptyData}) => {
const {t} = useTranslation()
    const onPressCat = (value) => {
        setSelectedItem((state) => {
            if (state?.includes(value)) {
                return state?.filter((item) => item != value)
            } else {
                return [...state, value]
            }
        })

    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => onPressCat(item?.name)} style={[styles.filterBox, { borderColor: selectedItem?.includes(item?.name) ? color.theme : color.lightGray }]}>
                <Text style={styles.filterTxt}>{item?.name}</Text>
            </TouchableOpacity>
        )
    }


    return (
        <View style={{marginTop:20}}>
            <Text style={styles.catTxt}>{title}</Text>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
                style={{ flexWrap: "wrap" }}
                ListEmptyComponent={()=>{
                    return(
                        <View>
                            <Text>{emptyData ? emptyData : t('no_data_found')}</Text>
                        </View>

                    )
                }}
            />
        </View>
    )
}

export default FlatListData

const styles = StyleSheet.create({
    catTxt: {
        fontSize: 18,
        fontWeight: "700",
        color: color.theme,
        textAlign:"left"
    },
    filterTxt: {
        // fontWeight: "600",
        color: color.theme,
        fontFamily: "Montserrat-SemiBold",
    },
    filterBox: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
        borderRadius: 50,
        marginTop: 10,
        borderColor: color.lightGray,


    },
    filterTxt: {
        // fontWeight: "600",
        color: color.theme,
        fontFamily: "Montserrat-SemiBold",
    },
})