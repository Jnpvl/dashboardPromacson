import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users';

const getUsuarios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.usuarios; 
  } catch (error) {
    throw error;
  }
};

const crearUsuario = async (usuario) =>{
  try{
    const response = await axios.post(API_URL,usuario);
    return response.data;
  } catch(error){
    throw error;
  }
}

export default {
  getUsuarios,
  crearUsuario
};
