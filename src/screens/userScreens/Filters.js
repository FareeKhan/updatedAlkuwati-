import {
  Dimensions,
  FlatList,
  I18nManager,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ExportSvg from "../../constants/ExportSvg";
import { color } from "../../constants/color";
import { colorData, filters, ratingStar, sorted } from "../../constants/data";
import CustomButton from "../../components/CustomButton";
import {
  fetchAllProducts,
  filterData,
  filterPriceRange,
} from "../../services/UserServices";
import FlatListData from "../../components/FlatListData";
import ScreenLoader from "../../components/ScreenLoader";
import CatModal from "../../components/CatModal";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import HeaderLogo from "../../components/HeaderLogo";
const { width } = Dimensions.get("screen");
import { useTranslation } from "react-i18next";
import { sizeData } from "../../constants/data";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

import { isAnimationTerminatingCalculation } from "react-native-reanimated/lib/typescript/animation/springUtils";

const Filters = ({ navigation, route }) => {
  const { categories } = route?.params;
  const [activeRating, setActiveRating] = useState();
  const [selectedCat, setSelectedCat] = useState([]);
  const [selectedSort, setSelectedSort] = useState([]);
  const [selectGender, setSelectedGender] = useState([]);
  const [selectAge, setSelectedAge] = useState([]);

  const [isLoader, setIsLoader] = useState(false);
  const [storeFilter, setStoreFilter] = useState("");
  const [storeProducts, setStoreProducts] = useState([]);
  const [showFilterProduct, setShowFilterProduct] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [startingPrice, setStartingPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1);

  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);

  const { t } = useTranslation();

  const onAgeRangeChange = (values) => {
    setStartingPrice(values[0]);
    setEndPrice(values[1]);
  };

  const sliderSet = (a, b) => {
    console.log("val", a);
    console.log("valb", b);
  };

  useEffect(() => {
    getFilterData();
    getAllProducts();
    getFilterPriceRange();
  }, []);

  const getFilterData = async () => {
    setIsLoader(true);
    try {
      const response = await filterData();
      if (response?.status) {
        setIsLoader(false);
        setStoreFilter(response?.data);
      } else {
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      console.log(error);
    }
  };

  const getFilterPriceRange = async () => {
    setIsLoader(true);
    try {
      const response = await filterPriceRange();
      if (response?.status) {
        setIsLoader(false);
        if (response?.data) {
          setEndPrice(parseFloat(response?.data[0].max_price).toFixed(0));
          setMaxPrice(parseFloat(response?.data[0].max_price).toFixed(0));
        }
      } else {
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await fetchAllProducts();
      if (response?.length > 0) {
        setStoreProducts(response);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoader) {
    return <ScreenLoader />;
  }

  const onPress = () => {
    const filteredProducts = storeProducts?.filter((product) => {
      const isCategoryMatch = selectedCat && selectedCat.length > 0
        ? product?.categories?.some((category) => selectedCat.includes(category))
        : true; 
    
      const isPriceMatch = product?.price >= startingPrice && product?.price <= endPrice;
    
      const isSizeMatch = selectedSize && selectedSize.length > 0
        ? product?.size?.some((size) => selectedSize.includes(size))
        : true; 
    
      const isColorMatch = selectedColor && selectedColor.length > 0
        ? product?.color?.some((color) => selectedColor.includes(color))
        : true; 
    
      return isCategoryMatch && isPriceMatch && isSizeMatch && isColorMatch;
    });
    
    setShowFilterProduct(filteredProducts);
    console.log(filteredProducts?.length,'===');

    // if (filteredProducts?.length > 0) {
      setModalVisible(true);
    // }
  };

  const handleSize = (item) => {
    console.log("item", item);
    setSelectedSize((prev) =>
      prev?.includes(item?.id)
        ? prev?.filter((i) => i != item?.id)
        : [...prev, item?.id]
    );
  };

  const handleColor = (item) => {
    setSelectedColor((prev) =>
      prev?.includes(item?.id)
        ? prev?.filter((i) => i != item?.id)
        : [...prev, item?.id]
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            size={40}
            name={
              I18nManager.isRTL
                ? "chevron-forward-circle"
                : "chevron-back-circle"
            }
            color={color.theme}
          />
        </TouchableOpacity>
        <HeaderLogo />
        <TouchableOpacity onPress={() => navigation.navigate("MyCart")}>
          <ExportSvg.Cart />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <FlatListData
          data={categories}
          selectedItem={selectedCat}
          setSelectedItem={setSelectedCat}
          title={t("categories")}
        />

        {/* <FlatListData
          data={sorted}
          selectedItem={selectedSort}
          setSelectedItem={setSelectedSort}
          title={t('sorting')}
        /> */}

        <View style={{ marginTop: 20 }}>
          <Text style={styles.catTxt}>{t("price_range")}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <MultiSlider
            values={[startingPrice, endPrice]}
            sliderLength={width / 1.2}
            onValuesChange={onAgeRangeChange}
            onValuesChangeFinish={() => sliderSet(startingPrice, endPrice)}
            min={0}
            max={maxPrice}
            step={1}
            isMarkersSeparated={true}
            customMarkerLeft={(e) => {
              return (
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderWidth: 2,
                    borderRadius: 50,
                    marginTop: 5,
                    left: -5,
                  }}
                />
              );
            }}
            customMarkerRight={(e) => {
              return (
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderWidth: 2,
                    borderRadius: 50,
                    marginTop: 5,
                    right: -5,
                  }}
                />
              );
            }}
            selectedStyle={{ backgroundColor: color.theme }}
            unselectedStyle={{ backgroundColor: "#00000010" }}
            trackStyle={{ height: 7 }}
          />
        </View>
        <View style={styles.sliderBox}>
          <Text style={styles.ageText}> KD{startingPrice} </Text>
          <Text style={styles.ageText}>KD{endPrice} </Text>
        </View>

        {/* Size Section */}
        <Text style={styles.catTxt}>{t("size")}</Text>
        <View>
          <FlatList
            data={sizeData}
            horizontal
            contentContainerStyle={{ gap: 10, marginTop: 15 }}
            keyExtractor={(item, index) => index?.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={(prev) => handleSize(item)}
                  style={[
                    styles.sizeContainer,
                    selectedSize?.includes(item?.id) && styles.activeSize,
                  ]}
                >
                  <Text
                    style={[
                      { color: color.black, fontWeight: "500" },
                      selectedSize?.includes(item?.id) && {
                        color: color.white,
                      },
                    ]}
                  >
                    {item?.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <Text style={styles.catTxt}>{t("color")}</Text>
        <View>
          <FlatList
            data={colorData}
            horizontal
            contentContainerStyle={{ gap: 10, marginTop: 15 }}
            keyExtractor={(item, index) => index?.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={(prev) => handleColor(item)}
                  style={{
                    width: 35,
                    height: 35,
                    backgroundColor: item?.label,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedColor?.includes(item?.id) && (
                    <AntDesign name={"check"} color={color.white} size={20} />
                  )}
                  {/* <View  style={{width:35,height:35,backgroundColor:item?.label}} /> */}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* <Text style={[styles.catTxt, { marginTop: 30 }]}>Ratting</Text> */}

        {/* Rating */}
        {/* <View >
                    {
                        ratingStar?.map((item, index) => {
                            return (
                                <TouchableOpacity onPress={() => setActiveRating(item?.rating)} key={index} style={styles.ratingBox}>
                                    <View>
                                        {item?.star}
                                    </View>

                                    {
                                        activeRating == item?.rating ?

                                            <ExportSvg.ActiveRadio />
                                            :
                                            <ExportSvg.Radio
                                            />
                                    }
                                </TouchableOpacity>

                            )
                        })
                    }
                </View> */}

        <View style={styles.btnContainer}>
          <CustomButton
            title={t("apply")}
            onPress={onPress}
            // disabled={selectedCat?.length == 0}
          />
        </View>
      </ScrollView>

      <CatModal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        showFilterProduct={showFilterProduct}
        navigation={navigation}
      />
    </View>
  );
};

export default Filters;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS == "ios" ? 40 : 20,
    paddingHorizontal: 15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  catTxt: {
    fontSize: 18,
    fontWeight: "700",
    color: color.theme,
    marginTop: 10,
    textAlign: "left",
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
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sortBox: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 50,
    marginTop: 10,
    borderColor: color.lightGray,
  },
  sortTxt: {
    color: color.theme,
    fontFamily: "Montserrat-SemiBold",
  },
  ratingBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  btnContainer: {
    // flex: 1,
    justifyContent: "flex-end",
    marginVertical: 70,
  },
  catTxt: {
    fontSize: 18,
    fontWeight: "700",
    color: color.theme,
    textAlign: "left",
  },
  sliderBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -10,
    marginBottom: 15,
  },
  ageContainer: {
    // alignSelf: 'flex-end',
  },
  ageText: {
    color: "#AAAAAA",
    fontWeight: "500",
    fontSize: 15,
  },
  yrsText: {
    color: "#808080",
    fontSize: 15,
  },
  sizeContainer: {
    borderRadius: 50,
    borderWidth: 1,
    width: 33,
    height: 33,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  activeSize: {
    backgroundColor: color.theme,
    borderColor: color.theme,
  },
});
