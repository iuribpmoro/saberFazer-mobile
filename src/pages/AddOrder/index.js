import { ScrollView, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Input, Button, Text, Dialog, ListItem, Icon } from '@rneui/themed';
import { getProducts } from '../../hooks/product-hooks';
import { createOrder, createOrderProducts } from '../../hooks/order-hooks';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function AddOrder() {
  const [nomePessoa, setNomePessoa] = useState('');
  const [cpfPessoa, setCpfPessoa] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [cart, setCart] = useState([]);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [selectedFormaPag, setSelectedFormaPag] = useState("Dinheiro");

  const [refreshing, setRefreshing] = useState(false);

  const formasPag = ["Dinheiro", "Débito", "Crédito", "Pix"];

  const [isProductListVisible, setIsProductListVisible] = useState(false);

  const navigation = useNavigation();

  const handleAddOrder = async () => {
    const data_hora = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const newOrder = {
      data_hora,
      nome_pessoa: nomePessoa,
      cpf_pessoa: cpfPessoa,
      forma_pag: selectedFormaPag,
      endereco: endereco,
      confirmado: 0,
      obs: '',
      valor
    };

    console.log(newOrder);
    try {
      const orderResponse = await createOrder(newOrder);

      const newOrderId = orderResponse.id_pedido;
      console.log(newOrderId);

      for (const item of cart) {
        const newOrderProduct = {
          id_pedido: newOrderId,
          id_produto: item.product.id_produto,
          quantidade: item.quantity,
          status: 0
        };

        console.log(newOrderProduct);

        await createOrderProducts(newOrderProduct);
      }

      navigation.navigate('OrdersStack');
    } catch (error) {
      console.log(error.response);
    }

  };

  const handleCEP = async () => {
    // Fetch the full address from the CEP API
    const response = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);

    // Parse the JSON response
    const { address, city, state, district } = await response.json();

    // Update the address state with the fetched address
    setEndereco(`${address}, ${district}, ${city} - ${state}`);
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts();

      const activeProducts = response.filter((product) => product.ativo === 1);

      setProducts(activeProducts);
    }

    fetchProducts();
    setRefreshing(false);
  }, [refreshing]);

  const handleChangeProduct = (id) => {
    setSelectedProduct(id);
    setValor(Number(products.find((product) => product.id_produto === id).valor) * quantidade);

  };

  const handleChangeQuantity = (quantity) => {
    setQuantidade(quantity);
    setValor(Number(products.find((product) => product.id_produto === selectedProduct).valor) * quantity);
  };

  const handleAddToCart = (id) => {
    // setCart([])
    const product = products.find((product) => product.id_produto === id);

    // Check if the product is already in the cart
    const productInCart = cart.find((item) => item.product.id_produto === id);

    if (productInCart) {
      // If the product is already in the cart, update the quantity
      const updatedCart = cart.map((item) => {
        const newQuantity = item.quantity + 1;

        if (item.product.id_produto === id) {
          return {
            product: item.product,
            quantity: newQuantity > product.qtd_estoque ? product.qtd_estoque : newQuantity,
          };
        } else {
          return item;
        }
      });

      console.log(updatedCart);

      setCart(updatedCart);
    } else {
      // If the product is not in the cart, add it to the cart
      setCart([
        ...cart,
        {
          product,
          quantity: product.qtd_estoque < 1 ? 0 : 1,
        }
      ]);
    }

    const newTotal = calculateTotal();
    setValor(newTotal);
  };

  const handleRemoveFromCart = (id) => {
    const productInCart = cart.find((item) => item.product.id_produto === id);

    if (productInCart) {
      const updatedCart = cart.map((item) => {

        const newQuantity = item.quantity - 1;

        // if the new quantity is 0, remove the product from the cart
        if (item.product.id_produto === id) {
          return {
            product: item.product,
            quantity: newQuantity < 0 ? 0 : newQuantity,
          };
        } else {
          return item;
        }
      });

      console.log(updatedCart);
      setCart(updatedCart);
    } else {
      setCart(cart.filter((item) => item.product.id_produto !== id));
    }

    const newTotal = calculateTotal();
    setValor(newTotal);
  };

  const getProductCartQuantity = (id) => {
    const product = cart.find((item) => item.product?.id_produto === id);

    if (product) {
      return product.quantity;
    } else {
      return 0;
    }
  };

  const calculateTotal = () => {
    const total = cart.reduce((acc, item) => {
      return acc + (item.product.valor * item.quantity);
    }, 0);

    return total;
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 16, flexGrow: 1, paddingBottom: 32 }}>

      <Input
        label="Nome do Cliente"
        value={nomePessoa}
        onChangeText={setNomePessoa}
        style={{ width: "100%", marginTop: 16 }}
        labelStyle={{ color: '#457147' }}
      />

      <Input
        label="CPF do Cliente"
        value={cpfPessoa}
        onChangeText={setCpfPessoa}
        style={{ width: "100%", marginTop: 16 }}
        labelStyle={{ color: '#457147' }}
      />

      <Input
        label="CEP"
        value={cep}
        onChangeText={setCep}
        onEndEditing={handleCEP}
        style={{ width: "100%", marginTop: 16 }}
        labelStyle={{ color: '#457147' }}
      />

      <Input
        label="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        textContentType="fullStreetAddress"
        numberOfLines={4}
        multiline={true}
        style={{ width: "100%", marginTop: 16, alignItems: 'flex-start', textAlignVertical: 'top' }}
        labelStyle={{ color: '#457147' }}
      />

      <Text
        style={{ marginTop: 16, alignSelf: "flex-start", marginLeft: 8, fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: "#457147" }}>
        Produtos
      </Text>
      {/* {cart.map((item) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, color: '#457147' }}>{item.product.nome}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => handleRemoveFromCart(item.product.id_produto, item.quantidade - 1)}>
              <Icon name="minus" size={24} color="#457147" />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, color: '#457147', marginHorizontal: 8 }}>{item.quantidade}</Text>
            <TouchableOpacity onPress={() => handleAddToCart(item.product.id_produto, item.quantidade + 1)}>
              <Icon name="plus" size={24} color="#457147" />
            </TouchableOpacity>
          </View>
        </View>
      ))} */}
      <Button
        mode="contained"
        onPress={() => setIsProductListVisible(true)}
        style={{ width: "100%", marginTop: 16, marginBottom: 16 }}
        labelStyle={{ color: '#457147' }}
        buttonStyle={{ backgroundColor: "#457147" }}
        containerStyle={{ alignSelf: "flex-start", marginLeft: 8, marginBottom: 16, borderRadius: 8 }}
      >
        Adicionar Produtos
      </Button>

      <Dialog
        visible={isProductListVisible}
        onBackdropPress={() => setIsProductListVisible(false)}
      >
        {products.map((product) => (
          <ListItem bottomDivider style={{ marginBottom: 8 }}>
            <ListItem.Content
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View>
                <ListItem.Title>{product.nome}</ListItem.Title>
                <ListItem.Subtitle>R$ {product.valor}</ListItem.Subtitle>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: 100,
                }}
              >
                <Button onPress={() => handleRemoveFromCart(product.id_produto)} title="-" containerStyle={{ width: 32 }} buttonStyle={{ backgroundColor: "#457147" }} />
                <Text>{getProductCartQuantity(product.id_produto)}</Text>
                <Button onPress={() => handleAddToCart(product.id_produto)} title="+" containerStyle={{ width: 32 }} buttonStyle={{ backgroundColor: "#457147" }} />
              </View>
            </ListItem.Content>
          </ListItem>
        ))}
      </Dialog>

      {/* <ProductListDialog
        visible={isProductListVisible}
        products={products}
        onAdd={handleAddToCart(selectedProduct, quantidade)}

      /> */}
      {/* <Picker
        selectedValue={selectedProduct}
        style={{ width: "100%", marginBottom: 16 }}
        onValueChange={(itemValue, itemIndex) => handleChangeProduct(itemValue)}
        placeholder="Selecione um produto"
      >
        {products.map((product) => (
          <Picker.Item
            key={product.id_produto}
            label={product.nome}
            value={product.id_produto}
            style={{ marginLeft: 16 }}
          />
        ))}
      </Picker>

      <Input
        label="Quantidade"
        value={quantidade}
        onChangeText={handleChangeQuantity}
        style={{ width: "100%", marginTop: 16 }}
        labelStyle={{ color: '#457147' }}
      /> */}

      <Text
        style={{ marginTop: 16, alignSelf: "flex-start", marginLeft: 8, fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#457147' }}>
        Forma de Pagamento
      </Text>
      <Picker
        selectedValue={selectedFormaPag}
        style={{ width: "100%", marginTop: 16 }}
        onValueChange={(itemValue, itemIndex) => setSelectedFormaPag(itemValue)}
        accessibilityLabel="Selecione uma forma de pagamento"
      >
        {formasPag.map((forma) => (
          <Picker.Item
            key={forma}
            label={forma}
            value={forma}
            style={{ marginLeft: 16 }}
          />
        ))}
      </Picker>

      <Text
        style={{ marginTop: 16, alignSelf: "flex-start", marginLeft: 8, fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#457147' }}>
        Valor Total:
      </Text>
      <Text
        style={{ marginTop: 16, alignSelf: "flex-start", marginLeft: 8, fontSize: 16, marginBottom: 8, color: 'black' }}>
        R$ {calculateTotal().toFixed(2)}
      </Text>

      <Button
        title="Adicionar Pedido"
        onPress={async () => await handleAddOrder()}
        containerStyle={{ width: '80%', marginTop: 32, borderRadius: 8 }}
        buttonStyle={{ backgroundColor: "#457147" }}
      />
    </ScrollView>
  );
}