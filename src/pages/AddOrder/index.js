import { ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Input, Button, Text } from '@rneui/themed';

export default function AddOrder() {
  const [nomePessoa, setNomePessoa] = useState('');
  const [cpfPessoa, setCpfPessoa] = useState('');
  const [formaPag, setFormaPag] = useState('');
  const [endereco, setEndereco] = useState('');
  const [valor, setValor] = useState('');

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
    };

    console.log(newOrder);
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
        label="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        style={{ width: "100%", marginTop: 16 }}
      />

      <Input
        label="Valor"
        value={valor}
        onChangeText={setValor}
        style={{ width: "100%", marginTop: 16 }}
      />

      <Text
        style={{ marginTop: 16, alignSelf: "flex-start", marginLeft: 8, fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: "grey" }}>
        Produto
      </Text>

      <Picker
        selectedValue={selectedProduct}
        style={{ width: "100%" }}
        onValueChange={(itemValue, itemIndex) => setSelectedProduct(itemValue)}
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


      <Text
        style={{ marginTop: 16, alignSelf: "flex-start", marginLeft: 8, fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: "grey" }}>
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

      <Button
        title="Adicionar Pedido"
        onPress={handleAddOrder}
        containerStyle={{ width: "80%", marginTop: 32 }}
      />
    </ScrollView>
  );
}