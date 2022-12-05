import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { getAuthenticationState } from '../../services/authentication';
import { Text, ListItem, Switch } from '@rneui/themed';
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import { getProducts, updateProduct } from '../../hooks/product-hooks';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // const newProduct = {
  //   id_produto: 1,
  //   nome: 'Produto 1',
  //   valor: 10.00,
  //   qtd_estoque: 10,
  //   img: 'https://picsum.photos/200/300',
  //   ativo: true,
  // }

  const { signed } = useContext(AuthContext);
  const navigation = useNavigation();

  const disableProduct = async (id) => {
    const newProducts = products.map((product) => {
      if (product.id_produto === id) {
        return {
          ...product,
          ativo: product.ativo === 1 ? 0 : 1,
        };
      }

      return product;
    });

    setProducts(newProducts);

    const product = products.find((product) => product.id_produto === id);
    const disabledProduct = {
      ...product,
      ativo: product.ativo === 1 ? 0 : 1,
    };

    await updateProduct(disabledProduct);

  };

  useEffect(() => {

    const fetchProducts = async () => {
      const response = await getProducts();

      setProducts(response);
    }

    fetchProducts();
    setRefreshing(false);

  }, [refreshing]);

  return (
    <View style={{ alignItems: 'center', paddingTop: 16 }}>

      <FlatList
        key={products.id_produto}
        data={products}
        style={{ width: '100%' }}
        onRefresh={() => setRefreshing(true)}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <ListItem bottomDivider style={{ marginBottom: 8 }}>
            <ListItem.Content>
              <ListItem.Title>{item.nome}</ListItem.Title>
              <ListItem.Subtitle>R$ {Number(item.valor).toFixed(2)}</ListItem.Subtitle>
            </ListItem.Content>
            {signed && (
              <Switch
                value={item.ativo === 1}
                onValueChange={async () => await disableProduct(item.id_produto)}
              />
            )}
          </ListItem>
        )}
      />

      {signed && (
        <Button
          title="Adicionar"
          onPress={() => navigation.navigate('AddProductsStack')}
        />
      )}
    </View>
  );
}