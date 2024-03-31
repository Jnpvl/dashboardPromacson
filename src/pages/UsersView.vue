<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <div class="contenedor">
              <h4 class="title">Usuarios</h4>
              <md-button class="md-primary md-raised" @click="open = true">Nuevo Usuario</md-button>
            </div>
            <p class="category">usuarios registrados</p>
          </md-card-header>
          <md-card-content>
            <user-table table-header-color="green"></user-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <md-dialog :md-active.sync="open" class="modal-dialog">
      <md-dialog-title>Nuevo Usuario</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>Nombre</label>
          <md-input v-model="nuevoUsuario.nombre"></md-input>
        </md-field>
        <span class="error" v-if="errors.nombre">{{ errors.nombre }}</span>
        <md-field>
          <label>Apellido</label>
          <md-input v-model="nuevoUsuario.apellido"></md-input>
        </md-field>
        <span class="error" v-if="errors.apellido">{{ errors.apellido }}</span>
        <md-field>
          <label>Contraseña</label>
          <md-input type="password" v-model="nuevoUsuario.contraseña"></md-input>
        </md-field>
        <span class="error" v-if="errors.contraseña">{{ errors.contraseña }}</span>
        <md-field >
          <label for="tipo-select">Tipo de usuario</label>
          <select v-model="nuevoUsuario.tipoUsuario" class="md-select" id="tipo-select">
            <option value="" disabled>Seleccione uno</option>
            <option value="Administrador">Administrador</option>
            <option value="Almacen">Almacen</option>
            <option value="Oficina">Oficina</option>
            <option value="Invitado">Invitado</option>
          </select>
        </md-field>
        <span class="error" v-if="errors.tipoUsuario">{{ errors.tipoUsuario }}</span>

        <md-field >
          <label for="estatus-select">Estatus</label>
          <select v-model="nuevoUsuario.estatus" id="estatus-select" class="md-select" required>
            <option value="" disabled>Seleccione uno</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </md-field>
        <span class="error" v-if="errors.estatus">{{ errors.estatus }}</span>

      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="validatedForm()">Guardar</md-button>
        <md-button @click="open = false">Cancelar</md-button>
      </md-dialog-actions>
    </md-dialog>
    <dialog-message :title="dialogTitle" :message="dialogMessage" :show.sync="showDialog"></dialog-message>
  </div>

</template>

<script>
import { UserTable } from "@/components";
import { mapActions } from "vuex";
import DialogMessage from '../components/DialogMessage.vue';

export default {
  components: {
    UserTable,
    DialogMessage
  },
  data() {
    return {
      open: false,
      nuevoUsuario: {
        nombre: '',
        apellido: '',
        contraseña: '',
        tipoUsuario: null,
        estatus: null
      },
      errors: {},
      dialogMessage: '',
      dialogTitle:'',
      showDialog: false
    }
  },
  mounted() {
    this.cargarUsuarios();
  },
  methods: {
    ...mapActions(["fetchUsuarios", "createUsuario"]),
    async cargarUsuarios() {
      await this.$store.dispatch('fetchUsuarios');
    },
    async guardarUsuario() {
      try {
        await this.$store.dispatch('createUsuario', this.nuevoUsuario);
        console.log('Usuario guardado');

        this.resetNuevoUsuario();
        this.open = false;
        this.dialogTitle = "Nuevo usuario"
        this.dialogMessage = 'Usuario creado correctamente';
        this.showDialog = true;
      } catch (error) {
        console.error('Error al guardar el usuario:', error);
      }
    },
    resetNuevoUsuario() {
      this.nuevoUsuario = { nombre: '', apellido: '', contraseña: '', tipoUsuario: '', estatus: '' };
      this.errors = {};
    },
    validatedForm() {
      this.errors = [];

      if (!this.nuevoUsuario.nombre) {
        this.errors.nombre = 'El nombre es requerido';
      }

      if (!this.nuevoUsuario.apellido) {
        this.errors.apellido = 'El apellido es requerido';
      }

      if (!this.nuevoUsuario.contraseña) {
        this.errors.contraseña = 'La contraseña es requerida';
      } else if (this.nuevoUsuario.contraseña.length < 6) {
        this.errors.contraseña = 'La contraseña debe ser mayor a 6 digitos';
      }
      if (!this.nuevoUsuario.tipoUsuario) {
        this.errors.tipoUsuario = 'El tipo de usuario es requerido';
      }
      if (!this.nuevoUsuario.estatus) {
        this.errors.estatus = 'El estatus es requerido';
      }

      if (Object.keys(this.errors).length === 0) {
        this.guardarUsuario();
      }
    }
  },
};
</script>

<style>
.md-select {
  width: 100%;
  padding: 14px 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 18px;
  margin: 10px 0;
  transition: border-color .2s;
  display: block;
}

.md-select:focus {
  outline: none;
  border-color: #3f51b5;
}

.md-select option {
  padding: 10px;
}

.md-select-field {
  position: relative;
  margin-top: 50px;
}

.md-select-field label {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.54);
  transition: all 0.2s ease;
}

.md-select-field .md-select {
  padding: 8px 0;
  border-bottom: 1px solid rgba(115, 23, 23, 0.12);
  background-color: transparent;
  font-size: 18px;
  height: 36px;
}

.md-select-field .md-select:focus~label,
.md-select-field .md-select:not(:placeholder-shown)~label {
  top: -24px;
  font-size: 14px;
  color: #3f51b5;
}

.md-select-field .md-field-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #3f51b5;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.md-select-field .md-select:focus~.md-field-bar {
  transform: scaleX(1);
}

</style>
