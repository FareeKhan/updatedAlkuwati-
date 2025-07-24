import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HeaderBox from '../../components/HeaderBox';
import {about_us_ar, refund_policy_ar, terms_ar} from '../../constants/data';
import {fonts} from '../../constants/fonts';

const WebPages = ({route}) => {
  const {title, pageNo} = route?.params || '';

  const renderData =
    pageNo == 1 ? terms_ar : pageNo == 2 ? refund_policy_ar : about_us_ar;

  return (
    <View style={styles.mainContainer}>
      <HeaderBox cartIcon={true} catName={title} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.text}>{renderData}</Text>
      </ScrollView>
    </View>
  );
};

export default WebPages;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 70 : 30,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  scrollView: {
    marginTop: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  text: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
    fontFamily: fonts.regular,
  },
});
