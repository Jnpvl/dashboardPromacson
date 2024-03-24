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
      <template v-slot:md-table-row="{item}">
      <md-table-row :key="item.nombre">
        <md-table-cell md-label="Nombre">{{ item.nombre}}</md-table-cell>
        <md-table-cell md-label="Apellido">{{ item.apellido }}</md-table-cell>
        <md-table-cell md-label="Tipo de Usuario">{{ item.tipoUsuario }}</md-table-cell>
        <md-table-cell md-label="Estatus">{{ item.estatus }}</md-table-cell>
        <md-table-cell mb-label="Acciones">
          <md-button class="md-just-icon md-simple md-primary">
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="top">Edit</md-tooltip>
          </md-button>
          <md-button class="md-just-icon md-simple md-danger">
            <md-icon>close</md-icon>
            <md-tooltip md-direction="top">Close</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </template>
    </md-table>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {

  name: "user-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      searchTerm: '',

    };

  },
  computed:{
    ...mapState(["usuarios"]),
    filteredUsers() {
      let filtered = this.usuarios;
      if (this.searchTerm) {
        const lowerSearchTerm = this.searchTerm.toLowerCase();
        filtered = filtered.filter((user) => {
          return (
            user.nombre.toString().toLowerCase().includes(lowerSearchTerm) ||
            user.apellido.toLowerCase().includes(lowerSearchTerm) ||
            user.tipoUsuario.toLowerCase().includes(lowerSearchTerm) ||
            user.estatus.toLowerCase().includes(lowerSearchTerm) 
          );
        });
      }
      return filtered;
    }
  },
  methods:{
    ...mapActions(['fetchUsuarios']),
  },
  mounted(){
    this.fetchUsuarios();
  }
};
</script>