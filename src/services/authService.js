

import axios from 'axios';
import { API_URL } from './API_URL';

const URL = API_URL + 'login';

const login = async (nombre, contraseña) => {
  try {
    const response = await axios.post(URL, {
      nombre,
      contraseña
    });
    if (response.data.token) {
   
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
   
    throw error;
  }
};

export default {
  login
};
