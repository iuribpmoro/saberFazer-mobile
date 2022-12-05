import { ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Input, Button, Text } from '@rneui/themed';
import { getProducts } from '../../hooks/product-hooks';
import { createOrder } from '../../hooks/order-hooks';
import { useNavigation } from '@react-navigation/native';

export default function AddOrder() {
  const [nomePessoa, setNomePessoa] = useState('');
  const [cpfPessoa, setCpfPessoa] = useState('');
  const [formaPag, setFormaPag] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [selectedFormaPag, setSelectedFormaPag] = useState("Dinheiro");

  const [refreshing, setRefreshing] = useState(false);

  const formasPag = ["Dinheiro", "Débito", "Crédito", "Pix"];

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

      const newOrderProduct = {
        id_pedido: newOrderId,
        id_produto: selectedProduct,
        quantidade,
        status: 0
      };

      console.log(newOrderProduct);

      navigation.navigate('OrdersStack');
    } catch (error) {
      console.log(error);
    }

    // const newOrderItem = {
    //   id_produto: selectedProduct,
    //   id
    // }

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

    console.log(new Date().toISOString().slice(0, 19).replace('T', ' '))

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
    console.log(quantity, valor);
  };


  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 16, flexGrow: 1, paddingBottom: 32 }}>

      <Input
        label="Nome do Cliente"
        value={nomePessoa}
        onChangeText={setNomePessoa}
        style={{ width: "100%", marginTop: 16 }}
      />

      <Input
        label="CPF do Cliente"
        value={cpfPessoa}
        onChangeText={setCpfPessoa}
        style={{ width: "100%", marginTop: 16 }}
      />

      <Input
        label="CEP"
        value={cep}
        onChangeText={setCep}
        onEndEditing={handleCEP}
        style={{ width: "100%", marginTop: 16 }}
      />

      <Input
        label="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        textContentType="fullStreetAddress"
        numberOfLines={4}
        multiline={true}
        style={{ width: "100%", marginTop: 16, alignItems: 'flex-start', textAlignVertical: 'top' }}
      />

      <Text
        style={{ marginTop: 16, alignSelf: "flex-start", marginLeft: 8, fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: "grey" }}>
        Produto
      </Text>

      <Picker
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
      />

      <Text
        style={{ marginTop: 16, alignSelf: "flex-start", marginLeft: 8, fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: "grey" }}>
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
        style={{ marginTop: 16, alignSelf: "flex-start", marginLeft: 8, fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: "grey" }}>
        Valor Total:
      </Text>
      <Text
        style={{ marginTop: 16, alignSelf: "flex-start", marginLeft: 8, fontSize: 16, marginBottom: 8, color: "grey" }}>
        R$ {Number(valor).toFixed(2)}
      </Text>

      <Button
        title="Adicionar Pedido"
        onPress={async () => await handleAddOrder()}
        containerStyle={{ width: "80%", marginTop: 32 }}
      />
    </ScrollView>
  );
}