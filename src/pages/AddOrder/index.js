import { ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Input, Button, Text } from '@rneui/themed';

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
  const [selectedFormaPag, setSelectedFormaPag] = useState("");

  const formasPag = ["Dinheiro", "Débito", "Crédito", "Pix"];

  const handleAddOrder = () => {
    const data_hora = new Date();

    const newOrder = {
      data_hora,
      nome_pessoa: nomePessoa,
      cpf_pessoa: cpfPessoa,
      forma_pag: formaPag,
      endereco: endereco,
      confirmado: false,
      status: 'pendente',
      valor,
      produto: selectedProduct,
      quantidade: 1
    };

    console.log(newOrder);
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

  const handleChangeProduct = (id) => {
    setSelectedProduct(id);
    setValor(products.find((product) => product.id_produto === id).valor);
  };

  const handleChangeQuantity = (quantity) => {
    setQuantidade(quantity);
    setValor(products.find((product) => product.id_produto === selectedProduct).valor * quantity);
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
        style={{ width: "100%", marginTop: 16 }}
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
        onChangeText={() => handleChangeQuantity(quantidade)}
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
        onPress={handleAddOrder}
        containerStyle={{ width: "80%", marginTop: 32 }}
      />
    </ScrollView>
  );
}