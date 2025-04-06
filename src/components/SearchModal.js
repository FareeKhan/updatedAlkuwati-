import { Dimensions, FlatList, Modal, StyleSheet, Text, I18nManager, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ExportSvg from '../constants/ExportSvg';
import SingleProductCard from './SingleProductCard';
import { searchProductByName } from '../services/UserServices';
import { color } from '../constants/color';
const {height } = Dimensions.get('screen')
import { useTranslation } from 'react-i18next';

const SearchModal = ({setModalVisible,modalVisible,navigation}) => {
    const [search, setSearch] = useState('')
    const [foundProduct, setFoundProduct] = useState()
    const { t } = useTranslation();

    useEffect(()=>{
            searchProduct()
    },[search])


    const searchProduct = async () => {
        try {
            const result = await searchProductByName(search)
            if (result?.status) {
              setFoundProduct(result?.data)
            }else{
                setFoundProduct([])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onPressSearch = (id) => {
        setModalVisible(false)
        navigation.navigate('ProductDetails', { id: id })
        setSearch('')
        setFoundProduct('')
    }



  return (
    <View style={styles.centeredView}>
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <View style={styles.searchBoxContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <ExportSvg.crossIcons />
                    </TouchableOpacity>
                    <TextInput
                        placeholder={t("search_here")}
                        value={search}
                        onChangeText={setSearch}
                        style={{textAlign:I18nManager.isRTL? 'right' : 'left', marginLeft: 10,color:"#000",paddingVertical:15,width:'80%'}}
                        placeholderTextColor={"#00000080"}
                    />
                    <TouchableOpacity onPress={searchProduct} style={styles.rightIconSearch}>
                        <ExportSvg.Search />
                    </TouchableOpacity>
                </View>

               
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={foundProduct}
                        keyExtractor={(item, index) => index?.toString()}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        ListEmptyComponent={()=>{
                        return(
                        <View style={{alignItems:"center",justifyContent:"center",flex:1,height:height/1.5}}>
                            <Text style={{color:"#000"}}>{t("no_product_found")}</Text>
                        </View>

                        )
                        }}
                        columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1 }}
                        renderItem={({ item }) => {
                            return (
                                <SingleProductCard
                                    item={item}
                                    onPress={() => onPressSearch(item?.pid)}
                                />
                            )
                        }}

                    />
                </View>
              
            </View>
        </View>
    </Modal>
</View>
  )
}

export default SearchModal

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
       /* backgroundColor: '#00000030',*/

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