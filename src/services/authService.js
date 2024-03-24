

import axios from 'axios';

const API_URL = 'http://localhost:3001/api/login';

const login = async (nombre, contraseña) => {
  try {
    const response = await axios.post(API_URL, {
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
