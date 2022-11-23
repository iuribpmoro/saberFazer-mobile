import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { getAuthenticationState } from '../../services/authentication';
import { Text, ListItem } from '@rneui/themed';

export default function Products() {
  const [products, setProducts] = useState([]);

  const newProduct = {
    id_produto: 1,
    nome: 'Produto 1',
    valor: 10.00,
    qtd_estoque: 10,
    img: 'https://picsum.photos/200/300',
    ativo: true,
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAuthenticationState();

    if (token) {
      setIsAuthenticated(true);
    }

    setProducts([newProduct]);
  }, []);

  return (
    <View style={{ alignItems: 'center', paddingTop: 16 }}>
      <Text h4>Products page</Text>

      <FlatList
        key={products.id_produto}
        data={products}
        style={{ width: '100%' }}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.nome}</ListItem.Title>
              <ListItem.Subtitle>{item.valor}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />

      {isAuthenticated ? (
        <Text>Authenticated</Text>
      ) : (
        <Text>Not authenticated</Text>
      )}
    </View>
  );
}