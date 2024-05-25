import axios from 'axios';
import { API_URL } from './API_URL';

const URL = 'http://192.168.1.72:3002/api/' + 'orders';
//const URL ='http://tiendapromacson.ddns.net/api/' +'orders';

const getPedidos = async () => {
  try {
    const response = await axios.get(URL);
    return response.data.pedidos; 
  } catch (error) {
    throw error;
  }
};

const crearPedido = async (pedido) => {
  try {
    const response = await axios.post(URL, pedido);
    return response.data; 
  } catch (error) {
    throw error;
  }
};

const deletePedido = async (folio) => {
  try {
    const response = await axios.delete(`${URL}/${folio}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const actualizarPedido = async (folio,pedido) =>{
  try{
    const response = await axios.put(`${URL}/${folio}`, pedido);
    return response.data;
  }catch (error){
    throw error;
  }
}

const getDetallesPedido = async (folio) => {
  try {
    const response = await axios.get(`${URL}/${folio}`);
    return response.data.pedido;
  } catch (error) {
    throw error;
  }
};

const getCoordenadasPedido = async (folio) => {
  try{
    const response = await axios.get(`${URL}/seguimiento/${folio}`);
    return response.data;
  } catch (error){
    throw error;
  }
}




export default {
  getPedidos,
  crearPedido,
  deletePedido,
  actualizarPedido,
  getDetallesPedido,
  getCoordenadasPedido
};
