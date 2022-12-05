import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import * as auth from "../services/authentication";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

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

    useEffect(() => {
        const isSignedIn = async () => {
            const token = await AsyncStorage.getItem("@saberFazer-token");

            return token;
        };

        isSignedIn().then((response) => {
            console.log(response);
            setToken(response);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ signed: !!token, token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>

    );
};

export default AuthContext;