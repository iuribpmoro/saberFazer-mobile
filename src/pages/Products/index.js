import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { getAuthenticationState } from '../../services/authentication';
import { Text, ListItem, Switch } from '@rneui/themed';
import { Button } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';

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

  const { signed } = useContext(AuthContext);
  const navigation = useNavigation();

  const disableProduct = (id) => {
    const newProducts = products.map((product) => {
      if (product.id_produto === id) {
        return {
          ...product,
          ativo: !product.ativo,
        };
      }

      return product;
    });

    setProducts(newProducts);
  };

  useEffect(() => {

    setProducts([
      {
        id_produto: 1,
        nome: 'Produto 1',
        valor: 10.00,
        qtd_estoque: 10,
        img: 'https://picsum.photos/200/300',
        ativo: true,
      },
      {
        id_produto: 2,
        nome: 'Produto 2',
        valor: 20.00,
        qtd_estoque: 5,
        img: 'https://picsum.photos/200/400',
        ativo: true,
      }
    ]);
  }, []);

  return (
    <View style={{ alignItems: 'center', paddingTop: 16 }}>

      <FlatList
        key={products.id_produto}
        data={products}
        style={{ width: '100%' }}
        renderItem={({ item }) => (
          <ListItem bottomDivider style={{ marginBottom: 8 }}>
            <ListItem.Content>
              <ListItem.Title>{item.nome}</ListItem.Title>
              <ListItem.Subtitle>R$ {item.valor.toFixed(2)}</ListItem.Subtitle>
            </ListItem.Content>
            {signed && (
              <Switch
                value={item.ativo}
                onValueChange={() => disableProduct(item.id_produto)}
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