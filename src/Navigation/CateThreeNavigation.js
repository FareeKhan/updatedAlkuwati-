import { I18nManager, LogBox, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef } from 'react'
import { color } from '../constants/color';
import Animated from 'react-native-reanimated';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNBounceable from '@freakycoder/react-native-bounceable';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import withPressAnimated from '../screens/userScreens/hocs/withPressAnimated';
import registercustomAnimations, { ANIMATIONS } from '../screens/userScreens/animations';

registercustomAnimations()
const AnimatedPressButton = withPressAnimated(RNBounceable)


LogBox.ignoreAllLogs();
const CateThreeNavigation = ({ subCates, isactive, cate, cateID ,navigation,setStateValue}) => {
    const [activeItem, setActiveItem] = useState("Home");
    const [isCollapsed, setIsCollapsed] = useState(true);

    const viewRef = useRef(null);
    const animation = 'flipInY';
    const animationMain = 'fadeInRight';
    const durationMain = 100;
    const durationInner = 1000;
    const delayInner = 100;



    /*** */
    const SECTIONS = [
        {
            title: 'First',
            content: 'Lorem ipsum...',
        },
        {
            title: 'Second',
            content: 'Lorem ipsum...',
        },
    ];

    const [activeSections, setactiveSections] = useState([]);

    // const _renderHeader = (section, i) => {
    //     const lengthCount = 1+i;
    //     return (
    //         <>
    //              <Animatable.View
    //                     animation={isactive ? animation : ''}
    //                     duration={durationInner}
    //                     delay={(1 + i) * delayInner}
    //                 >
    //             <AnimatedPressButton style={{marginVertical: 10}} animation='swing' mode="contained"
    //                     onPress={() => {
    //                         ReactNativeHapticFeedback.trigger('impactLight');
    //                         setTimeout(() => {
    //                             navigation.navigate('SameProduct', {
    //                                 text: cate,
    //                                 subC_ID: cateID,
    //                                 selected: section.name,
    //                                 navID: 1,
    //                             });
    //                         }, 300)
    //                     }
    //                     }
                        
    //                 >
    //             <View style={[styles.header,styles.menuItem]}>
    //                 <Text style={styles.menuText}>{section.name}</Text>
    //                 <AntDesign name="rightcircle" size={20} color="#67300f" style={{ marginBottom: 0 }} />
    //             </View>
    //             </AnimatedPressButton>
    //             </Animatable.View>
    //             {subCates.length != lengthCount && <View style={styles.border} />}
    //         </>
    //     );
    // };


    const onPressCat = (selectedValue)=>{
        setStateValue([])
        navigation.navigate('StackNavigations', {
            screen: 'SameProduct',
            params: {
                text: cate,
                subC_ID: cateID,
                selected:selectedValue,
                navID: 1,
            },
        })
    }

    const _renderHeader = (section, i) => {
        const lengthCount = 1 + i;
        return (
            <>
                <TouchableOpacity 
                    style={{ marginVertical: 10 }} 
                    animation="swing" 
                    mode="contained"
                    // onPress={() => navigation.navigate('StackNavigations', {
                    //     screen: 'SameProduct',
                    //     params: {
                    //         text: cate,
                    //         subC_ID: cateID,
                    //         selected: section.name,
                    //         navID: 1,
                    //     },
                    // })}

                        onPress={() => onPressCat(section.name)}
                    // onPress={() => {
                    //     navigation.navigate('SameProduct', {
                    //         text: cate,
                    //         subC_ID: cateID,
                    //         selected: section.name,
                    //         navID: 1,
                    //     });
                    // }}
                >
                    <View style={[styles.header, styles.menuItem]}>
                        <Text style={styles.menuText}>{section.name}</Text>
                        <AntDesign 
                            name= {I18nManager.isRTL ?"leftcircle" :"rightcircle" }
                            size={20} 
                            color="#67300f" 
                            style={{ marginBottom: 0 }} 
                        />
                    </View>
                </TouchableOpacity>
                {subCates.length !== lengthCount && <View style={styles.border} />}
            </>
        );
    };
    

    const _renderContent = (section) => {
        return (
            <View style={styles.content}>
  <Text>dasdas</Text>
            </View>
        );
    };

    const _updateSections = (activeSections) => {
        setactiveSections(activeSections);
    }

    /*** */
    return (
        <View style={styles.container}>
            {subCates &&
                <Accordion
                    sections={subCates}
                    activeSections={activeSections}
                    //renderSectionTitle={_renderSectionTitle}
                    renderHeader={_renderHeader}
                    renderContent={_renderContent}
                    onChange={_updateSections}
                    sectionContainerStyle={{/*backgroundColor:'red'*/ }}
                    underlayColor=""
                />
            }
        </View>
    );
};

export default CateThreeNavigation

export const styles = StyleSheet.create({
    container: {
        //backgroundColor: '#fff',
        marginLeft:10,
    },
    header: { flexDirection: 'row',  justifyContent: 'space-between',paddingHorizontal: 5,},
    hearerSelected: {backgroundColor:'#eee', borderRadius:5},
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
        fontSize:16,
        fontWeight:'500'

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
        backgroundColor: "#eee",
        marginVertical: 10
    }
});