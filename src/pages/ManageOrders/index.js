import { useNavigation } from '@react-navigation/native';
import { ListItem } from '@rneui/base';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Icon, Button } from '@rneui/themed';
import AuthContext from '../../contexts/auth';

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const navigation = useNavigation();
  const { signed, user } = useContext(AuthContext);

  const changeOrderStatus = (id, status) => {
    const newOrders = orders.map((order) => {
      if (order.id_pedido === id) {
        return {
          ...order,
          confirmado: true,
          status,
        };
      }

      return order;
    });

    setOrders(newOrders);

    console.log(newOrders);
  };

  useEffect(() => {

    setOrders([
      {
        id_pedido: 1,
        data_hora: "10/10/2022",
        nome_pessoa: 'João da Silva',
        cpf_pessoa: '123.456.789-00',
        forma_pag: 'Dinheiro',
        endereco: 'Rua das Flores, 123',
        confirmado: true,
        status: 'confirmado',
        obs: '',
        valor: 50.00,
      },
      {
        id_pedido: 2,
        data_hora: "11/10/2022",
        nome_pessoa: 'Maria da Silva',
        cpf_pessoa: '123.456.789-00',
        forma_pag: 'Cartão',
        endereco: 'Rua das Flores, 123',
        confirmado: false,
        status: 'pendente',
        obs: '',
        valor: 20.00,
      },
    ]);
  }, []);

  return (
    <View style={{ alignItems: 'center', paddingTop: 16 }}>

      <FlatList
        key={item => item.id_pedido}
        data={orders}
        style={{ width: '100%' }}
        renderItem={({ item }) => (
          <ListItem bottomDivider style={{ marginBottom: 8 }}>
            <ListItem.Content>
              <ListItem.Title style={{ marginBottom: 8 }}>Cliente: {item.nome_pessoa}</ListItem.Title>
              <ListItem.Subtitle>Data: {item.data_hora}</ListItem.Subtitle>

              <ListItem.Subtitle>Endereço: {item.endereco}</ListItem.Subtitle>
              <ListItem.Subtitle>Pagamento: {item.forma_pag}</ListItem.Subtitle>
              <ListItem.Subtitle>Valor: R$ {item.valor.toFixed(2)}</ListItem.Subtitle>
              <ListItem.Subtitle>Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</ListItem.Subtitle>

            </ListItem.Content>

            {signed && !item.confirmado &&
              <>
                <Button
                  onPress={() => changeOrderStatus(item.id_pedido, 'confirmado')}
                >
                  <Icon name="check" color={"white"} />
                </Button>
                <Button
                  onPress={() => changeOrderStatus(item.id_pedido, 'cancelado')}
                  buttonStyle={{ marginLeft: 8 }}
                >
                  <Icon name="close" color={"white"} />
                </Button></>
            }

            {signed && item.status === 'confirmado' &&
              <Button
                onPress={() => changeOrderStatus(item.id_pedido, 'finalizado')}
                buttonStyle={{ marginRight: 8 }}
              >
                <Icon name="check" color={"white"} />
              </Button>
            }
          </ListItem>

        )}
      />

      <Button
        title="Adicionar"
        onPress={() => navigation.navigate('AddOrdersStack')}
      />
    </View>
  );
}