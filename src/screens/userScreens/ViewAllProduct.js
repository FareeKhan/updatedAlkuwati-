import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { newArrivals } from '../../services/UserServices';
import ScreenView from '../../components/ScreenView';
import Text from '../../components/CustomText'
import HeaderBox from '../../components/HeaderBox';
import SingleProductCard from '../../components/SingleProductCard';
import EmptyScreen from '../../components/EmptyScreen';
import { useTranslation } from 'react-i18next';
import ScreenLoader from '../../components/ScreenLoader';

const ViewAllProduct = ({ navigation, route }) => {
    const { t } = useTranslation()
    const [isLoader, setIsLoader] = useState(false)
    const { listName } = route?.params

    const [data, setData] = useState([])


    useEffect(() => {
        getNewArrivals()
    }, [])

    const getNewArrivals = async () => {
        setIsLoader(true);
        try {
            const result = await newArrivals(listName);
            if (result?.status) {
                setIsLoader(false);
                setData(result?.data);
            } else {
                setIsLoader(false);
            }
        } catch (error) {
            setIsLoader(false);
            console.log(error);
        }
    };



    const renderItem = ({ item, index }) => {
        return (
            // <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('ProductDetails', {
            //     id: item?.pid
            // })} style={{ alignItems: "center", marginBottom: 20 }}>
            //     <ImageBackground source={{ uri: item?.image }} style={{ width: 160, height: 170, marginRight: 5, }} borderRadius={20}>
            //         <View style={{ marginLeft: "auto", margin: 10 }}>
            //             <ExportSvg.Favorite />
            //         </View>

            //     </ImageBackground>
            //     <Text style={styles.arrivalTitle}>{item?.name}</Text>
            //     <Text style={styles.arrivalSubTitle}>{item?.description}</Text>
            //     <Text style={styles.arrivalPrice}>{item?.price}</Text>
            // </TouchableOpacity>
            <>
                <SingleProductCard
                    item={item}
                    countList={1 + index}
                    onPress={() => navigation.navigate('ProductDetails', {
                        id: item?.pid,
                        selectedCat: listName
                    })}
                />
            </>
        );
    };

    if ( isLoader) {
        return <ScreenLoader />;
      }


    return (
        <ScreenView>
            <HeaderBox
                catName={listName}
                cartIcon={true}
            />



            <FlatList
                data={data}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                contentContainerStyle={{marginTop:20}}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                ListEmptyComponent={<EmptyScreen text={t('no_data_found')} />}
            />

        </ScreenView>
    )
}

export default ViewAllProduct

const styles = StyleSheet.create({})