import { LogBox, StyleSheet, Text, View } from 'react-native';
import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CateThreeNavigation from './CateThreeNavigation';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useTranslation } from 'react-i18next';
import { fonts } from '../constants/fonts';

LogBox.ignoreAllLogs();

const CateSubNavigation = ({ subCates, isactive,navigation,setStateValue }) => {
    const [activeSections, setActiveSections] = useState([]);
    const {t} = useTranslation(t)

    if (!subCates || !Array.isArray(subCates) || subCates.length === 0) {
        return <Text style={{ textAlign: 'center', padding: 20 }}>No Categories</Text>;
    }


    const _renderHeader = (section, index) => {
        const isActive = activeSections.includes(index);
    
        return (
            <>
                <View style={[styles.header, styles.menuItem, isActive && styles.headerSelected]} >
                    <Text style={styles.menuText}>{section?.name}</Text>
                    <AntDesign 
                        name={isActive ? "minuscircleo" : "pluscircleo"} 
                        size={20} 
                        color="#67300f" 
                    />
                </View>
                {isActive && (
                    <View style={styles.content}>
                        {/* Content goes here */}
                    </View>
                )}
                {index < subCates.length - 1 && <View style={styles.border} />}
            </>
        );
    };
    

    const _renderContent = (section, index) => {
        console.log('===>>',section)
        return (
            <View style={styles.content}>
                {section?.sub ? (
                    // <Text style={styles.noCategoriesText}>No Categories</Text>

                    <CateThreeNavigation 
                        cate={section.name} 
                        isactive={activeSections.includes(index)} 
                        subCates={section.sub} 
                        cateID={section.id} 
                        navigation={navigation}
                        setStateValue={setStateValue}
                    />
                ) : (
                    <Text style={styles.noCategoriesText}>{t('NoCategories')}</Text>
                )}
            </View>
        );
    };

    const _updateSections = (activeSections) => {
        setActiveSections(activeSections);
    };

    console.log('subCatessubCatessubCates',subCates)

    return (
        <View style={styles.container}>
            <Accordion
                sections={subCates?? []}
                activeSections={activeSections}
                // renderHeader={_renderHeader}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
               
                onChange={_updateSections}
                underlayColor="transparent"
            />
        </View>
    );
};

export default CateSubNavigation;

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    headerSelected: {
        backgroundColor: '#eee',
        borderRadius: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 10,
    },
    menuText: {
        fontSize: 16,
        color: '#67300f',
        fontFamily:fonts.regular
    },
    content: {
        borderLeftWidth: 2,
        borderColor: '#67300f',
        width: '100%',
        marginTop: 10,
        paddingLeft: 10,
    },
    noCategoriesText: {
        textAlign: 'center',
        paddingVertical: 20,
        fontSize: 14,
        color:"#000"
    },
    border: {
        width: "100%",
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 10,
    },
});
