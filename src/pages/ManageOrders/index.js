import { useNavigation } from '@react-navigation/native';
import { ListItem } from '@rneui/base';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Icon, Button } from '@rneui/themed';
import AuthContext from '../../contexts/auth';
import { getOrders } from '../../hooks/order-hooks';

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const navigation = useNavigation();
  const { signed, user } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

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

  const getStatus = (status) => {
    switch (status) {
      case 0:
        return 'Aguardando confirmação';
      case 1:
        return 'Confirmado';
      case 2:
        return 'Finalizado';
      case 3:
        return 'Cancelado';
      default:
        return 'Aguardando confirmação';
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getOrders();
      console.log(response);

      setOrders(response);
    }

    fetchOrders();
    setRefreshing(false);
  }, [refreshing]);

  return (
    <View style={{ alignItems: 'center', paddingTop: 16 }}>

      <FlatList
        key={item => item.id_pedido}
        data={orders}
        style={{ width: '100%' }}
        refreshing={refreshing}
        onRefresh={() => setRefreshing(true)}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#999' }}>Nenhum pedido encontrado</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <ListItem bottomDivider style={{ marginBottom: 8 }}>
            <ListItem.Content>
              <ListItem.Title style={{ marginBottom: 8 }}>Cliente: {item.nome_pessoa}</ListItem.Title>
              <ListItem.Subtitle>Data: {item.data_hora}</ListItem.Subtitle>

              <ListItem.Subtitle>Endereço: {item.endereco}</ListItem.Subtitle>
              <ListItem.Subtitle>Pagamento: {item.forma_pag}</ListItem.Subtitle>
              <ListItem.Subtitle>Valor: R$ {Number(item.valor).toFixed(2)}</ListItem.Subtitle>
              <ListItem.Subtitle>Status: {getStatus(item.confirmado)}</ListItem.Subtitle>

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