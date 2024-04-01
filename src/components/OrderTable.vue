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

          <md-table-cell md-label="Cliente">
            <div v-if="editOrderFolio !== item.folio"> {{ item.cliente }} </div>
            <input v-else type="text" v-model="editData.cliente" class="md-input" />
          </md-table-cell>


          <md-table-cell md-label="Estatus">
            <div v-if="editOrderFolio !== item.folio">{{ item.estatus }}</div>
            <select v-else v-model="editData.estatus" class="md-select" required>
              <option value="" disabled>Seleccione uno</option>
              <option v-for="estatus in estatus" :key="estatus" :value="estatus"
                :selected="editData.estatus === estatus">
                {{ estatus }}
              </option>
            </select>
          </md-table-cell>
          <md-table-cell md-label="Facturado">{{ formatFecha(item.HoraF) }}</md-table-cell>
          <md-table-cell md-label="Cargado">{{ formatFecha(item.HoraC) }}</md-table-cell>
          <md-table-cell md-label="En Ruta">{{ formatFecha(item.HoraR) }}</md-table-cell>
          <md-table-cell md-label="Entregado">{{ formatFecha(item.HoraE) }}</md-table-cell>

          <md-table-cell md-label="Acciones">
            <md-button v-if="editOrderFolio !== item.folio" class="md-just-icon md-simple md-primary"
              @click="enableEdit(item)">
              <md-icon>edit</md-icon>
              <md-tooltip md-direction="top">Editar</md-tooltip>
            </md-button>
            <md-button v-else class="md-just-icon md-simple md-primary" @click="saveEdit(item.folio)">
              <md-icon>save</md-icon>
              <md-tooltip md-direction="top">Guardar</md-tooltip>
            </md-button>
            <md-button class="md-just-icon md-simple md-danger" @click="openConfirmDialog(item.folio)">
              <md-icon>close</md-icon>
              <md-tooltip md-direction="top">Eliminar</md-tooltip>
            </md-button>
            <md-button class="md-just-icon md-simple md-primary" @click="viewOrderDetails(item.folio)">
              <md-icon>visibility</md-icon>
              <md-tooltip md-direction="top">Detalle</md-tooltip>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </template>
    </md-table>
    <md-dialog :md-active.sync="showConfirmDialog">
      <md-dialog-title>Confirmar eliminación</md-dialog-title>
      <md-dialog-content>¿Seguro que quieres eliminar este pedido? </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="confirmDelete">Sí</md-button>
        <md-button @click="cancelDelete">No</md-button>
      </md-dialog-actions>
    </md-dialog>
    <dialog-message :title="dialogTitle" :message="dialogMessage" :show.sync="showDialog"></dialog-message>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DialogMessage from './DialogMessage.vue';

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
      editOrderFolio: null,
      editData: {},
      estatus: ['Facturado', 'Cargado', 'En ruta', 'Entregado'],
      deleteOrderId: null,
      dialogMessage: '',
      dialogTitle: '',
      showDialog: false,
      showConfirmDialog: false,

    };
  },
  components: {
    DialogMessage
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
    },

  },
  methods: {
    ...mapActions(['fetchPedidos', 'deletePedido', 'updatePedido']),
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
    },
    openConfirmDialog(orderFolio) {
      this.deleteOrderId = orderFolio;
      this.showConfirmDialog = true;
    },
    confirmDelete() {
      this.deletePedido(this.deleteOrderId).then(() => {
        this.fetchPedidos();
        this.dialogTitle = "Eliminar"
        this.dialogMessage = 'Pedido eliminado correctamente';
        this.showDialog = true;
      }).catch(error => {
        console.error('Error al eliminar pedido:', error);
      }).finally(() => {
        this.closeDialog();
      });
    },
    cancelDelete() {
      this.closeDialog();
    },
    closeDialog() {
      this.deleteOrderId = null;
      this.showConfirmDialog = false;
    },
    enableEdit(item) {
      this.editOrderFolio = item.folio;
      this.editData = { ...item };
    },
    async saveEdit(folio) {
      try {
        await this.updatePedido({ folio, pedido: this.editData });
        this.dialogTitle = 'Actualizado';
        this.dialogMessage = 'Pedido editado correctamente';
        this.showDialog = true;
        await this.fetchPedidos();
      } catch (error) {
        console.error('Error al actualizar pedido:', error);
      } finally {
        this.editOrderFolio = null;
        this.closeDialog();
      }
    },
    viewOrderDetails(folio) {
      this.$router.push({ name: 'Detalles del pedido', params: { folio, } });
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
