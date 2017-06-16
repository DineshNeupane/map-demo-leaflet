<template>
  <div>
    <div id="mapid"></div>
  </div>
</template>

<script>

const L = require('leaflet');

let mapRef = {};

function addPoint(location, height) {
  const startPoint = location;
  const endPoint = [location[0] + height, location[1]];
  L.polygon([
    startPoint,
    endPoint,
  ]).addTo(mapRef);
}

module.exports = {
  name: 'MapView',
  props: ['points'],
  computed: {
    dataPoints: function points() {
      return this.points;
    },
  },
  mounted() {
    mapRef = L.map('mapid').setView(new L.LatLng(51, -2), 8);

    const osmUrl = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = "Map data © <a href='//openstreetmap.org'>OpenStreetMap</a> contributors";
    const osm = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 12, attribution: osmAttrib });

    // start the map in South-East England
    mapRef.addLayer(osm);
    this.dataPoints.map((point) => {
      addPoint(point.location, point.scale);
      return 0;
    });
  },
  watch: {
    points: function pointUpdate(newpoints) {
      newpoints.map((point) => {
        addPoint(point.location, point.scale);
        return 0;
      });
    },
  },
};
</script>

<style scoped>
div {
  height: 580px;
}
</style>
