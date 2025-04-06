import { FlatList, I18nManager, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import SingleProductCard from '../../components/SingleProductCard'
import ExportSvg from '../../constants/ExportSvg'
import { color } from '../../constants/color'
import EmptyScreen from '../../components/EmptyScreen'
import HeaderLogo from '../../components/HeaderLogo'
import { useTranslation } from 'react-i18next';

import Ionicons from 'react-native-vector-icons/Ionicons'
const MyFavorite = ({ navigation }) => {
    const favoriteData = useSelector((state) => state?.favorite?.AddInFavorite)
    const { t } = useTranslation();

    const renderItem = ({ item, index }) => {
        return (
            <>
                <SingleProductCard
                    item={item}
                    onPress={() => navigation.navigate('ProductDetails', { id: item?.pid })}
                />
            </>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                                          <Ionicons size={40} name={I18nManager.isRTL ? 'chevron-forward-circle': 'chevron-back-circle'} color={color.theme} />
                                        </TouchableOpacity>
                <View style={{ marginLeft: "auto", marginRight: "auto" }}>
                    <HeaderLogo />
                </View>
            </View>

            {
                favoriteData?.length == 0 ?
                    <EmptyScreen
                        text={t("no_product_in_favorite")}
                    />
                    :
                    <FlatList
                        data={favoriteData}
                        keyExtractor={(item, index) => index?.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1 }}
                    />
            }


        </View>
    )
}

export default MyFavorite

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 40 : 20,
        paddingHorizontal: 15,
        backgroundColor: "#fff"
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        marginTop: 15,
        width: "90%"
    },
})