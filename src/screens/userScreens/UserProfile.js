import {
  Alert,
  Image,
  Platform,
  I18nManager,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ExportSvg from "../../constants/ExportSvg";
import { color } from "../../constants/color";
import { baseUrl } from "../../constants/data";
import { useDispatch, useSelector } from "react-redux";
import { personalData } from "../../services/UserServices";
import { logout } from "../../redux/reducer/Auth";
import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import HeaderLogo from "../../components/HeaderLogo";
import { useTranslation } from "react-i18next";
import DrawerSceneWrapper from "../../Navigation/DrawerSceneWrapper";
import RNRestart from "react-native-restart";
import { loginData, changeLanguage } from "../../redux/reducer/Auth";
import { getOrder } from "../../services/UserServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

const UserProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.userId);
  const ssss = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [userData, setUserData] = useState("");
  const [getName, setName] = useState();
  const [storeOrder, setStoreOrder] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [profileLoader, setProfileLoader] = useState(false);
  const [SupportURL, setSupportURL] = useState();
  const isLanguage = useSelector((state) => state.auth?.isLanguage);

  const [isSelectedLang, setIsSelectedLang] = useState(isLanguage);

  const UserNavigation = ({ SVG, title, onPress, lng = null }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.userContainer}>
        {SVG}
        <Text style={styles.navigationTxt}>
          {title}{" "}
          {lng && (
            <Text style={styles.navigationTxtss}>
              {" "}
              {lng == "en" ? "العربية" : "English"}
            </Text>
          )}
        </Text>
        {I18nManager.isRTL ? (
          <View
            style={{
              marginLeft: "auto",
              textAlign: "left",
              flexDirection: "row",
            }}
          >
            <Ionicons
              name={"chevron-back-outline"}
              size={15}
              color={"#67300f"}
              styles={{}}
            />
          </View>
        ) : (
          <ExportSvg.RightArrow style={{ marginLeft: "auto" }} />
        )}
      </TouchableOpacity>
    );
  };

  const orderData = async () => {
    setIsLoader(true);
    try {
      const response = await getOrder(userId);

      if (response?.status == "success") {
        setIsLoader(false);
        setStoreOrder(response?.data);
      } else {
        setIsLoader(false);
      }
    } catch (error) {
      setIsLoader(false);
      console.log(error);
    }
  };

  const setlng = async (value) => {
    const lngInfo = await AsyncStorage.setItem("lngInfo", value);
  };

  // const onPressLanguage = async (value) => {
  //   setIsSelectedLang(value);

  //   dispatch(
  //     changeLanguage({
  //       isLanguage: value,
  //     })
  //   );

  //   if (value !== isSelectedLang) {
  //     setlng(value);
  //     if (value !== "en") {
  //       I18nManager.forceRTL(true);
  //       setTimeout(() => {
  //         RNRestart.Restart();
  //       }, 100);
  //     } else {
  //       I18nManager.forceRTL(false);
  //       setTimeout(() => {
  //         RNRestart.Restart();
  //       }, 100);
  //     }
  //   }
  // };
  const onPressLanguage = async (value) => {
    if (value === isSelectedLang) return;

    console.log("Changing language to:", value);

    setIsSelectedLang(value);
    setlng(value);

    dispatch(
      changeLanguage({
        isLanguage: value,
      })
    );

    if (value === "en") {
      console.log("Setting LTR");
      I18nManager.allowRTL(false);  // Prevent system overrides
      I18nManager.forceRTL(false);  // Force LTR
    } else {
      console.log("Setting RTL");
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }

    setTimeout(() => {
      console.log("Restarting App...");
      RNRestart.Restart();
    }, 100);
  };



  const OpenURLButton = useCallback(async (url) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  });

  useEffect(() => {
    profileData();
    orderData();
  }, []);

  useEffect(() => {
    profileData();
    orderData();
  }, [userId]);

  const profileData = async () => {
    setProfileLoader(true)
    try {
      const response = await personalData(userId);
      console.log('response', response)
      if (response?.status) {
        setUserData(response?.data);
        setImage(response?.data?.name);
        setSupportURL(response?.supporturl);
        setProfileLoader(false)
      }
    } catch (error) {
      setProfileLoader(false)
      console.log(error);
    }
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      profileData();
    });

    return unsubscribe;
  }, [navigation]);


  const setImage = (name) => {
    setName(name.substring(0, 1));
  };

  const LogoutPress = () => {
    dispatch(logout());
    navigation.navigate("Login");
  };

  const createTwoButtonAlert = () =>
    Alert.alert(t("DeleteYourAccount"), t("ASure"), [
      {
        text: t("Cancel"),
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: t("OK"), onPress: () => LogoutPress() },
    ]);

  return (
    <DrawerSceneWrapper>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ExportSvg.ClickMenuBar />
                </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <ExportSvg.MenuBar />
          </TouchableOpacity>
          <HeaderLogo />
          <TouchableOpacity>{/* <ExportSvg.Settings /> */}</TouchableOpacity>
        </View>

        {true ? (
          <>
            {userId && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("UserDetails", {
                    btnText: t("save"),
                  })
                }
              >
                <View style={styles.profileContainer}>
                  {
                    profileLoader ?
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
                        {/* <Image
                          source={require("../../assets/images/userImage.png")}
                        /> */}
                        <View style={{ borderWidth: 1, height: 35, width: 35, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                          <AntDesign name={'user'} size={20} color={"#000"} />
                        </View>
                        <ActivityIndicator size={'small'} color={color.theme} />
                      </View>
                      :
                      <>
                        {getName ? (
                          // <View style={styles.txt}>
                          //   <Text style={styles.txtTxt}>{getName}</Text>
                          // </View>
                          <View style={{ borderWidth: 1, height: 35, width: 35, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                            <AntDesign name={'user'} size={20} color={"#000"} />
                          </View>
                        ) : (
                          // <Image
                          //   source={require("../../assets/images/userImage.png")}
                          // />
                          <View style={{ borderWidth: 1, height: 35, width: 35, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                            <AntDesign name={'user'} size={20} color={"#000"} />
                          </View>
                        )}

                        <View style={{ marginLeft: 10, marginTop: 7 }}>

                          <Text style={styles.userName}>{userData?.name ? userData?.name : t('noAvailable')}</Text>
                          {/* <Text style={styles.userEmail}>{'\u202A'}{userData?.phone}{'\u202C'}</Text> */}
                          {/* <Text style={styles.subTitle}>
                          </Text> */}
                        </View>
                      </>


                  }






                </View>
              </TouchableOpacity>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 90,
                paddingHorizontal: 4,
              }}
            >
              <View style={[styles.Wrapper]}>
                {userId && (
                  <>
                    <UserNavigation
                      SVG={<ExportSvg.MyOrder />}
                      title={t("my_orders")}
                      onPress={() => navigation.navigate("TrackOrder")}
                    />

                    <UserNavigation
                      SVG={<ExportSvg.MyFavrt />}
                      title={t("my_favourites")}
                      onPress={() => navigation.navigate("MyFavorite")}
                    />

                    <UserNavigation
                      SVG={<ExportSvg.ShippingAddress />}
                      title={t("shipping_address")}
                      onPress={() =>
                        navigation.navigate("SavedAddresses", {
                          isAdd: true
                        })
                      }
                    />
                    <TouchableOpacity
                      onPress={() => OpenURLButton(SupportURL)}
                      style={styles.userContainer}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#cecece90",
                          borderRadius: 7,
                        }}
                      >
                        <MaterialIcons
                          name={"support-agent"}
                          size={25}
                          color={"#67300f"}
                          styles={{}}
                        />
                      </View>
                      <Text style={styles.navigationTxt}>{t("support")}</Text>
                      {I18nManager.isRTL ? (
                        <View
                          style={{
                            marginLeft: "auto",
                            textAlign: "left",
                            flexDirection: "row",
                          }}
                        >
                          <Ionicons
                            name={"chevron-back-outline"}
                            size={15}
                            color={"#67300f"}
                            styles={{}}
                          />
                        </View>
                      ) : (
                        <ExportSvg.RightArrow style={{ marginLeft: "auto" }} />
                      )}
                    </TouchableOpacity>
                  </>
                )}
                <UserNavigation
                  SVG={
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#cecece90",
                        borderRadius: 7,
                      }}
                    >
                      <Fontisto
                        name={"world-o"}
                        size={25}
                        color={"#67300f"}
                        styles={{}}
                      />
                    </View>
                  }
                  title={t("language")}
                  lng={isSelectedLang}
                  onPress={() =>
                    onPressLanguage(isSelectedLang == "en" ? "ar" : "en")
                  }
                />



                {userId && (
                  <>
                    <TouchableOpacity
                      onPress={LogoutPress}
                      style={styles.userContainer}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#cecece90",
                          borderRadius: 7,
                        }}
                      >
                        <Ionicons
                          name={"log-out-sharp"}
                          size={25}
                          color={"#67300f"}
                          styles={{}}
                        />
                      </View>
                      <Text style={styles.navigationTxt}>{t("logout")}</Text>

                      {I18nManager.isRTL ? (
                        <View
                          style={{
                            marginLeft: "auto",
                            textAlign: "left",
                            flexDirection: "row",
                          }}
                        >
                          <Ionicons
                            name={"chevron-back-outline"}
                            size={15}
                            color={"#67300f"}
                            styles={{}}
                          />
                        </View>
                      ) : (
                        <ExportSvg.RightArrow style={{ marginLeft: "auto" }} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={createTwoButtonAlert}
                      style={styles.userContainer}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#cecece90",
                          borderRadius: 7,
                        }}
                      >
                        <ExportSvg.logoutUser />
                      </View>
                      <Text style={styles.navigationTxt}>
                        {t("delete_account")}
                      </Text>
                      {I18nManager.isRTL ? (
                        <View
                          style={{
                            marginLeft: "auto",
                            textAlign: "left",
                            flexDirection: "row",
                          }}
                        >
                          <Ionicons
                            name={"chevron-back-outline"}
                            size={15}
                            color={"#67300f"}
                            styles={{}}
                          />
                        </View>
                      ) : (
                        <ExportSvg.RightArrow style={{ marginLeft: "auto" }} />
                      )}
                    </TouchableOpacity>
                  </>
                )}

                {!userId && (
                  <>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Login")}
                      style={styles.userContainer}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#cecece90",
                          borderRadius: 7,
                        }}
                      >
                        <FontAwesome
                          name={"user-circle-o"}
                          size={25}
                          color={"#67300f"}
                          styles={{}}
                        />
                      </View>
                      <Text style={styles.navigationTxt}>{t("login")}</Text>
                      {I18nManager.isRTL ? (
                        <View
                          style={{
                            marginLeft: "auto",
                            textAlign: "left",
                            flexDirection: "row",
                          }}
                        >
                          <Ionicons
                            name={"chevron-back-outline"}
                            size={15}
                            color={"#67300f"}
                            styles={{}}
                          />
                        </View>
                      ) : (
                        <ExportSvg.RightArrow style={{ marginLeft: "auto" }} />
                      )}
                    </TouchableOpacity>
                  </>
                )}

              </View>
            </ScrollView>
          </>
        ) : (
          <View style={styles.mainContainer}>
            <Text
              style={{
                ...styles.userName,
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              {t("no_order")}
            </Text>
          </View>
        )}
      </View>

      <View>
        <Text style={styles.navigationTxt}>{t("logout")}</Text>
      </View>
    </DrawerSceneWrapper>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  txt: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "grey",
    borderWidth: 1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderColor: "grey",
  },
  txtTxt: {
    justifyContent: "center",
    fontSize: 40,
    color: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "90%",
    marginTop: 15,
  },
  profileContainer: {
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    backgroundColor: "#fff",
    elevation: 5,
    padding: 10,
    paddingHorizontal:15,
    borderRadius: 13,
  },
  userName: {
    fontSize: 17,
    fontFamily: "Montserrat-Regular",
    color: color.theme,
    fontWeight: "600",
    textAlign: "left",
  },
  userEmail: {
    fontSize: 13,
    color: "#AAA",
    fontFamily: "Montserrat-Regular",
    marginTop: 2,
    textAlign: "left",
  },
  Wrapper: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderColor: "#DDD",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    backgroundColor: "#fff",
    // elevation: 5,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  navigationTxt: {
    fontFamily: "Montserrat-SemiBold",
    color: color.theme,
    marginLeft: 10,
  },
  navigationTxtss: {
    fontFamily: "Montserrat-SemiBold",
    color: color.theme,
    marginLeft: 0,
  },
});
