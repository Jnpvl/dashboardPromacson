import axios from 'axios';

const API_URL = 'http://localhost:3001/api/orders';

const getPedidos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.pedidos; 
  } catch (error) {
    throw error;
  }
};

const crearPedido = async (pedido) => {
  try {
    const response = await axios.post(API_URL, pedido);
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export default {
  getPedidos,
  crearPedido
};
