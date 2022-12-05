import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const getAuthenticationState = async () => {
    try {
        const token = await AsyncStorage.getItem('@saberFazer-admin');

        if (token) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
    }

    return false;
}

const setAuthenticated = async () => {
    try {
        await AsyncStorage.setItem('@saberFazer-admin', "true");
    } catch (e) {
        console.log(e)
    }
}

const signOut = async () => {
    try {
        await AsyncStorage.removeItem('@saberFazer-admin');
    } catch (e) {
        console.log(e);
    }
}

function signIn(email, password) {
    // return api post to auth, but resolved
    return new Promise((resolve, reject) => {
        api.post('/auth', {
            email,
            password
        }).then((response) => {
            resolve(response)
        }).catch((error) => {
            resolve(error.response.data)
        });
    });
}

export { getAuthenticationState, setAuthenticated, signOut, signIn };