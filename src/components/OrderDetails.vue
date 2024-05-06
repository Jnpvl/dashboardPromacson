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
            <div class="mapa" v-if="coordenadasPedidoActual && coordenadasPedidoActual.coordenadas">
              <l-map :zoom="16" :center="mapCenter" style="height: 400px;">
                <l-tile-layer :url="mapUrl" :attribution="mapAttribution"></l-tile-layer>
                <l-polyline :lat-lngs="rutaCoordenadas" color="blue"></l-polyline>
              </l-map>
            </div>
            <div class="info-pedido">
              <div class="campo-info">
                <span class="etiqueta">Cliente:</span>
                <span class="valor">{{ pedidoActual.cliente }}</span>
              </div>
              <div class="campo-info">
                <span class="etiqueta">Estado:</span>
                <span class="valor">{{ pedidoActual.estatus }}</span>
              </div>
              <div class="campo-info">
                <span class="etiqueta">Hora de Facturacion:</span>
                <span class="valor">{{ formatFecha(pedidoActual.HoraF )}}</span>
              </div>
              <div class="campo-info">
                <span class="etiqueta">Hora de Carga:</span>
                <span class="valor">{{ formatFecha(pedidoActual.HoraC) }}</span>
              </div>
              <div class="campo-info">
                <span class="etiqueta">Hora de Ruta:</span>
                <span class="valor">{{ formatFecha(pedidoActual.HoraR) }}</span>
              </div>
              <div class="campo-info">
                <span class="etiqueta">Hora de Entrega:</span>
                <span class="valor">{{ formatFecha(pedidoActual.HoraE) }}</span>
              </div>
              <!--  
              <div v-for="(coordenada, index) in coordenadasPedidoActual.coordenadas" :key="index" class="campo-info">
                <span class="etiqueta">Coordenada {{ index + 1 }}:</span>
                <span class="valor">Latitud: {{ coordenada.latitud }}, Longitud: {{ coordenada.longitud }}</span>
              </div>
              -->
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
import { LMap, LTileLayer, LPolyline } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  data() {
    return {
      orderFolio: this.$route.params.folio,
      mapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      mapAttribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    };
  },
  components: {
    LMap, LTileLayer, LPolyline
  },
  computed: {
    ...mapState(['pedidoActual', 'coordenadasPedidoActual']),
    mapCenter() {
      if (this.coordenadasPedidoActual && this.coordenadasPedidoActual.coordenadas.length > 0) {
        return [this.coordenadasPedidoActual.coordenadas[0].latitud, this.coordenadasPedidoActual.coordenadas[0].longitud];
      }
      return [0, 0];
    },
    rutaCoordenadas() {
      const ruta = this.coordenadasPedidoActual.coordenadas.map(c => [c.latitud, c.longitud]);
      console.log(ruta);
      return ruta;
    }

  },
  methods: {
    ...mapActions(['fetchDetallePedido', 'fetchCoordenadasPedido']),
    regresar() {
      this.$router.back();
    },
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
  },
  mounted() {
    this.fetchDetallePedido(this.orderFolio).then(() => {
      this.fetchCoordenadasPedido(this.orderFolio);
    });
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
  background-color: yellow;
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
  align-items: center;
  margin: 5px 0;
}

.etiqueta {
  font-weight: 600;
  margin-right: 8px;
}

.valor {
  font-weight: 400;
}
</style>
