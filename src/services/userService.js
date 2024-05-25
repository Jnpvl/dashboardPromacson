import axios from 'axios';
import { API_URL } from './API_URL';

const URL = 'http://192.168.1.72:3002/api/' + 'users';
//const URL = 'http://tiendapromacson.ddns.net/api/' + 'users';

const getUsuarios = async () => {
  try {
    const response = await axios.get(URL);
    return response.data.usuarios;
  } catch (error) {
    throw error;
  }
};

const crearUsuario = async (usuario) => {
  try {
    const response = await axios.post(URL, usuario);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const actualizarUsuario = async (id, usuario) => {
  try {
    const response = await axios.put(`${URL}/${id}`, usuario);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUsuario = async (id) => {
  try {
    const response = await axios.delete(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  deleteUsuario
};
