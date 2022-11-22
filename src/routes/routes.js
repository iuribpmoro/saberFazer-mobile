import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProductsScreen from '../pages/Products';
import AddProductScreen from '../pages/AddProduct';
import { getAuthenticationState } from '../services/authentication';

const Drawer = createDrawerNavigator();
const Products = createNativeStackNavigator();


export default function Routes() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // const token = localStorage.getItem('token');
        const authState = getAuthenticationState();

        if (authState) {
            setIsAuthenticated(true);
        }
    }, []);

    function ProductsStackScreen() {
        return (
            <Products.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProductsStack">
                <Products.Screen name="ProductsStack" component={ProductsScreen} />
                {isAuthenticated &&
                    <Products.Screen name="AddProductsStack" component={AddProductScreen} />
                }
            </Products.Navigator>
        );
    }

    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Products" component={ProductsStackScreen} />
        </Drawer.Navigator>
    );
}