<template>
  <div class="login-container">
    <main class="form-login">
      <div >
        <h1 class="login-title">Inicio de sesión</h1>

        <div class="form-group">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder=" "
            v-model="nombre"
          />
          <label for="floatingInput">Nombre</label>
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder=" "
            v-model="contraseña"
          />
          <label for="floatingPassword">Contraseña</label>
        </div>

        <button class="form-button" @click="ingresar()">
          Ingresa
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import authService from '@/services/authService'; 

export default {
  data() {
    return {
      nombre: '',
      contraseña: ''
    };
  },
  methods: {
    async ingresar() {
      try {
        const response = await authService.login(this.nombre, this.contraseña);
        this.$router.push({ name: 'Dashboard' }); 
      } catch (error) {
        console.error(error);
        alert('Inicio de sesión fallido. Verifica tus credenciales.');
      }
    }
  }
};
</script>



<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f5f7;
}


.form-login {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  background: white; 
  border-radius: 10px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  margin: auto;
}

.login-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
  position: relative;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd; 
  border-radius: 5px;
}

.form-group label {
  position: absolute;
  top: -7px;
  left: 10px;
  background: white;
  padding: 0 5px;
  font-size: 14px;
  color: #666; 
}

.form-button {
  width: 100%;
  background-color: #4caf50; 
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.form-button:hover {
  background-color: #43a047; 
}
</style>../services/authService
