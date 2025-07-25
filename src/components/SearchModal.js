import { Dimensions, FlatList, Modal, StyleSheet, Text, I18nManager, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import ExportSvg from '../constants/ExportSvg';
import SingleProductCard from './SingleProductCard';
import { searchProductByName } from '../services/UserServices';
import { color } from '../constants/color';
const { height } = Dimensions.get('screen')
import { useTranslation } from 'react-i18next';
import { fonts } from '../constants/fonts';

import HeaderLogo from './HeaderLogo';



import { preloadImagesInBatches, extractProductImages, isImagePreloaded, PRIORITY } from '../utils/ImagePreloader';

const SearchModal = ({ setModalVisible, modalVisible, navigation }) => {
    const [search, setSearch] = useState('')
    const [foundProduct, setFoundProduct] = useState()
    const [isLoader, setIsLoader] = useState(false)
    const [imageLoadingProgress, setImageLoadingProgress] = useState(0)
    const [imagesPreloaded, setImagesPreloaded] = useState(false)
    const isMountedRef = useRef(true)
    const { t } = useTranslation();

    useEffect(() => {
        isMountedRef.current = true
        searchProduct()
        return () => {
            isMountedRef.current = false
        }
    }, [search])

    const searchProduct = async () => {
        setIsLoader(true)
        setImagesPreloaded(false)
        try {
            const result = await searchProductByName(search)
            if (result?.status) {
                setFoundProduct(result?.data)
                const allImages = extractProductImages(result?.data || [])
                if (allImages.length > 0) {
                    const allPreloaded = allImages.every(isImagePreloaded)
                    if (allPreloaded) {
                        setImagesPreloaded(true)
                        setIsLoader(false)
                    } else {
                        await preloadImagesInBatches(
                            allImages,
                            5,
                            (completed, total) => {
                                if (!isMountedRef.current) return
                                setImageLoadingProgress(Math.round((completed / total) * 100))
                            },
                            { priority: PRIORITY.HIGH }
                        )
                        if (isMountedRef.current) {
                            setImagesPreloaded(true)
                            setIsLoader(false)
                        }
                    }
                } else {
                    setImagesPreloaded(true)
                    setIsLoader(false)
                }
            } else {
                setFoundProduct([])
                setImagesPreloaded(true)
                setIsLoader(false)
            }
        } catch (error) {
            setIsLoader(false)
            setImagesPreloaded(true)
        }
    }

    const onPressSearch = (id) => {
        setModalVisible(false)
        navigation.navigate('ProductDetails', { id: id })
        setSearch('')
        setFoundProduct('')
    } 
    
    const onPressCross = () => {
       setModalVisible(false)
       setSearch('')
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
                            <TouchableOpacity onPress={onPressCross}>
                                <ExportSvg.crossIcons />
                            </TouchableOpacity>
                            <TextInput
                                placeholder={t("search_here")}
                                value={search}
                                onChangeText={setSearch}
                                style={{ textAlign: I18nManager.isRTL ? 'right' : 'left', marginLeft: 10, color: "#000", paddingVertical: 15, width: '80%',fontFamily:fonts.regular }}
                                placeholderTextColor={"#00000080"}
                            />
                            <TouchableOpacity onPress={searchProduct} style={styles.rightIconSearch}>
                                <ExportSvg.Search />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            {isLoader || !imagesPreloaded ? (
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <ActivityIndicator size={"small"} color={color.theme}   />
                                </View>
                            ) : (
                                <FlatList
                                    data={search?.length>0 && foundProduct}
                                    keyExtractor={(item, index) => index?.toString()}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={{ alignItems: "center", justifyContent: "center", flex: 1, height: height / 1.5 }}>
                                                <Text style={{ color: "#000" ,fontFamily:fonts.semiBold}}>{search?.length > 0 ? t("no_product_found") : <HeaderLogo/>}</Text>
                                            </View>
                                        )
                                    }}
                                    columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1 }}
                                    renderItem={({ item }) => {
                                        return (
                                            <SingleProductCard
                                                isDot={false}
                                                item={item}
                                                setModalVisible={setModalVisible}
                                                onPress={() => onPressSearch(item?.id)}
                                            />
                                        )
                                    }}
                                />
                            )}
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        marginBottom: 15,
        marginTop:40
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