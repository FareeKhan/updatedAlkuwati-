import { I18nManager, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserProfile from '../screens/userScreens/UserProfile';
import MyCart from '../screens/userScreens/MyCart';
import Icon from '../assets/svg/BottomSvg/Index';
import AllProducts from '../screens/userScreens/AllProducts';
import MyFavorite from '../screens/userScreens/MyFavorite';
import ProductDetails from '../screens/userScreens/ProductDetails';
import CategoriesList from '../screens/userScreens/CategoriesList';
import ShippingAddress from '../screens/userScreens/ShippingAddress';
import OrderDetails from '../screens/userScreens/OrderDetails';
import PaymentOrder from '../screens/userScreens/PaymentOrder';
import TrackOrder from '../screens/userScreens/TrackOrder';
import UserDetails from '../screens/userScreens/UserDetails';
import { createStackNavigator } from '@react-navigation/stack';
import Filters from '../screens/userScreens/Filters';
import SameProduct from '../screens/userScreens/SameProduct';
import { HomeStack } from './HomeStack';
import { ProfileTab } from './ProfileTab';
import { FaviStack } from './FaviStack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import DiscountProducts from '../screens/userScreens/DiscountProducts';
import VerifyCode from '../screens/userScreens/VerifyCode';
import Login from '../screens/userScreens/Login';
import HomeScreen from '../screens/userScreens/HomeScreen';
import ViewAllProduct from '../screens/userScreens/ViewAllProduct';
import { useNavigation } from '@react-navigation/native';
import SavedAddresses from '../screens/userScreens/SavedAddresses';

const Tab = createBottomTabNavigator();


const Stack = createStackNavigator();
export const StackNavigations = () => {
    const { t } = useTranslation();
    return (
        <Stack.Navigator

            initialRouteName="BottomNavigation"
            screenOptions={{
                headerTitleAlign: 'center',
                headerShown: false
            }}
        >
            <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
            {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
            <Stack.Screen name="Filters" component={Filters} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
            <Stack.Screen name="CategoriesList" component={CategoriesList} />
            <Stack.Screen name="DiscountProducts" component={DiscountProducts} />


            <Stack.Screen name="ShippingAddress" component={ShippingAddress} options={{
                // presentation: "modal",
                // gestureEnabled: true,
            }} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
            <Stack.Screen name="PaymentOrder" component={PaymentOrder} />
            <Stack.Screen
                name="AllProducts"
                component={AllProducts}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SameProduct"
                component={SameProduct}
            />
            <Stack.Screen
                name="MyCart"
                component={MyCart}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="VerifyCode" component={VerifyCode} />


            <Stack.Screen name="TrackOrder" component={TrackOrder} />
            <Stack.Screen name="UserDetails" component={UserDetails} />

            <Stack.Screen name="MyFavorite" component={MyFavorite} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="HomeSession" component={HomeStack} />
            <Stack.Screen name="ViewAllProduct" component={ViewAllProduct} />
            <Stack.Screen name="SavedAddresses" component={SavedAddresses} />

        </Stack.Navigator>
    )
}


const BottomNavigation = () => {

    const { t } = useTranslation();
    return (
        // <Tab.Navigator initialRouteName='HomeNavigation' screenOptions={{
        <Tab.Navigator
            screenOptions={({ navigation, route }) => ({
                // screenOptions={{
                tabBarPressColor: 'transparent', // Disables ripple on Android
                headerShown: false,
                tabBarStyle: {
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    position: "absolute",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    backgroundColor: "#fff",
                    paddingHorizontal: 15,
                    paddingTop: Platform.OS == 'ios' ? 20 : 10,
                    height: Platform.OS == 'ios' ? 79 : 60
                },
                tabBarHideOnKeyboard: 'true',
                tabBarPressColor: 'transparent',
                tabBarButton: (props) => (
                  <TouchableOpacity {...props} />
                ),
               

            })}

        >

            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{
                    tabBarButton: (props) => {
                        const navigation = useNavigation(); // ✅ Fix: Use useNavigation()
                
                        return (
                          <TouchableOpacity
                          {...props}
                            onPress={() => {
                              navigation.navigate("HomeStack", { screen: "HomeScreen" }); // ✅ Reset HomeStack
                            }}
                          >
                            {props.children}
                          </TouchableOpacity>
                        );
                      },




                    tabBarIcon: ({ color, size, focused }) => {
                        return (
                            <View style={{ flexDirection:"row",alignItems: "center", backgroundColor: "#eee", borderRadius: 30 }}>
                                <View style={[styles.iconContainer, focused && { backgroundColor: "#67300F" }]}>
                                    <Icon.Home color={focused ? "#fff" : "#67300F"} />
                                </View>
                                {focused && <Text numberOfLines={1} style={[styles.tabTxt, { width: I18nManager.isRTL ? 55 : 50 }]}>{t("home")}</Text>}
                            </View>
                        )
                    },
                    title: "",
                }}
            />
            <Tab.Screen
                name="DiscountProducts"
                component={DiscountProducts}
                options={{
                    tabBarIcon: ({ size, color, focused }) => {
                        return (
                            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#eee", borderRadius: 30 }}>
                                <View style={[styles.iconContainer, focused && { backgroundColor: "#67300F" }]}>
                                    <MaterialIcons name="discount" size={20} color={focused ? "#fff" : "#67300F"} style={{ marginBottom: 0 }} />
                                </View>
                                {focused && <Text numberOfLines={1} style={[styles.tabTxt, { width: I18nManager.isRTL ? 55 : 70 }]}>{t("discount_name")}</Text>}
                            </View>
                        )
                    },
                    title: ""
                }}
            />

            <Tab.Screen
                name="FaviStack"
                component={FaviStack}
                options={{
                    tabBarIcon: ({ size, color, focused }) => {
                        return (
                            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#eee", borderRadius: 30 }}>
                                <View style={[styles.iconContainer, focused && { backgroundColor: "#67300F" }]}>
                                    <Icon.heartOutline color={focused ? "#fff" : "#67300F"} />
                                </View>
                                {focused && <Text numberOfLines={1} style={[styles.tabTxt, , { width: I18nManager.isRTL ? 55 : 90 }]}>{t("my_favourites")}</Text>}
                            </View>
                        )
                    },
                    title: ""
                }}
            />

            <Tab.Screen
                name="ProfileTab"
                component={ProfileTab}
                options={{
                    tabBarIcon: ({ size, color, focused }) => {
                        return (
                            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#eee", borderRadius: 30 }}>
                                <View style={[styles.iconContainer, focused && { backgroundColor: "#67300F" }]}>
                                    <Icon.ProfileUser color={focused ? "#fff" : "#67300F"} />
                                </View>
                                {focused && <Text numberOfLines={1} style={[styles.tabTxt, { width: I18nManager.isRTL ? 60 : 50 }]}>{t("profile")}</Text>}
                            </View>
                        )
                    },
                    title: ""
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomNavigation

const styles = StyleSheet.create({
    iconContainer: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        backgroundColor: "#fff"
    },
    tabTxt: {
        paddingLeft: 5,
        paddingRight: 10,
        color: "#000",
        width: 70,
        fontSize: 12
    }
})