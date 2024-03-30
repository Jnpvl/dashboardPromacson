<template>
  <div>
    <div class="search-row" style="display: flex; align-items: center; gap: 10px;">
      <div class="search-column" style="flex: 1;">
        <md-field>
          <label for="search">Buscar</label>
          <md-input id="search" v-model="searchTerm" />
        </md-field>
      </div>
    </div>
    <md-table :value="filteredUsers" :table-header-color="tableHeaderColor">
      <template v-slot:md-table-row="{ item }">
        <md-table-row :key="item.id">
          <md-table-cell md-label="Nombre">
            <div v-if="editUserId !== item.id">{{ item.nombre }}</div>
            <input v-else type="text" v-model="editData.nombre" class="md-input" />
          </md-table-cell>

          <md-table-cell md-label="Apellido">
            <div v-if="editUserId !== item.id">{{ item.apellido }}</div>
            <input v-else type="text" v-model="editData.apellido" class="md-input" />
          </md-table-cell>

          <md-table-cell md-label="Tipo de Usuario">
            <div v-if="editUserId !== item.id">{{ item.tipoUsuario }}</div>
            <select v-else v-model="editData.tipoUsuario" class="md-select" required>
              <option value="" disabled>Seleccione uno</option>
              <option v-for="tipo in tiposUsuario" :key="tipo" :value="tipo" :selected="editData.tipoUsuario === tipo">
                {{ tipo }}
              </option>
            </select>

          </md-table-cell>

          <md-table-cell md-label="Estatus">
            <div v-if="editUserId !== item.id">{{ item.estatus }}</div>
            <select v-else v-model="editData.estatus" class="md-select" required>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </md-table-cell>
          <md-table-cell md-label="Acciones">
            <md-button v-if="editUserId !== item.id" class="md-just-icon md-simple md-primary"
              @click="enableEdit(item)">
              <md-icon>edit</md-icon>
              <md-tooltip md-direction="top">Editar</md-tooltip>
            </md-button>
            <md-button v-else class="md-just-icon md-simple md-primary" @click="saveEdit(item.id)">
              <md-icon>save</md-icon>
              <md-tooltip md-direction="top">Guardar</md-tooltip>
            </md-button>
            <md-button class="md-just-icon md-simple md-danger" @click="openConfirmDialog(item.id)">
              <md-icon>close</md-icon>
              <md-tooltip md-direction="top">Eliminar</md-tooltip>
            </md-button>
            <md-button v-if="editUserId === item.id" class="md-just-icon md-simple md-primary"
              @click="enablePasswordChange(item)">
              <md-icon>lock</md-icon>
              <md-tooltip md-direction="top">Cambiar Contraseña</md-tooltip>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </template>
    </md-table>
    <md-dialog :md-active.sync="showConfirmDialog">
      <md-dialog-title>Confirmar eliminación</md-dialog-title>
      <md-dialog-content>¿Seguro que quieres eliminar este usuario?</md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="confirmDelete">Sí</md-button>
        <md-button @click="cancelDelete">No</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showPasswordDialog">
      <md-dialog-title>Cambiar Contraseña {{ editData.nombre }}</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label for="new-password">Nueva Contraseña</label>
          <md-input id="new-password" v-model="editData.contraseña" type="password" />
        </md-field>
        <span class="error" v-if="errors.contraseña">{{ errors.contraseña }}</span>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="changePassword">Cambiar</md-button>
        <md-button @click="closePasswordDialog">Cancelar</md-button>
      </md-dialog-actions>
    </md-dialog>
    <dialog-message :title="'Mensaje'" :message="dialogMessage" :show="showDialog"
      @close="showDialog = false"></dialog-message>
    <dialog-message :title="'Mensaje'" :message="dialogMessage" :show.sync="showDialog"></dialog-message>


  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DialogMessage from './DialogMessage.vue';


export default {
  name: "user-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  components: {
    DialogMessage
  },
  data() {
    return {
      searchTerm: '',
      showConfirmDialog: false,
      userIdToDelete: null,
      editUserId: null,
      editData: {},
      tiposUsuario: ['Administrador', 'Almacen', 'Oficina', 'Invitado'],
      showPasswordDialog: false,
      userIdToChangePassword: null,
      errors: {},
      dialogMessage: '',
      showDialog: false
    };
  },
  computed: {
    ...mapState(["usuarios"]),
    filteredUsers() {
      return this.usuarios.filter((user) => {
        const searchTermLower = this.searchTerm.toLowerCase();
        return (
          user.nombre.toLowerCase().includes(searchTermLower) ||
          user.apellido.toLowerCase().includes(searchTermLower) ||
          user.tipoUsuario.toLowerCase().includes(searchTermLower) ||
          user.estatus.toLowerCase().includes(searchTermLower)
        );
      });
    }
  },
  methods: {
    ...mapActions(['fetchUsuarios', 'deleteUsuario', 'updateUsuario']),
    openConfirmDialog(userId) {
      this.userIdToDelete = userId;
      this.showConfirmDialog = true;
    },
    confirmDelete() {
      this.deleteUsuario(this.userIdToDelete).then(() => {
        this.fetchUsuarios();
        this.dialogMessage = 'Usuario eliminado correctamente';
        this.showDialog = true;
      }).catch(error => {
        console.error('Error al eliminar usuario:', error);
      }).finally(() => {
        this.closeDialog();
      });
    },
    cancelDelete() {
      this.closeDialog();
    },
    closeDialog() {
      this.userIdToDelete = null;
      this.showConfirmDialog = false;
    },
    enableEdit(item) {
      this.editUserId = item.id;
      this.editData = { ...item };
    },
    enablePasswordChange(item) {
      this.userIdToChangePassword = item.id;
      this.editData.contraseña = '';
      this.showPasswordDialog = true;
    },
    async changePassword() {
      this.errors = {};

      if (!this.editData.contraseña) {
        this.errors.contraseña = 'La contraseña es requerida';
        return;
      } else if (this.editData.contraseña.length < 6) {
        this.errors.contraseña = 'La contraseña debe ser mayor a 6 dígitos';
        return;
      }

      try {
        await this.updateUsuario({
          id: this.userIdToChangePassword,
          usuario: {
            ...this.editData,
            contraseña: this.editData.contraseña
          }
        });
        this.showPasswordDialog = false;

        this.fetchUsuarios();
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
      }
    },

    async saveEdit(id) {
      try {
        await this.updateUsuario({ id, usuario: this.editData });
        this.editUserId = null;
        this.userIdToChangePassword = null;
        this.dialogMessage = 'Usuario editado correctamente';
        this.showDialog = true;
        this.fetchUsuarios();
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
      }
    },

    closePasswordDialog() {
      this.showPasswordDialog = false;
    }
  },
  mounted() {
    this.fetchUsuarios();
  }
};
</script>

<style>
.md-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
}

.md-input:focus {
  border-color: #3f51b5;
}
</style>
