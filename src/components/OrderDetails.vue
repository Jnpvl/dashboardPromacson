<template>
  <div>
    <div v-if="pedidoActual && pedidoActual.folio">
      <h1>Detalles del Pedido por página {{ orderFolio }}</h1>
      <h1>Detalles del Pedido {{ pedidoActual.folio }}</h1>
      <p>Cliente: {{ pedidoActual.cliente }}</p>
      <p>Estatus: {{ pedidoActual.estatus }}</p>
      <p>Facturado: {{ pedidoActual.HoraF }}</p>
      <p>Cargado: {{ pedidoActual.HoraC }}</p>
      <p>En Ruta: {{ pedidoActual.HoraR }}</p>
      <p>Entregado: {{ pedidoActual.HoraE }}</p>
    </div>
    <div v-else>
      <p>Cargando detalles del pedido o pedido no encontrado...</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

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
  },
  mounted() {
    this.fetchDetallePedido(this.orderFolio);
  },
};
</script>
