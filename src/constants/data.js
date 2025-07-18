import ExportSvg from './ExportSvg'
//export const baseUrl = 'https://homee.ae/api'
//export const baseUrl = 'http://192.168.70.57:8000/api' 
// export const baseUrl = 'https://kuwaity.skcosmetics.app/api' 
export const baseUrl = 'https://backend.alkwaityalawl.com/api' 
//export const baseUrl = 'https://demoapi.homee.ae/api' 

export const OTP_URL = 'https://admin.homee.ae/';

// export const SP_KEY = 'pk_test_51Pjir909Qlf6znZyPJKWaATb6BQCubm7NTPIGBL0449uEjz82nv7d6fHGGOOwinDogCK3uJYWtJzdWhvFrQDjoEx00e5Iv94BY'
export const SP_KEY = 'pk_test_51PV9zKFt9d3eerZLogRwve2G5YO4ZUNIUnLCEFpiljRIfKVN7hI7dle16OjcnN2ly7T2vwmB9FWJG0JGzSMCQnNe00k69iWIhI'
export const GOOGLE_API='AIzaSyAo2MfsEOJJqEyVA2iQ1xWVWcMQm_NnVV8'

export const discountProducts = [
    {
        "discount": '50% off',
        "title": "on everything today",
        "subTitle": "With code rikafashion 2021",
        "bgImage": require('../assets/discountImages/discount1.png')
    },
    {
        "discount": '70% off',
        "title": "on everything today",
        "subTitle": "With code rikafashion 2021",
        "bgImage": require('../assets/discountImages/discount2.png')
    },
    {
        "discount": '75% off',
        "title": "on everything today",
        "subTitle": "With code rikafashion 2021",
        "bgImage": require('../assets/discountImages/discount3.png')
    },
    {
        "discount": '60% off',
        "title": "on everything today",
        "subTitle": "With code rikafashion 2021",
        "bgImage": require('../assets/discountImages/discount1.png')
    },
]



export  const governorateData = (t)=>[
  {
    label: t('Al-Asima'),
    id: 1,
  },
  {
    label: t('Hawally'),
    id: 2,
  },
  {
    label: t('Mubarak-Al-Kabir'),
    id: 3,
  },
  {
    label: t('Ahmadi'),
    id: 4,
  },
  {
    label: t('Farwaniya'),
    id: 5,
  },
  {
    label: t('Jahra'),
    id: 6,
  },
];

export   const CountriesData = (t)=>[
    {
      label: t('Kuwait'),
      id: 1,
      code: '+965',
    },
    {
      label: t('Saudi Arabia'),
      id: 2,
      code: '+966',
    },
    {
      label: t('United Arab Emirates'),
      id: 3,
      code: '+971',
    },
    {
      label: t('Bahrain'),
      id: 4,
      code: '+973',
    },
    {
      label: t('Qatar'),
      id: 5,
      code: '+974',
    },
    {
      label: t('Oman'),
      id: 6,
      code: '+968',
    },
  ]



export const newArrival = [
    {
        title: "The Marc Jacobs",
        subTxt: "Traveler Tote",
        price: "KD95.00",
        img: require('../assets/images/bag.png')

    },
    {
        title: "Axil Arigato",
        subTxt: "Clean 90 Triple Sneakers",
        price: "KD45.00",
        img: require('../assets/images/shoes.png')


    },
    {
        title: "The Marc Jacobs",
        subTxt: "Traveler Tote",
        price: "KD95.00",
        img: require('../assets/images/bag.png')

    },
    {
        title: "Axil Arigato",
        subTxt: "Clean 90 Triple Sneakers",
        price: "KD45.00",
        img: require('../assets/images/shoes.png')


    }
]

export const sizeData = [
    {
        id:1,
        label:"XS"
    },
    {
        id:2,
        label:"S"
    },
    {
        id:3,
        label:"M"
    },
    {
        id:4,
        label:"L"
    },
    {
        id:5,
        label:"XL"
    },
]

export const colorData = [
    {
        id:1,
        label:"red"
    },
    {
        id:2,
        label:"blue"
    },
    {
        id:3,
        label:"green"
    },
    {
        id:4,
        label:"orange"
    },
    {
        id:5,
        label:"black"
    },
]


export const allProducts = [
    {
        title: "New Arrivals",
        products: "208 products",
        img: require('../assets/productImages/shirt1.png')

    },
    {
        title: "Clothes",
        products: "358 products",
        img: require('../assets/productImages/shirt2.png')

    },
    {
        title: "Bags",
        products: "160 Products",
        img: require('../assets/productImages/shirt3.png')

    },
    {
        title: "Shoes",
        products: "230 Products",
        img: require('../assets/productImages/shirt4.png')


    },
    {
        title: "Electronics",
        products: "230 Products",
        img: require('../assets/productImages/shirt5.png')

    },
  

]


export const bags = [
    {
        title: "The Marc Jacobs",
        subTxt: "Traveler Tote",
        price: "KD95.00",
        img: require('../assets/bagImages/bag1.png')

    },
    {
        title: "Bembien",
        subTxt: "Clean 90 Triple Sneakers",
        price: "KD45.00",
        img: require('../assets/bagImages/bag2.png')

    },
    {
        title: "Herschel Supply Co.",
        subTxt: "Traveler Tote",
        price: "KD95.00",
        img: require('../assets/bagImages/bag3.png')

    },
    {
        title: "Dagne Dover",
        subTxt: "Clean 90 Triple Sneakers",
        price: "KD45.00",
        img: require('../assets/bagImages/bag4.png')


    },


]


export const electronics = [
    {
        title: "On Ear Headphone",
        subTxt: "Traveler Tote",
        price: "KD95.00",
        img: require('../assets/electronicImages/electronic1.png')

    },
    {
        title: "Apple Watch",
        subTxt: "Clean 90 Triple Sneakers",
        price: "KD45.00",
        img: require('../assets/electronicImages/electronic2.png')

    },
    {
        title: "Table lamp LED",
        subTxt: "Traveler Tote",
        price: "KD95.00",
        img: require('../assets/electronicImages/electronic3.png')

    },
    {
        title: "light bulb",
        subTxt: "Clean 90 Triple Sneakers",
        price: "KD45.00",
        img: require('../assets/electronicImages/electronic4.png')


    },


]


export const discount = [
    {
        title: "On Ear Headphone",
        subTxt: "Traveler Tote",
        price: "KD95.00",
        img: require('../assets/electronicImages/electronic1.png')

    },
    {
        title: "Apple Watch",
        subTxt: "Clean 90 Triple Sneakers",
        price: "KD45.00",
        img: require('../assets/electronicImages/electronic2.png')

    },
    {
        title: "Table lamp LED",
        subTxt: "Traveler Tote",
        price: "KD95.00",
        img: require('../assets/electronicImages/electronic3.png')

    },
    {
        title: "light bulb",
        subTxt: "Clean 90 Triple Sneakers",
        price: "KD45.00",
        img: require('../assets/electronicImages/electronic4.png')


    },


]


export const filters = [

    {
        title: "Dresses"
    },
    {
        title: "Jackets"
    },
   
    {
        title: "Shoes"
    },
    {
        title: "Bags"
    },
    {
        title: "Clothes"
    },
    {
        title: "Jeans"
    },
    {
        title: "Shorts"
    },
    {
        title: "Tops"
    },
    {
        title: "Sneakers"
    },
    {
        title: "Cots"
    },
    {
        title: "Lingenies"
    },


]

export const sorted = [

    {
        name: "New Today"
    },
    {
        name: "New This Week"
    },
    {
        name: "Top Sellers"
    },
]


export const ratingStar = [

    {
        star: <ExportSvg.FiveStar />,
        rating: 'five'
    },
    {
        star: <ExportSvg.FourStar />,
        rating: 'four'

    },
    {
        star: <ExportSvg.ThreeStar />,
        rating: 'three'

    },
    {
        star: <ExportSvg.TwoStar />,
        rating: 'two'

    },
]

export const productSize = [
    {
        size: "S"
    },
    {
        size: "M"

    },
    {
        size: "L"
    },
]

export const PaymentCards = [
    {
        paymentMethod: 'Credit Card'
    },
    {
        paymentMethod: 'Paypal'

    },
    {
        paymentMethod: 'Visa'

    },
    {
        paymentMethod: 'Google Pay'

    },
]

export const dressList = [
    {
        title: "Roller Rabbit",
        subTxt: "Vado Odelle Dress",
        price: "KD98.00",
        img: require('../assets/images/girlImages/GirlFirst.png'),
    },
    {
        title: "endless rose",
        subTxt: "Bubble Elastic T-shirt",
        price: "KD50.00",
        img: require('../assets/images/girlImages/GirlSecond.png'),
        right:true
    },
    {
        title: "Roller Rabbit",
        subTxt: "Vado Odelle Dress",
        price: "KD98.00",
        img: require('../assets/images/girlImages/GirlThird.png'),
    },
    {
        title: "Bella Chaooo",
        subTxt: "Vado Odelle Dress",
        price: "KD98.00",
        img: require('../assets/images/girlImages/GirlFourth.png'),
        right:true

    },
     {
        title: "Roller Rabbit",
        subTxt: "Vado Odelle Dress",
        price: "KD98.00",
        img: require('../assets/images/girlImages/GirlThird.png'),
    },
    {
        title: "Bella Chaooo",
        subTxt: "Vado Odelle Dress",
        price: "KD98.00",
        img: require('../assets/images/girlImages/GirlFourth.png'),
        right:true

    },
]  


export const paymentMethodCard = (t)=>[
    {
        paymentName: t('creditCard'),
        svg: <ExportSvg.CreditCard />,
        id:1

    },
    {
        paymentName: t('cash'),
        svg: <ExportSvg.Wallet />,
              id:2

    },

]




export  const arabicToEnglish = (text) => {
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        return text.replace(/[٠-٩]/g, (d) => englishNumbers[arabicNumbers.indexOf(d)]);

    };
