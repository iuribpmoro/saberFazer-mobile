import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { getAuthenticationState } from '../../services/authentication';
import { Text, ListItem, Switch, Icon, Image } from '@rneui/themed';
import { Button, FAB } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import { getProducts, updateProduct } from '../../hooks/product-hooks';
import { ScrollView } from 'react-native-gesture-handler';
import ProductCard from '../../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [updated, setUpdated] = useState([]);

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

  const changeQuantity = async (id, quantity) => {
    const newProducts = products.map((product) => {
      if (product.id_produto === id) {
        return {
          ...product,
          qtd_estoque: quantity,
        };
      }

      return product;
    });

    setProducts(newProducts);

    if (updated.includes(id)) {
      return;
    } else {
      setUpdated([...updated, id]);
    }
  };

  const saveProductUpdate = async (id) => {
    const product = products.find((product) => product.id_produto === id);
    const changedProduct = {
      ...product,
      qtd_estoque: product.qtd_estoque,
    };

    await updateProduct(changedProduct);

    setUpdated(updated.filter((item) => item !== id));
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
    <>
      <FlatList
        key={products.id_produto}
        data={products}
        style={{ width: '100%' }}
        onRefresh={() => setRefreshing(true)}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <ListItem bottomDivider style={{ marginBottom: 8 }}>
            {/* display image in left */}
            {item.img && (
              <Image
                key={`${item.id_produto}-img`}
                source={{ uri: item.img.startsWith("data:image/jpeg;base64,") ? item.img : `data:image/jpeg;base64,${item.img}` }}
                style={{ width: 50, height: 50, borderRadius: 8 }}
              />
            )}
            <ListItem.Content style={styles.productCard}>
              <ListItem.Title style={styles.productName}>{item.nome}</ListItem.Title>
              <ListItem.Subtitle style={styles.price}>Preço: R$ {item.valor}</ListItem.Subtitle>
              {signed && (
                <View style={styles.quantity}>
                  <Button onPress={async () => await changeQuantity(item.id_produto, item.qtd_estoque - 1)} title="-" containerStyle={styles.buttonContainer} buttonStyle={styles.button} />
                  <Text>{item.qtd_estoque}</Text>
                  <Button onPress={async () => await changeQuantity(item.id_produto, item.qtd_estoque + 1)} title="+" containerStyle={styles.buttonContainer} buttonStyle={styles.button} />
                </View>
              )}
              {!signed && (
                <ListItem.Subtitle style={styles.price}>Estoque: {item.qtd_estoque}</ListItem.Subtitle>
              )}
            </ListItem.Content>
            {signed && updated.includes(item.id_produto) && (
              <Button
                onPress={() => saveProductUpdate(item.id_produto)}
                containerStyle={{ borderRadius: 8 }}
                buttonStyle={{ marginLeft: 8, backgroundColor: "#457147" }}
              >
                <Icon name="save" color={"white"} />
              </Button>
            )}
            {signed && (
              <Switch
                value={item.ativo === 1}
                onValueChange={async () => await disableProduct(item.id_produto)}
                color="#457147"
              />
            )}
          </ListItem>
        )}
      />

      {signed && (
        <FAB
          onPress={() => navigation.navigate('AddProductsStack')}
          icon={{ name: 'add', color: '#fff' }}
          color="#457147"
          placement='right'
        />
      )}
    </>
  );
}

const styles = {
  productCard: {
    width: "100%"
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  price: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
    marginTop: 8
  },
  buttonContainer: {
    width: 32,
  },
  button: {
    backgroundColor: "#457147"
  }
};