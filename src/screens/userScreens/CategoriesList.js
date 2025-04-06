import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ExportSvg from '../../constants/ExportSvg'
import SearchInput from '../../components/SearchInput'
import { color } from '../../constants/color'
import { dressList } from '../../constants/data'
import { categoriesList } from '../../services/UserServices'
import HeaderLogo from '../../components/HeaderLogo'

const CategoriesList = ({ navigation }) => {
  const [selectedCat, setSelectedCat] = useState()

  const categoryList = [
    {
      title: "Dresses"
    },
    {
      title: "Jackets"
    },
    {
      title: "Jeans"
    },
    {
      title: "Shoes"
    },
  ]




  const renderItem = ({ item, index }) => {
    const isSecondColumn = (index % 2 !== 0);

    return (
      <View style={isSecondColumn && { top: 40 }}>
        <Image source={item?.img} />
        <View style={{ position: "absolute", right: 0, padding: 10 }}>
          <ExportSvg.Favorite />
        </View>
        <View style={{ marginVertical: 20, alignItems: "center" }}>
          <Text style={styles.imgTitle}>{item?.title}</Text>
          <Text style={styles.imgSubTitle}>{item?.subTxt}</Text>
          <Text style={styles.imgPriceTitle}>{item?.price}</Text>
        </View>
      </View>
    )
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ExportSvg.MenuBar />
        </TouchableOpacity>
        <HeaderLogo/>
        <ExportSvg.Cart />
      </View>
      <View style={styles.searchContainer}>
        <View style={{ width: "82%" }}>
          <SearchInput />
        </View>
        <TouchableOpacity >
          <ExportSvg.Filter />
        </TouchableOpacity>
      </View>

      <View style={styles.catBox}>
        {
          categoryList?.map((item, index) => {
            return (
              <TouchableOpacity onPress={() => setSelectedCat(item?.title)} key={index} style={[styles.innerCatBox, selectedCat == item?.title && { backgroundColor: color.theme }]}>
                <Text style={[styles.catTxt, selectedCat == item?.title && { color: "#fff" }]}>{item?.title}</Text>
              </TouchableOpacity>
            )
          })
        }
      </View>

      <View style={{ marginTop: 25, flex: 1 }}>
        <FlatList
          data={dressList}
          numColumns={2}
          keyExtractor={(item, index) => index?.toString()}
          renderItem={renderItem}
          columnWrapperStyle={{ justifyContent: "space-around" }}
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

    </View>
  )
}

export default CategoriesList

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
    marginBottom: 15
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20
  },
  catBox: {
    flexDirection: "row"
  },
  innerCatBox: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginRight: 10,
    borderRadius: 50,
    borderColor: "#ccc"
  },
  catTxt: {
    color: color.theme,
    fontFamily: 'Montserrat-SemiBold',
    // fontWeight: "500"
  },

  imgTitle: {
    color: color.theme,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: "600"
  },
  imgSubTitle: {
    color: color.gray,
    fontSize: 13,
    fontWeight: "300",
    marginVertical: 4,
    fontFamily: 'Montserrat-Regular',

  },
  imgPriceTitle: {
    color: color.theme,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: "600"
  }
})