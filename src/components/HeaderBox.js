import { I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import ExportSvg from '../constants/ExportSvg';
import HeaderLogo from './HeaderLogo';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color } from '../constants/color';

const HeaderBox = ({ isDrawer, catName, share, onPressShare, cartIcon, bagIcon,style }) => {
    const navigation = useNavigation()
    const data = useSelector(state => state.cartProducts?.cartProducts);
 useEffect(() => {
    navigation.dispatch(DrawerActions.closeDrawer())
    }
        , [])
    return (
        <View style={[styles.headerContainer,style]}>


            {
                isDrawer ?
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <ExportSvg.MenuBar />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <Ionicons
                            size={40}
                            name={
                                I18nManager.isRTL
                                    ? 'chevron-forward-circle'
                                    : 'chevron-back-circle'
                            }
                            color={color.theme}
                        />
                    </TouchableOpacity>
            }


            {
                catName ?
                    <Text style={{ color: color.theme, fontSize: 15, fontFamily: "500" }}>{catName}</Text>
                    :
                    <HeaderLogo />
            }


            {
                cartIcon &&
                <TouchableOpacity onPress={() => navigation.navigate('MyCart')}>
                    <ExportSvg.Cart style={{

                        transform: [{ rotateY: I18nManager.isRTL ? '180deg' : '0deg' }],
                    }} />
                    {
                        data?.length > 0 && (<View style={styles.rightIconNumber}>
                            <Text style={styles.noOfItemTxt}>{data?.length}</Text>
                        </View>)
                    }

                </TouchableOpacity>
            }



            {
                share &&
                <TouchableOpacity
                    onPress={onPressShare}
                    style={styles.socialRightIconBox}>
                    <ExportSvg.Share
                        style={{
                            transform: [{ rotate: I18nManager.isRTL ? '270deg' : '0deg' }],
                        }}
                    />
                </TouchableOpacity>
            }


            {
                bagIcon &&
                <View style={styles.rightIconBox}>
                    <ExportSvg.ShippingCart />
                    <View style={styles.rightIconNumber}>
                        <Text style={styles.noOfItemTxt}>{data?.length}</Text>
                    </View>
                </View>
            }

        </View>
    )
}

export default HeaderBox

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
        marginTop: 15,
        paddingHorizontal: 0,
    },
    rightIconNumber: {
        position: 'absolute',
        backgroundColor: color.theme,
        right: 0,
        width: 15,
        height: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        right: -5,
    },
    socialRightIconBox: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        // paddingVertical: 8,
        // paddingHorizontal: 15,
        borderRadius: 50,
        padding: 10,
    },
    noOfItemTxt: {
        color: '#fff',
        fontWeight: "600",
        fontSize: 10,
    },



    rightIconBox: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: '#fff',
        elevation: 5,
        padding: 10,
        borderRadius: 50,
    },
    //   rightIconNumber: {
    //     position: 'absolute',
    //     backgroundColor: color.theme,
    //     right: 0,
    //     width: 15,
    //     height: 15,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     borderRadius: 50,
    //     right: -5,
    //   },
})