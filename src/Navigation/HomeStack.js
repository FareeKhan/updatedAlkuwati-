import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/userScreens/HomeScreen';
import UserProfile from '../screens/userScreens/UserProfile';
import MyCart from '../screens/userScreens/MyCart';
import ExportSvg from '../constants/ExportSvg';
import Icon from '../assets/svg/BottomSvg/Index';
import Notification from '../screens/userScreens/Notification';
import AllProducts from '../screens/userScreens/AllProducts';
import MyFavorite from '../screens/userScreens/MyFavorite';
import ProductDetails from '../screens/userScreens/ProductDetails';
import CategoriesList from '../screens/userScreens/CategoriesList';
import ShippingAddress from '../screens/userScreens/ShippingAddress';
import OrderDetails from '../screens/userScreens/OrderDetails';
import PaymentOrder from '../screens/userScreens/PaymentOrder';
import TrackOrder from '../screens/userScreens/TrackOrder';
import { createStackNavigator } from '@react-navigation/stack';
import Filters from '../screens/userScreens/Filters';
import SameProduct from '../screens/userScreens/SameProduct';
import DiscountProducts from '../screens/userScreens/DiscountProducts';
import UserDetails from '../screens/userScreens/UserDetails';
import VerifyCode from '../screens/userScreens/VerifyCode';
import Login from '../screens/userScreens/Login';


const Stack = createStackNavigator();
export const HomeStack = () => {
    return (
        <Stack.Navigator

            initialRouteName="HomeScreen"
            screenOptions={{
                headerTitleAlign: 'center',
                headerShown: false
            }}
        >
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Filters" component={Filters} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
            <Stack.Screen name="CategoriesList" component={CategoriesList} />
            <Stack.Screen name="ShippingAddress" component={ShippingAddress} options={{
                presentation: "modal",
                gestureEnabled: true,
            }} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
            <Stack.Screen name="PaymentOrder" component={PaymentOrder} />
            <Stack.Screen name="DiscountProducts" component={DiscountProducts} />
            {/* <Stack.Screen name="VerifyCode" component={VerifyCode} /> */}
            <Stack.Screen name="Login" component={Login} />

            
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
            <Stack.Screen name="TrackOrder" component={TrackOrder} />
            <Stack.Screen name="MyFavorite" component={MyFavorite} />
            {/* <Stack.Screen name="UserDetails" component={UserDetails} /> */}
        </Stack.Navigator>
    )
}





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
        color: "#000"
    }
})