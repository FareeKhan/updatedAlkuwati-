import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import CustomText from './CustomText';
import { color } from '../constants/color';

const CustomDropDown = ({ data, setValue, value, placeholder, title, dropTitle, maxHeight }) => {


    const [isFocus, setIsFocus] = useState(false);
    return (
        <View style={{  }}>
            {
                title &&
                <CustomText style={styles.title}>{title}</CustomText>
            }

            <View style={[dropTitle && { paddingVertical: 8 }, styles.dropdown]}>
                {
                    dropTitle &&
                    <CustomText style={{ fontSize: 12, color: color.gray.concat(60) }}>{dropTitle}</CustomText>
                }

                <Dropdown
                    style={[!dropTitle && { height: 50,paddingHorizontal:15 }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    iconStyle={styles.iconStyle}
                    iconColor={color.black}
                    data={data}
                    maxHeight={maxHeight ? maxHeight : 100}
                    labelField="label"
                    valueField="label"
                    // valueField="id"
                    placeholder={placeholder}
                    searchPlaceholder="Search..."
                    value={value}
                    renderItem={(item) => {
                        return (
                            <View style={{ paddingVertical: 7, paddingHorizontal: 10}}>
                                <CustomText  >{item?.label}</CustomText>
                            </View>
                        )
                    }}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item?.label);
                        setIsFocus(false);
                    }}
                />
            </View>

        </View>
    )
}

export default CustomDropDown

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        marginBottom: 12,
        color:color.theme,
        marginTop:15
    },
    inputBox: {
        marginTop: 30,
    },
    container: {
        // backgroundColor: 'red',
        padding: 16,
    },
    dropdown: {
        borderRadius: 8,
        // width: "100%",
        // backgroundColor: 'green',
        // width:100,
        marginRight: 10,
        width: "100%",
        // paddingHorizontal: 19,
        borderRadius: 7,
        backgroundColor: '#cecece60',
    },
  
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        // backgroundColor: 'green',
    },
    placeholderStyle: {
        fontSize: 14,
        color:"#ccc",
        textAlign: 'left',
        paddingLeft:5
    },
    selectedTextStyle: {
        fontSize: 13,
        color:color.black,
        textAlign: 'left',
        paddingLeft:5
    },
    iconStyle: {
        width: 20,
        height: 20,

    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,

    },
})