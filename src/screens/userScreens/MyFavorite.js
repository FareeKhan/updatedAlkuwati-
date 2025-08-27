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
import HeaderBox from '../../components/HeaderBox'
const MyFavorite = ({ navigation }) => {
      const userId = useSelector(state => state.auth?.userId);
    
    const favoriteData = useSelector((state) => state?.favorite?.AddInFavorite)
    const { t } = useTranslation();

    console.log('ssfavoriteDatas',favoriteData)

    const renderItem = ({ item, index }) => {
        return (
            <>
                <SingleProductCard
                    isDot={false}
                    item={item}
                    onPress={() => navigation.navigate('ProductDetails', { id: item?.id })}
                />
            </>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <HeaderBox
                cartIcon={true}
                style={{ marginTop: Platform.OS == 'ios'? 30:20, marginBottom: 20 }}
            />

            {
                userId ? 

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
                        contentContainerStyle={{ paddingBottom: 100 }}
                        columnWrapperStyle={{ justifyContent: "space-between", flexGrow: 1, }}
                    />
                    :
                     <EmptyScreen
                        text={t("seeFavorite")}
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