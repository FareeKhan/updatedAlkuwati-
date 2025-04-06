
const { Screen } = require("react-native-screens");

const config = {
    screens:{
        HomeStack:{
            path:'HomeStack'
        },
        ProductDetails:{
            path:'ProductDetails/:catName',
            parse:{ catName: catName => `${catName}`}
        }
    }
}

const linking = {
    prefixes: ['AlkwaityAlawalApp://'],
    config,
}
export default linking;