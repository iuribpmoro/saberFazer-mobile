import React, { createContext, useState } from "react";
import * as auth from "../services/authentication";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    async function signIn(email, password) {
        const response = await auth.signIn(email, password);

        if (!response.message) {
            setToken(response.data);
        } else {
            return response;
        }

    }

    async function signOut() {
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ signed: !!token, token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>

    );
};

export default AuthContext;