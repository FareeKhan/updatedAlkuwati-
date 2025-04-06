import { Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ExportSvg from '../constants/ExportSvg';
import SingleProductCard from './SingleProductCard';
import { searchProductByName } from '../services/UserServices';
import { color } from '../constants/color';
import { useTranslation } from 'react-i18next';
const {height } = Dimensions.get('screen')
const CatModal = ({modalVisible,setModalVisible,showFilterProduct,navigation}) => {
   const {t} = useTranslation()
    const onPressSearch = (id) => {
        setModalVisible(false)
        navigation.navigate('ProductDetails', { id: id })
    }

  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <ExportSvg.crossIcons />
                    </TouchableOpacity>
               
                <View style={{ flex: 1,marginTop:20 }}>
                    <FlatList
                        data={showFilterProduct}
                        keyExtractor={(item, index) => index?.toString()}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        ListEmptyComponent={()=>{
                        return(
                        <View style={{alignItems:"center",justifyContent:"center",flex:1,height:height/1.5}}>
                            <Text style={{color:"#000"}}>{t('no_data_found')}</Text>
                        </View>

                        )
                        }}
                        columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1 }}
                        renderItem={({ item }) => {
                            return (
                                <SingleProductCard
                                    item={item}
                                    onPress={() => onPressSearch(item?.id)}
                                />
                            )
                        }}

                    />
                </View>
              
            </View>
        </View>
    </Modal>
  )
}

export default CatModal

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        backgroundColor: '#00000030',

    },
    modalView: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingHorizontal: 15
    },
    searchBoxContainer: {
        paddingHorizontal: 15,
        backgroundColor: color.gray.concat('10'),
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        borderRadius: 30,
        marginBottom:15
    },
    rightIconSearch: {
        marginLeft: "auto",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})