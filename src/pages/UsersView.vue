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
        <div v-if="errors.length">
          <p v-for="error in errors" :key="error" class="error">{{ error }}</p>
        </div>
        <md-field>
          <label>Nombre</label>
          <md-input v-model="nuevoUsuario.nombre"></md-input>
        </md-field>
        <md-field >
          <label>Apellido</label>
          <md-input v-model="nuevoUsuario.apellido" ></md-input>
        </md-field>
        <md-field>
          <label>Contraseña</label>
          <md-input v-model="nuevoUsuario.contraseña" ></md-input>
        </md-field>
        <md-field>
          <label>Tipo de usuario</label>
          <md-input v-model="nuevoUsuario.tipoUsuario" ></md-input>
        </md-field>
        <md-field>
          <label>Estatus</label>
          <md-input v-model="nuevoUsuario.estatus"></md-input>
        </md-field>

      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="validatedForm()">Guardar</md-button>
        <md-button @click="open = false">Cancelar</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { UserTable } from "@/components";
import { mapActions } from "vuex";

export default {
  components: {
    UserTable
  },
  data() {
    return {
      open: false,
      nuevoUsuario: {
        nombre: '',
        apellido: '',
        contraseña: '',
        tipoUsuario: '',
        estatus: ''
      },
      errors: []
    }
  },
  mounted() {
    this.cargarUsuarios();
  },
  methods: {
    ...mapActions(["fetchUsuarios","createUsuario"]),
    async cargarUsuarios() {
      await this.$store.dispatch('fetchUsuarios');
    },
    async guardarUsuario() {

      try {
        await this.$store.dispatch('createUsuario', this.nuevoUsuario);
        console.log('Pedido guardado');
        this.nuevoUsuario = { nombre: '', apellido: '' ,contraseña: '',tipoUsuario:'',estatus:''};
        this.open = false;
        this.errors = [];
      } catch (error) {
        console.error('Error al guardar el pedido:', error);
      }
    },

    validatedForm() {
      this.errors = [];

      if (!this.nuevoUsuario.nombre) {
        this.errors.push('El campo Cliente es requerido');
      }

      if (!this.nuevoUsuario.apellido) {
        this.errors.push('El campo apellido es requerido');
      }

      if (this.errors.length === 0) {
        this.guardarUsuario();
      }
    }
  },
};
</script>