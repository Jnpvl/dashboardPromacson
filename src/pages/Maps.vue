<template>
  <div id="map"></div>
</template>

<script>
export default {
  props: {
    coordenadas: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps API no está disponible.");
        return;
      }
      this.mostrarRuta();
    },
    mostrarRuta() {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: new google.maps.LatLng(this.coordenadas[0].latitud, this.coordenadas[0].longitud),
      });

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      const waypoints = this.coordenadas.slice(1, this.coordenadas.length - 1).map(coord => ({
        location: new google.maps.LatLng(coord.latitud, coord.longitud),
        stopover: true,
      }));

      const origin = this.coordenadas[0];
      const destination = this.coordenadas[this.coordenadas.length - 1];

      directionsService.route({
        origin: new google.maps.LatLng(origin.latitud, origin.longitud),
        destination: new google.maps.LatLng(destination.latitud, destination.longitud),
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(response);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      });
    },
  },
};
</script>

<style scoped>
#map {
  height: 50vh;
  width: 100%;
}
</style>
