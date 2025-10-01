import {I18nManager} from 'react-native';
import {baseUrl} from '../constants/data';
import axios from 'axios';


export const loginPhoneNo = async (phoneNo) => {
    try {
        const response = await fetch(`${baseUrl}/customer/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                "phone": phoneNo,
                "token": 'thisisFcmToken',
            })
        });

        const result = await response.json();
        return result;
    } catch (e) {
        console.log('oo', e)
    }
};


export const otpVerification = async (phoneNo,value) => {
    console.log(phoneNo,value)
    try {
        const response = await fetch(`${baseUrl}/customer/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                phone:phoneNo,
                otp: value,
                token: 'FCNToken'
            })
        });

        const result = await response.json();
        return result;
    } catch (e) {
        console.log('oo', e)
    }
};



export const homeBanner = async () => {
  try {
    const response = await fetch(`${baseUrl}/getBanners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const offerBanner = async () => {
  try {
    const response = await fetch(`${baseUrl}/offer_withCateID`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const newArrivals = async name => {
  try {
    const response = await fetch(
      `${baseUrl}/getProductsByType/categories/${name}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        },
      },
    );

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const getFeaturedData = async () => {
  try {
    const response = await fetch(`${baseUrl}/get-featured-categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const getSameProduct = async name => {
  try {
    const response = await fetch(
      `${baseUrl}/getProductsByType/categories/${name}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        },
      },
    );

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const productDetails = async id => {
  try {
    const response = await fetch(`${baseUrl}/getProductById/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const deliveryCharges = async id => {
  try {
    const response = await fetch(`${baseUrl}/deliveryCharges_admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const editShippingAddress = async (address,id) => {
  try {
    const response = await fetch(`${baseUrl}/address/${id}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
      body: JSON.stringify({
        user_id: address?.user_id,
        country: address?.country || 'country',
        governorate: address?.governorate || 'governorate',
        city: address?.city || 'city',
        block_avenue: address?.block_avenue || 'block_avenue',
        area: address?.area || 'area',
        street: address?.street || 'street',
        house: address?.house || 'house',
        full_name: address?.fullName || 'fullName',
        phone: address?.phone || 'phone',
        emirates: address?.avenuePostalCoder,
        email: 'kuwait@gmail.com',
        pickupLocation: address?.location || 'location',
        additional_info: address?.additionalInfo || 'additionalInfo',
      }),
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const addShippingAddress = async (address) => {
  try {
    const response = await fetch(`${baseUrl}/address/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
      body: JSON.stringify({
        user_id: address?.user_id,
        country: address?.country || 'country',
        governorate: address?.governorate || 'governorate',
        city: address?.city || 'city',
        block_avenue: address?.block_avenue || 'N/A',
        area: address?.area || 'N/A',
        street: address?.street || 'street',
        house: address?.house || 'house',
        full_name: address?.fullName || 'fullName',
        phone: address?.phone || 'phone',
        emirates: address?.avenuePostalCoder,
        email: 'kuwait@gmail.com',
        pickupLocation: address?.location || 'location',
        additional_info: address?.additionalInfo || 'additionalInfo',
      }),
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const userShippingAddress = async id => {
  try {
    const response = await fetch(`${baseUrl}/user/${id}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const promoCodes = async id => {
  try {
    const response = await fetch(`${baseUrl}/promocodes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const postPromoCoder = async value => {
  const codeValue = value.toUpperCase();
  try {
    const response = await fetch(`${baseUrl}/getPromoCode?code=${codeValue}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const orderConfirmed = async (
  productNo,
  address,
  data,
  email,
  userID,
  token_obj,
  subTotal,
  delCharges,
  discount,
  finalPrice,
  fullName
) => {

  const orderDetails = data?.map((item, index) => ({
    id: item?.id,
    name: item?.productName,
    price: parseFloat(item?.price),
    quantity: item?.counter,
    image: item?.image,
    additional_price: 0,
    size: item?.size,
    color: 0,
    title: item?.subText,
    v_id: item?.varID,
    psize_price: 0,
    psize: 0,
    pcolor: 0,
    odoo_id:item?.odo_id
  }));

  try {
    const response = await fetch(`${baseUrl}/order/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },

      body: JSON.stringify({
        order_detail: {
          email: 'order@gmail.com',
          products: productNo,
          address: address?.city + ',' + address?.area + ',' + address?.country,
          full_name: fullName|| '',
          phone_number: address?.phone,
          user_id: userID,
          user_address_id:address?.addressId ,
          order_status: 'confirmed',
          payment_status: 'pending',
          paymentType: token_obj,
          total_price: finalPrice,
          subtotal_price: subTotal,
          discount: discount || 0,
          delivery_price: delCharges || 0,
          Avenue: 'demo',
          theStreet: address?.street +' '+address?.city+' '+ address?.country,
          token: token_obj,
          theHome: 'demo',
          cityTown: address?.city,
          region: address?.area,
          countryName: address?.country,
        },

        product_details: orderDetails,

      }),
    });

    const result = await response.json();
    console.log('sdddsd----',result, 'sdddsd');
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const getOrder = async id => {
  try {
    const response = await fetch(`${baseUrl}/order/${id}/userid`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const deleteAddress = async id => {
  try {
    const response = await fetch(`${baseUrl}/address/${id}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const editAddress = async id => {
  try {
    const response = await fetch(`${baseUrl}/address/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const dummyCategories = async id => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const getReels = async id => {
  try {
    const response = await fetch(`${baseUrl}/get-reels`, {
      // const response = await fetch(`http://192.168.70.206:8000/api/get-reels`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const newArrivalsData = async id => {
  try {
    const response = await fetch(`${baseUrl}/sections`, {
      // const response = await fetch(`http://192.168.70.206:8000/api/get-reels`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const fetchArrivalProducts = async id => {
  try {
    const response = await fetch(`${baseUrl}/sections`, {
      // const response = await fetch(`http://192.168.70.206:8000/api/get-reels`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

// const startEditing = async (addressId) => {
//     try {
//       const response = await axios.get(`${BASE_URL}address/${addressId}`);
//       if (response.data.data && response.data.data[0]) {
//         setEditingAddress(response.data.data[0]);
//         setShowAddForm(true);
//       }
//     } catch (error) {
//       console.error('Error fetching address:', error);
//     }
//   };

export const personalData = async id => {
  console.log('tobah', id);
  try {
    const response = await fetch(`${baseUrl}/getAppUsersById/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};
// export const updateProfile = async (data) => {

//     try {
//         const response = await fetch(`${baseUrl}/setAppUsersUpdate`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Accept: 'application/json',
//             },
//             body: JSON.stringify({
//                 'id': data?.id,
//                 'email': data?.email,
//                 'name': data?.fullName,
//                 'phone': data?.phoneNumber,
//             })
//         });

//         const result = await response.json();
//         return result;

//     } catch (e) {
//         console.log('oo', e)
//     }
// };

export const updateProfile = async (userId, fullName) => {
  try {
    const response = await fetch(`${baseUrl}/customer/update-name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
      body: JSON.stringify({
        token: true,
        userId: userId,
        userName: fullName,
      }),
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const filterData = async () => {
  try {
    const response = await fetch(`${baseUrl}/getFilters`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const filterPriceRange = async () => {
  try {
    const response = await fetch(`${baseUrl}/getProductPriceRange`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const tokenPrice = async (token, price) => {
  try {
    const response = await fetch(
      `https://wanasa.mrtable.ae/public/stripe-page.php?token=${token}&price=${price}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const searchProductByName = async productName => {
  try {
    const response = await fetch(
      `${baseUrl}/getProductName?name=${productName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        },
      },
    );

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const categoriesList = async id => {
  try {
    const response = await fetch(`${baseUrl}/getAllCatesWithSubWeb`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const categoriesListAllWithSub = async () => {
  try {
    const response = await fetch(`${baseUrl}/getAllCatesWithSub`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const categoriesListSubTwoCategory = async () => {
  try {
    const response = await fetch(`${baseUrl}/getListSubTwoCategory`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

// export const categoriesListSub = async (id) => {
//     try {
//         const response = await fetch(`${baseUrl}/getCategories/sub/${id}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Accept: 'application/json',
//             },
//         });

//         const result = await response.json();
//         return result;

//     } catch (e) {
//         console.log('oo', e)
//     }
// };

// export const categoriesListSub = async id => {
//   try {
//     const response = await fetch(`${baseUrl}/category/${id}/products`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
//       },
//     });

//     const result = await response.json();
//     return result;
//   } catch (e) {
//     console.log('oo', e);
//   }
// };

export const categoriesListSub = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/category/${id}/products`, {
    params: { limit: 5, page: 1 } ,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
            'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    // Axios automatically parses JSON
    return response.data;
  } catch (error) {
    console.log('Axios error:', error);
    return null;
  }
};

export const getSettingOption = async () => {
  try {
    const response = await fetch(`${baseUrl}/setting`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();

    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${baseUrl}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
      },
    });

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};

export const fetchCategoryProducts = async value => {
  try {
    const response = await fetch(
      `${baseUrl}/getProductsByType/categories/${value}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Language': I18nManager.isRTL ? 'ar' : 'en',
        },
      },
    );

    const result = await response.json();
    return result;
  } catch (e) {
    console.log('oo', e);
  }
};
