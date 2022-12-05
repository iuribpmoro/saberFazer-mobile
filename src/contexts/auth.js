import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState } from "react";
import * as auth from "../services/authentication";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    function isSigned() {
        return new Promise((resolve, reject) => {
            resolve(AsyncStorage.getItem("@saberFazer-token"));
        });
    }

    async function signIn(email, password) {
        const response = await auth.signIn(email, password);

        if (!response.message) {
            setToken(response.data);
            await AsyncStorage.setItem('@saberFazer-token', response.data);
        } else {
            return response;
        }

    }

    async function signOut() {
        setToken(null);
        await AsyncStorage.removeItem('@saberFazer-token');
    }

    return (
        <AuthContext.Provider value={{ signed: !!isSigned(), token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>

    );
};

export default AuthContext;