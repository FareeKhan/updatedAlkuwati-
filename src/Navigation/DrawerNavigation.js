import { LogBox, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { StackNavigations } from './BottomNavigation';
import { createDrawerNavigator, useDrawerStatus } from '@react-navigation/drawer';
import { color } from '../constants/color';

import HeaderLogo from '../components/HeaderLogo';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';

import CateSubNavigation from './CateSubNavigation';
import { categoriesListAllWithSub } from '../services/UserServices';
import { useTranslation } from 'react-i18next';
import RNBounceable from '@freakycoder/react-native-bounceable';

import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import withPressAnimated from '../screens/userScreens/hocs/withPressAnimated';
import registercustomAnimations from '../screens/userScreens/animations';

registercustomAnimations()

LogBox.ignoreAllLogs();
const CustomDrawerContent = ({ navigation }) => {
    const [activeItem, setActiveItem] = useState("Home");

    const [foundProduct, setFoundProduct] = useState([]);
    const { t } = useTranslation();

    const animation = '';
    const durationInner = 1000;
    const delayInner = 100;

    const searchProduct = async () => {
        try {
            const result = await categoriesListAllWithSub()
            if (result?.status) {
                setFoundProduct(result.data)
            } else {
                setFoundProduct([])
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        searchProduct()
    }, [])

    const [activeSections, setactiveSections] = useState([]);
    const isDrawerOpen = useDrawerStatus() === 'open';

    const _renderHeader = (section, i) => {

        ReactNativeHapticFeedback.trigger('impactLight')
        return (
            <>
                <View style={styles.border} />

                <Animatable.View
                    // animation={isDrawerOpen ? animation : ''}
                    animation={'slideInRight'}
                    duration={durationInner}
                    delay={(1 + i) * delayInner}
                    useNativeDriver={true}
                >
                    {/* <View style={[styles.header, styles.menuItem, activeSections.length > 0 && activeSections && activeSections == i && styles.hearerSelected]}> */}
                    <View style={[
                        styles.header,
                        styles.menuItem,
                        activeSections.includes(i) && styles.hearerSelected
                    ]}>

                        <Text style={styles.menuText}>{section.name}</Text>
                        {/* {activeSections.length > 0 && activeSections && activeSections == i ? */}
                        {activeSections.includes(i) ?
                            <AntDesign name="minuscircle" size={20} color="#67300f" style={{ marginBottom: 0 }} />
                            :
                            <AntDesign name="pluscircle" size={20} color="#67300f" style={{ marginBottom: 0 }} />
                        }

                    </View>

                </Animatable.View>


            </>
        );
    };
    // <CateSubNavigation cate={2} isactive={activeSections.includes(i) } subCates={section.sub} cateID={1} />

    const _renderContent = (section, i) => {
        return (
            // <View style={styles.content}>
            //     {(section.sub !== undefined) ?
            //         // <CateSubNavigation cate={2} isactive={activeSections.length > 0 && activeSections && activeSections == i} subCates={section.sub} cateID={1} />
            //         <Text>dasdasdasds</Text>
            //         : <Text style={{ textAlign: 'center', paddingVertical: 20, paddingBottom: 20 }}>{t('NoCategories')}</Text>}
            // </View>


            <View style={styles.content}>
                {Array.isArray(section?.sub) && section?.sub?.length > 0 ? (
                    <CateSubNavigation
                        cate={2}
                        isactive={activeSections?.includes(i)}
                        subCates={section?.sub}
                        cateID={1}
                        navigation={navigation}
                        setStateValue={setactiveSections}
                    />


                ) : (
                    <Text style={{ textAlign: 'center', paddingVertical: 20, color: "#000" }}>
                        {t('NoCategories')}
                    </Text>
                )}
            </View>

        );
    };

    const _updateSections = (activeSections) => {
        setactiveSections(activeSections);
    }




    /*** */
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                <HeaderLogo />
            </View>
            <View style={styles.menuContainer}>
                <ScrollView >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('StackNavigations', { screen: "HomeScreen" })}
                        activeOpacity={0.8}
                        style={[
                            styles.menuItem,
                            activeItem === 'HomeScreen' && styles.activeMenuItem,
                        ]}>

                        <Text style={styles.menuText}>{t('home')}</Text>
                    </TouchableOpacity>
                    <View style={styles.border} />

                    <TouchableOpacity
                        onPress={() => navigation.navigate('StackNavigations', {
                            screen: 'DiscountProducts'
                        })}
                        activeOpacity={0.8}
                        style={[
                            styles.menuItem,
                            activeItem === 'DiscountProducts' && styles.activeMenuItem,
                        ]}>
                        <Text style={styles.menuText}>{t("discount_products")}</Text>
                    </TouchableOpacity>

                    {foundProduct.length > 0 && isDrawerOpen &&
                        // <Accordion
                        //     sections={foundProduct ?? []}
                        //     activeSections={activeSections}
                        //     //renderSectionTitle={_renderSectionTitle}
                        //     renderHeader={_renderHeader}
                        //     renderContent={_renderContent}
                        //     onChange={_updateSections}
                        //     underlayColor=""

                        // />


                        <Accordion
                            sections={foundProduct || []} // Ensure sections are not undefined
                            activeSections={activeSections}
                            renderHeader={_renderHeader}
                            renderContent={_renderContent}
                            onChange={_updateSections}
                            underlayColor="transparent"
                        />
                    }


                </ScrollView>
            </View>
        </View>
    );
};




const Colors = {
    bg: '#f2f2f2',
    active: '#fff',
    inactive: '#eee',
    transparent: 'transparent',
};




export const DrawerNavigation = () => {
    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator
            drawerType="slide"
            screenOptions={{
                swipeEnabled: false,
                headerShown: true,
                drawerActiveBackgroundColor: Colors.transparent,
                drawerInactiveBackgroundColor: Colors.transparent,
                drawerActiveTintColor: Colors.active,
                drawerInactiveTintColor: Colors.inactive,
                drawerHideStatusBarOnOpen: Platform.OS === 'ios' ? true : false,
                overlayColor: Colors.transparent,
                drawerStyle: {
                    backgroundColor: Colors.bg,
                    width: '70%',
                },
                sceneContainerStyle: {
                    backgroundColor: Colors.bg,
                },
            }}
            drawerContent={(props) => <CustomDrawerContent  {...props} />}
        >

            {/* <Drawer.Screen
                name={'BottomNavigation'}
                component={BottomNavigation}
                options={{ headerShown: false }}
            /> */}


            <Drawer.Screen
                name={'StackNavigations'}
                component={StackNavigations}
                options={{ headerShown: false }}
            />



        </Drawer.Navigator>
    );
};


export const styles = StyleSheet.create({
    content: {
        borderLeftWidth: 2,
        borderColor: '#67300f',
        width: '100%',
        marginTop: 10,
    },
    container: {
        //backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 40,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, },
    hearerSelected: { backgroundColor: '#eee', borderRadius: 5 },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appName: {
        fontFamily: 'Play-Bold',
        fontSize: 28,
        color: '#D1CBD8',
    },
    menuContainer: {
        paddingTop: 30,
        paddingBottom: 100
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 10
    },
    activeMenuItem: {
        color: color.theme,
    },
    menuText: {
        fontFamily: 'Montserrat-Medium',
        color: '#67300f',
        fontSize: 16,
        fontWeight: '500'

    },
    footerContainer: {
        gap: 15,
        alignItems: 'center',
        bottom: '10%',
        alignSelf: 'center',
    },
    footerText: {
        fontFamily: 'Play-Regular',
        fontSize: 16,
        color: '#D1CBD8',
    },
    socialIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    border: {
        width: "100%",
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 10
    }
});