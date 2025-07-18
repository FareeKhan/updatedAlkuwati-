import { baseUrl } from "../constants/data";

export const homeBanner = async () => {
    try {
        const response = await fetch(`${baseUrl}/getBanners`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;
    } catch (e) {
        console.log('oo', e)
    }
};

export const offerBanner = async () => {
    try {
        const response = await fetch(`${baseUrl}/offer_withCateID`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};




export const newArrivals = async (name) => {
    try {
        const response = await fetch(`${baseUrl}/getProductsByType/categories/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};



export const getFeaturedData = async () => {
    try {
        const response = await fetch(`${baseUrl}/get-featured-categories`, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const getSameProduct = async (name) => {
    try {
        const response = await fetch(`${baseUrl}/getProductsByType/categories/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const productDetails = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/getProductById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const deliveryCharges = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/deliveryCharges_admin`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const editShippingAddress = async (address, userID, id) => {

    try {
        const response = await fetch(`${baseUrl}/address/${id}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                "block_avenue": 'block_avenue',
                "street": address?.street || 'oo',
                "house": "house",
                "area": address?.area || 'oo',
                "city": address?.city || 'oo',
                "country": address?.country || 'oo',
                "governorate": "governorate",
                "user_id": userID,
                "full_name": address?.fullName || 'oo',
                "phone": address?.phone || 'oo',
                "address": 'address',
              "emirates": address?.emirates || '',
            })
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};




export const addShippingAddress = async (address, userID) => {
    console.log('--', address)

    try {
        const response = await fetch(`${baseUrl}/address/store`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                "block_avenue": 'block_avenue',
                "street": address?.street || 'll',
                "house": "house" ,
                "area": address?.area || 'ss',
                "city": address?.city || '--',
                "country": address?.country || 'sadas',
                "governorate": "governorate",
                "user_id": userID,
                "full_name": address?.fullName || '',
                "phone": address?.phone || '',
                "emirates": address?.emirates || '',
                "email": address?.email || null,
                "pickupLocation": address?.pickupLocation || null,
            })



        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const userShippingAddress = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/user/${id}/addresses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const promoCodes = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/promocodes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const postPromoCoder = async (value) => {
    const codeValue = value.toUpperCase();
    try {
        const response = await fetch(`${baseUrl}/getPromoCode?code=${codeValue}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const orderConfirmed = async (productNo, address,  data, email, userID, token_obj, subTotal,delCharges,discount,finalPrice) => {
    const orderDetails = data?.map((item, index) => ({
        "id": item?.id,
        "image": item?.image,
        "name": item?.productName,
        "price": parseFloat(item?.price),
        "additional_price": 0,
        "size": item?.size,
        "color": 0,
        "quantity": item?.counter,
        "title": item?.subText,
        "v_id": 1,
        "psize_price": 0,
        "psize": 0,
        "pcolor": 0,
    }))

    try {
        const response = await fetch(`${baseUrl}/order/store`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },

            body: JSON.stringify({
                "order_detail": {
                    "email": 'order@gmail.com',
                    "products": productNo,
                    "address": address?.city + "," + address?.area + "," + address?.country,
                    "full_name": address?.fullName,
                    "phone_number": address?.phone,
                    "user_id": userID,
                    "order_status": "confirmed",
                    "payment_status": "pending",
                    "paymentType": token_obj,
                    "total_price": finalPrice,
                    "subtotal_price": subTotal,
                    "discount": discount || 0,
                    "delivery_price":delCharges || 0,
                    "Avenue": "demo",
                    "theStreet": address?.street,
                    "token": token_obj,
                    "theHome": "demo",
                    "cityTown": address?.city,
                    "region": address?.area,
                    "countryName": address?.country,
                },

                "product_details": orderDetails
            })
        });

        const result = await response.json();
        console.error(result, "sdddsd");
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const getOrder = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/order/${id}/userid`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const deleteAddress = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/address/${id}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const editAddress = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/address/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const dummyCategories = async (id) => {
    try {
        const response = await fetch(`https://fakestoreapi.com/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const getReels = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/get-reels`, {

            // const response = await fetch(`http://192.168.70.206:8000/api/get-reels`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const newArrivalsData = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/sections`, {

            // const response = await fetch(`http://192.168.70.206:8000/api/get-reels`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const fetchArrivalProducts = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/sections`, {

            // const response = await fetch(`http://192.168.70.206:8000/api/get-reels`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
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

export const personalData = async (id) => {
    console.log('tobah', id)
    try {
        const response = await fetch(`${baseUrl}/getAppUsersById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
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

export const updateProfile = async (userId,fullName) => {
    try {
        const response = await fetch(`${baseUrl}/customer/update-name`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                'token': true,
                'userId': userId,
                'userName': fullName,
            })
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const filterData = async () => {
    try {
        const response = await fetch(`${baseUrl}/getFilters`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const filterPriceRange = async () => {
    try {
        const response = await fetch(`${baseUrl}/getProductPriceRange`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const tokenPrice = async (token, price) => {
    try {
        const response = await fetch(`https://wanasa.mrtable.ae/public/stripe-page.php?token=${token}&price=${price}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const searchProductByName = async (productName) => {
    try {
        const response = await fetch(`${baseUrl}/getProductName?name=${productName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};



export const categoriesList = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/getAllCatesWithSubWeb`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const categoriesListAllWithSub = async () => {
    try {
        const response = await fetch(`${baseUrl}/getAllCatesWithSub`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const categoriesListSubTwoCategory = async () => {
    try {
        const response = await fetch(`${baseUrl}/getListSubTwoCategory`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
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


export const categoriesListSub = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/category/${id}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const getSettingOption = async () => {
    try {
        const response = await fetch(`${baseUrl}/setting`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();

        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const fetchAllProducts = async () => {
    try {
        const response = await fetch(`${baseUrl}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};

export const fetchCategoryProducts = async (value) => {
    try {
        const response = await fetch(`${baseUrl}/getProductsByType/categories/${value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};






