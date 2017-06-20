<template>
  <div id="mapid"></div>
</template>

<script>

const L = require('leaflet');
const vueSlider = require('./VueSlider');

let mapRef = {};
let graphLayer;

function addPoint(layer, location, height) {
  const startPoint = location;
  const endPoint = [location[0] + height, location[1]];
  L.polygon([
    startPoint,
    endPoint,
  ]).addTo(layer);
}

module.exports = {
  name: 'MapView',
  components: {
    vueSlider,
  },
  data() {
    return {
      value: 1,
    };
  },
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
    graphLayer = new L.LayerGroup().addTo(mapRef);
    this.dataPoints.map((point) => {
      addPoint(graphLayer, point.location, point.scale);
      return 0;
    });
  },
  watch: {
    points(newpoints) {
      this.dataPoints = newpoints;
      graphLayer.remove();
      graphLayer = new L.LayerGroup().addTo(mapRef);
      newpoints.map((point) => {
        addPoint(graphLayer, point.location, point.scale);
        return 0;
      });
    },

  },
  methods: {
    pointsClear() {
      console.log('called');
      graphLayer.remove();
      this.dataPoints = [];
    },
    pointsUpdate(newpoints) {
      console.log(newpoints);
      this.dataPoints = newpoints;
      graphLayer.remove();
      graphLayer = new L.LayerGroup().addTo(mapRef);
      newpoints.map((point) => {
        addPoint(graphLayer, point.location, point.scale);
        return 0;
      });
    },
  },
};

</script>

<style scoped>
#mapid {
  height: 90vh;
}

#divider {
  height: 30px;
}

</style>
