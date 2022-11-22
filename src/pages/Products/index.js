import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getAuthenticationState } from '../../services/authentication';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAuthenticationState();

    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <View>
      <Text>Products page</Text>
      <StatusBar style="auto" />

      {isAuthenticated ? (
        <Text>Authenticated</Text>
      ) : (
        <Text>Not authenticated</Text>
      )}
    </View>
  );
}