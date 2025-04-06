import { baseUrl } from "../constants/data";

export const registerUser = async (userName, mobile, password) => {
    try {
        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                "name": userName,
                "phone": mobile,
                "password": password,
            }),
        });
      
        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


export const loginUser = async (mobile, password) => {
    console.log( '===',mobile, password)
    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                "phone": mobile,
                "password": password,
            }),
        });
      
        const result = await response.json();
        return result;

    } catch (e) {
        console.log('oo', e)
    }
};


