import api from "../services/api";

const getOrders = async () => {
    const response = await api.get("/pedido");
    return response.data;
}

const createOrder = async (order) => {
    const response = await api.post("/pedido", order);
    return response.data;
}

const createOrderProducts = async (orderProducts) => {
    const response = await api.post("/pedidoProdutos", orderProducts);
    return response.data;
}

const getOrdersProducts = async () => {
    const response = await api.get("/pedidoProdutos");
    return response.data;
}


const updateOrder = async (order) => {
    const response = await api.put(`/pedido/${order.id_pedido}`, order);
    return response.data;
}

const deleteOrder = async (id) => {
    const response = await api.delete(`/pedido/${id}`);
    return response.data;
}

export { getOrders, createOrder, updateOrder, deleteOrder, createOrderProducts, getOrdersProducts };