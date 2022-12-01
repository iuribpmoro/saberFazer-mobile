import AsyncStorage from '@react-native-async-storage/async-storage';

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

function signIn() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                token: 'jk12h3j21h3jk212h3jk12h3jkh12j3kh12k123hh21g3f12f3',
                user: {
                    name: 'Thiago',
                    email: 'thiagomarinho@rockeseat.com.br',
                }
            });
        }, 2000);
    });
}

export { getAuthenticationState, setAuthenticated, signOut, signIn };