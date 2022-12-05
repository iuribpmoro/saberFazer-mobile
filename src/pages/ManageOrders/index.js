import { useNavigation } from '@react-navigation/native';
import { Dialog, ListItem } from '@rneui/base';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Icon, Button, Input } from '@rneui/themed';
import AuthContext from '../../contexts/auth';
import { getOrders, updateOrder } from '../../hooks/order-hooks';

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const navigation = useNavigation();
  const { signed, user } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [isCancelOrderDialogOpen, setIsCancelOrderDialogOpen] = useState(null);
  const [cancelOrderObservation, setCancelOrderObservation] = useState('');

  const handleCancelOrder = async () => {
    const newOrders = orders.map((order) => {
      if (order.id_pedido === isCancelOrderDialogOpen) {
        return {
          ...order,
          confirmado: 3,
          obs: cancelOrderObservation || '',
          data_hora: order.data_hora.slice(0, 19).replace('T', ' ')
        };
      }

      return order;
    });

    setOrders(newOrders);
    console.log(newOrders);

    const order = orders.find((order) => order.id_pedido === isCancelOrderDialogOpen);
    const changedOrder = {
      ...order,
      confirmado: 3,
      obs: cancelOrderObservation || '',
      data_hora: order.data_hora.slice(0, 19).replace('T', ' ')
    };

    console.log(changedOrder);

    await updateOrder(changedOrder);

    setIsCancelOrderDialogOpen(null);
    setCancelOrderObservation('');
  }

  const changeOrderStatus = async (id, status) => {
    if (status === 3) {
      setIsCancelOrderDialogOpen(id);

      return;
    }

    const newOrders = orders.map((order) => {
      if (order.id_pedido === id) {
        return {
          ...order,
          confirmado: status,
          obs: order.obs || '',
          data_hora: order.data_hora.slice(0, 19).replace('T', ' ')
        };
      }

      return order;
    });

    setOrders(newOrders);

    const order = orders.find((order) => order.id_pedido === id);
    const changedOrder = {
      ...order,
      confirmado: status,
      data_hora: order.data_hora.slice(0, 19).replace('T', ' ')
    };

    await updateOrder(changedOrder);
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

      setOrders(response);
    }

    fetchOrders();
    setRefreshing(false);
  }, [refreshing]);

  return (
    <View style={{ alignItems: 'center', paddingTop: 16 }}>

      <Dialog
        isVisible={isCancelOrderDialogOpen !== null}
        onBackdropPress={() => setIsCancelOrderDialogOpen(null)}
        overlayStyle={{ backgroundColor: '#fff', padding: 16 }}
      >
        <Dialog.Title title="Cancelar pedido" titleStyle={{ textAlign: 'center', paddingBottom: 32 }} />
        <Input
          label="Observação"
          value={cancelOrderObservation}
          onChangeText={setCancelOrderObservation}
          style={{ width: "100%", marginTop: 16 }}
        />
        <Dialog.Actions>
          <Dialog.Button
            title="Salvar"
            onPress={async () => await handleCancelOrder()}
          />
        </Dialog.Actions>
      </Dialog>
      <Dialog.Actions visible={isCancelOrderDialogOpen} />

      <FlatList
        key={orders.id_pedido}
        data={orders}
        style={{ width: '100%' }}
        onRefresh={() => setRefreshing(true)}
        refreshing={refreshing}
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
                  onPress={() => changeOrderStatus(item.id_pedido, 1)}
                >
                  <Icon name="check" color={"white"} />
                </Button>
                <Button
                  onPress={() => changeOrderStatus(item.id_pedido, 3)}
                  buttonStyle={{ marginLeft: 8 }}
                >
                  <Icon name="close" color={"white"} />
                </Button></>
            }

            {signed && getStatus(item.confirmado) === 'Confirmado' &&
              <Button
                onPress={() => changeOrderStatus(item.id_pedido, 2)}
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