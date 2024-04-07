<template>
  <div class="content" v-if="pedidoActual && pedidoActual.folio">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <div class="contenedor-menu">
              <div class="menu-items">
                <h4 class="title">Detalles del pedido {{ orderFolio }}</h4>
              </div>
              <div class="cliente-estatus">
                <h4>{{ pedidoActual.cliente }}</h4>
                <p>Estatus: {{ pedidoActual.estatus }}</p>
              </div>
            </div>
            <button @click="regresar" class="boton-regresar">Regresar</button>

          </md-card-header>

          <md-card-content class="contenedor">
            <div class="mapa">
              <Maps />
            </div>
            <div class="info-pedido">
              <div class="campo-info">
                <span class="etiqueta">Cliente:</span>
                <span class="valor">{{ pedidoActual.cliente }}</span>
              </div>
              <div class="campo-info">
                <span class="etiqueta">cliente-estatus:</span>
                <span class="valor">{{ pedidoActual.estatus }}</span>
              </div>
              <div class="campo-info">
                <span class="etiqueta">Hora de Facturacion:</span>
                <span class="valor">{{ pedidoActual.HoraF }}</span>
              </div>
              <div class="campo-info">
                <span class="etiqueta">Hora de Carga:</span>
                <span class="valor">{{ pedidoActual.HoraC }}</span>
              </div>
              <div class="campo-info">
                <span class="etiqueta">Hora de Ruta:</span>
                <span class="valor">{{ pedidoActual.HoraR }}</span>
              </div>
              <div class="campo-info">
                <span class="etiqueta">Hora de Entrega:</span>
                <span class="valor">{{ pedidoActual.HoraE }}</span>
              </div>


            </div>
          </md-card-content>
        </md-card>

      </div>
    </div>
  </div>
  <div v-else>
    <p>Cargando detalles del pedido o pedido no encontrado...</p>
  </div>


</template>

<script>
import { mapState, mapActions } from 'vuex';
import Maps from '../pages/Maps.vue'

export default {
  data() {
    return {
      orderFolio: this.$route.params.folio,
    };
  },
  computed: {
    ...mapState(['pedidoActual'])
  },
  methods: {
    ...mapActions(['fetchDetallePedido']),
    regresar() {
      this.$router.back();
    }
  },
  mounted() {
    this.fetchDetallePedido(this.orderFolio);
  },
  components: {
    Maps
  }
};
</script>


<style scoped>
.contenedor-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.menu-items {
  display: flex;
  align-items: center;
}

.boton-regresar {
  border: 1px solid;
  border-color: #9c27b0;
  height: 30px;
  cursor: pointer;
  font-size: 20px;
  color: #FFF;
  margin-right: 20px;
  background-color: #9c27b0;
  font-weight: 400;
}

.mapa {
  background-color: red;
  flex-basis: 50%;
}

.contenedor {
  display: flex;
  justify-content: space-between;
}

.info-pedido {
  flex-basis: 50%;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  flex-basis: 50%;
  display: flex;
  justify-content: center;
}

.info {
  font-size: 20px;
  margin: 10px;
  font-weight: 800;
}

.campo-info {
  display: flex;
  /* Utiliza flexbox para posicionar los span uno al lado del otro */
  align-items: center;
  /* Alinea los items verticalmente */
  margin: 5px 0;
  /* Ajusta el margen según lo necesites */
}

.etiqueta {
  font-weight: 600;
  /* Más peso para la etiqueta */
  margin-right: 8px;
  /* Espacio entre la etiqueta y el valor */
  /* Otros estilos que quieras para las etiquetas */
}

.valor {
  font-weight: 400;
  /* Menos peso para el valor */
  /* Otros estilos que quieras para los valores */
}
</style>
