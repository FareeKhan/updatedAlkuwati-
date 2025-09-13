import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import SingleProductCard from './SingleProductCard';
import SliderDots from './SliderDots';
import { useTranslation } from 'react-i18next';
import { color } from '../constants/color';
import { useNavigation } from '@react-navigation/native';

const RenderArrivalItem = ({ setSameScreenId, imageHeights, secBanners, data }) => {
  const { t } = useTranslation();
  const navigation = useNavigation()

  const renderArrivalItem = ({ item, index }) => {
    const products = item?.category?.products || [];
    const bannersToShow = secBanners?.filter(
      banner => Number(banner?.show_after_section_number) === index + 1
    );

    return (
      <View style={{ marginBottom: 20 }}>
        {products.length > 0 && (
          <>
            <View style={styles.arrivalBox}>
              <Text style={styles.arrivalTxt}>{item?.category?.name}</Text>
              <TouchableOpacity onPress={() => setSameScreenId(item?.category?.id)}>
                <Text style={styles.viewTxt}>{t('view_all')}</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={products}
              keyExtractor={p => p.id.toString()}
              renderItem={({ item: innerItem }) => (
                <SingleProductCard
                  isShowPlusIcon
                  item={innerItem}
                  onPress={() => navigation.navigate('ProductDetails', { id: innerItem.id })}
                />
              )}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={3}   // first 3 products only
              maxToRenderPerBatch={3}  // render 3 per batch
              windowSize={5}           // minimal offscreen rendering
            />
          </>
        )}

        {bannersToShow?.length > 0 && (
          <SliderDots
            data={bannersToShow}
            imageHeights={imageHeights}
            dataIndex={index}
            setSameScreenId={setSameScreenId}
          />
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item?.category?.id?.toString() || index.toString()}
      renderItem={renderArrivalItem}
      showsVerticalScrollIndicator={false}
      initialNumToRender={2}     // only first 2 categories
      maxToRenderPerBatch={2}
      windowSize={5}
    />
  );
};

export default RenderArrivalItem;

const styles = StyleSheet.create({
  arrivalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  arrivalTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: color.theme,
  },
  viewTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: color.gray,
  },
});
