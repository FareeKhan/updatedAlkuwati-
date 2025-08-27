import { I18nManager, LogBox, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { color } from '../constants/color';
import Accordion from 'react-native-collapsible/Accordion';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNBounceable from '@freakycoder/react-native-bounceable';
import withPressAnimated from '../screens/userScreens/hocs/withPressAnimated';
import registercustomAnimations, { ANIMATIONS } from '../screens/userScreens/animations';
import { fonts } from '../constants/fonts';

registercustomAnimations()


LogBox.ignoreAllLogs();
const CateThreeNavigation = ({ subCates, cate, navigation, setStateValue }) => {
    const [activeSections, setactiveSections] = useState([]);

    const onPressCat = (selectedValue) => {
        setStateValue([])
        navigation.navigate('StackNavigations', {
            screen: 'SameProduct',
            params: {
                text: cate,
                subC_ID: selectedValue,
                selected: selectedValue,
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
                    onPress={() => onPressCat(section.id)}
                >
                    <View style={[styles.header, styles.menuItem]}>
                        <Text style={styles.menuText}>{section.name}</Text>
                        <AntDesign
                            name={I18nManager.isRTL ? "leftcircle" : "rightcircle"}
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
                <Text>Empty</Text>
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
        marginLeft: 10,
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
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 10,
    },
    activeMenuItem: {
        color: color.theme,
    },
    menuText: {
               fontFamily:fonts.regular,
        color: '#67300f',
        fontSize: 16,
        width:"70%"

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