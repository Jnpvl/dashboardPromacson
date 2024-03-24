<template>
  <div>
    <div class="search-row" style="display: flex; align-items: center; gap: 10px;">
      <div class="search-column" style="flex: 1;">
        <md-field>
          <label for="search">Buscar</label>
          <md-input id="search" v-model="searchTerm" />
        </md-field>
      </div>
      <div class="search-column">
        <md-field>
          <md-datepicker v-model="filterDate" type="date" id="searchDate"></md-datepicker>
        </md-field>
      </div>
    </div>
    <md-table :value="filteredOrders" :table-header-color="tableHeaderColor">
      <template v-slot:md-table-row="{ item }">
        <md-table-row :key="item.folio">
          <md-table-cell md-label="Folio">{{ item.folio }}</md-table-cell>
          <md-table-cell md-label="Cliente">{{ item.cliente }}</md-table-cell>
          <md-table-cell md-label="Estatus">{{ item.estatus }}</md-table-cell>
          <md-table-cell md-label="Facturado">{{ formatFecha(item.HoraF) }}</md-table-cell>
          <md-table-cell md-label="Cargado">{{ formatFecha(item.HoraC) }}</md-table-cell>
          <md-table-cell md-label="En Ruta">{{ formatFecha(item.HoraR) }}</md-table-cell>
          <md-table-cell md-label="Entregado">{{ formatFecha(item.HoraE) }}</md-table-cell>
          <md-table-cell md-label="Acciones">
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
  name: "order-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      searchTerm: '',
      filterDate: null,
    };
  },
  computed: {
    ...mapState(["pedidos"]),
    filteredOrders() {
      let filtered = this.pedidos;

      if (this.searchTerm) {
        const lowerSearchTerm = this.searchTerm.toLowerCase();
        filtered = filtered.filter((order) => {
          return (
            order.folio.toString().toLowerCase().includes(lowerSearchTerm) ||
            order.cliente.toLowerCase().includes(lowerSearchTerm) ||
            order.estatus.toLowerCase().includes(lowerSearchTerm)
          );
        });
      }

      if (this.filterDate) {
        const selectedDate = new Date(this.filterDate).setHours(0, 0, 0, 0);
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.HoraF).setHours(0, 0, 0, 0);
          return orderDate === selectedDate;
        });
      }

      return filtered;
    }
  },
  methods: {
    ...mapActions(["fetchPedidos"]),
    formatFecha(fecha) {
      if (!fecha) {
        return '';
      }
      const dateObj = new Date(fecha);
      const year = dateObj.getFullYear();
      const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
      const day = ('0' + dateObj.getDate()).slice(-2);
      const hours = ('0' + dateObj.getHours()).slice(-2);
      const minutes = ('0' + dateObj.getMinutes()).slice(-2);
      const seconds = ('0' + dateObj.getSeconds()).slice(-2);
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
  },
  mounted() {
    this.$material.locale = {
      ...this.$material.locale,
      firstDayOfAWeek: 1,
      days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      months: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      shortMonths: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ],
      shorterDays: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      cancel: 'Cancelar',
      ok: 'Aceptar'
    };

    this.fetchPedidos();
  },
}
</script>

<style>
.table-container {
  margin-top: 20px;
  background-color: red;
}
</style>
