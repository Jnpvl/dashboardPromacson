<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <div class="contenedor">
              <h4 class="title">Pedidos</h4>
              <md-button class="md-primary md-raised" @click="open = true">Nuevo Pedido</md-button>

            </div>
            <p class="category">Pedidos realizados</p>
          </md-card-header>
          <md-card-content>
            <order-table table-header-color="green"></order-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <md-dialog :md-active.sync="open" class="modal-dialog">
      <md-dialog-title>Nuevo Pedido</md-dialog-title>
      <md-dialog-content>
        <div v-if="errors.length">
          <p v-for="error in errors" :key="error" class="error">{{ error }}</p>
        </div>
        <md-field>
          <label>Folio</label>
          <md-input v-model="nuevoPedido.folio"></md-input>
        </md-field>
        <md-field>
          <label>Cliente</label>
          <md-input v-model="nuevoPedido.cliente"></md-input>
        </md-field>

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
import { OrderTable } from "@/components";
import { mapActions } from "vuex";
import DialogMessage from '../components/DialogMessage.vue';

export default {
  components: {
    OrderTable,
    DialogMessage
  },
  data() {
    return {
      open: false,
      nuevoPedido: {
        folio: '',
        cliente: ''
      },
      errors: [],
      dialogMessage: '',
      dialogTitle: '',
      showDialog: false
    }
  },
  mounted() {
    this.cargarPedidos();
  },
  methods: {
    ...mapActions(["createPedido", "fetchPedidos"]),

    async cargarPedidos() {
      await this.$store.dispatch('fetchPedidos');
    },

    async guardarPedido() {
      const pedidosExistentes = this.$store.state.pedidos;
      const folioExiste = pedidosExistentes.some(pedido => pedido.folio === this.nuevoPedido.folio);

      if (folioExiste) {
        this.errors.push('El folio ya existe');
        return;
      }

      try {
        await this.$store.dispatch('createPedido', this.nuevoPedido);
        console.log('Pedido guardado');
        this.nuevoPedido = { folio: '', cliente: '' };
        this.open = false;
        this.errors = [];
        this.dialogTitle = "Nuevo Pedido"
        this.dialogMessage = 'Pedido creado correctamente';
        this.showDialog = true;
      } catch (error) {
        console.error('Error al guardar el pedido:', error);
      }
    },
    validatedForm() {
      this.errors = [];

      if (!this.nuevoPedido.cliente) {
        this.errors.push('El campo Cliente es requerido');
      }

      if (!this.nuevoPedido.folio) {
        this.errors.push('El campo Folio es requerido');
      }

      if (this.errors.length === 0) {
        this.guardarPedido();
      }
    }
  }
};
</script>

<style>
.contenedor {
  display: flex;
  justify-content: space-between;
}

.form-button {
  background-color: rgb(105, 20, 101);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.modalCreacion {
  background-color: red;
  height: 50%;
  width: 100%;
}

.error {
  color: red;
}


.form-select {
  display: block;
  width: 100%;
  padding: .375rem 1.75rem .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
</style>