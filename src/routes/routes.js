import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AuthContext from '../contexts/auth';

import ProductsScreen from '../pages/Products';
import AddProductScreen from '../pages/AddProduct';
import OrdersScreen from '../pages/ManageOrders';
import AddOrderScreen from '../pages/AddOrder';
import Login from '../pages/Login';

const Drawer = createDrawerNavigator();
const Products = createNativeStackNavigator();
const Orders = createNativeStackNavigator();

export default function Routes() {
    const { signed, signOut } = useContext(AuthContext);


    function LogoutDrawerContent(props) {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                {signed && (
                    <DrawerItem label="Logout" onPress={() => signOut()} />
                )}
            </DrawerContentScrollView>
        );
    }

    function ProductsStackScreen() {
        return (
            <Products.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProductsStack">
                <Products.Screen name="ProductsStack" component={ProductsScreen} />
                {signed &&
                    <Products.Screen name="AddProductsStack" component={AddProductScreen} />
                }
            </Products.Navigator>
        );
    }

    function OrdersStackScreen() {
        return (
            <Orders.Navigator screenOptions={{ headerShown: false }} initialRouteName="OrdersStack">
                <Orders.Screen name="OrdersStack" component={OrdersScreen} />
                <Orders.Screen name="AddOrdersStack" component={AddOrderScreen} />
            </Orders.Navigator>
        );
    }

    return (
        <Drawer.Navigator drawerContent={props => <LogoutDrawerContent {...props} />}>
            <Drawer.Screen name="Produtos" component={ProductsStackScreen} />
            <Drawer.Screen name="Pedidos" component={OrdersStackScreen} />
            {!signed &&
                <Drawer.Screen name="Login" component={Login} />
            }
        </Drawer.Navigator>
    );
}