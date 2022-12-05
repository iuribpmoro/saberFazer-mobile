import api from "../services/api";

const getProducts = async () => {
    const response = await api.get("/produto");
    return response.data;
}

const createProduct = async (product) => {
    const response = await api.post("/produto", product);
    return response.data;
}

const updateProduct = async (product) => {
    const response = await api.put(`/produto/${product.id_produto}`, product);;
    return response.data;
}

const deleteProduct = async (id) => {
    const response = await api.delete(`/produto/${id}`);
    return response.data;
}

export { getProducts, createProduct, updateProduct, deleteProduct };