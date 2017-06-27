<template>
  <div id="mapid"></div>
</template>

<script>

const L = require('leaflet');
require('../../dist/HeatLayer.js');

const vueSlider = require('./VueSlider');
const _ = require('lodash');

let mapRef = {};
let rainLayer;
let floodLayer;

function addPoint(layer, location, height, options) {
  const params = _.extend({}, options);
  if (height > 0) {
    const startPoint = location;
    const endPoint = [location[0] + (Math.log(height + 1, 2) * 0.5), location[1]];
    L.polyline([
      startPoint,
      endPoint,
    ], params).addTo(layer);
  }
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
    mapRef = L.map('mapid').setView(new L.LatLng(52, -2), 7);

    const osmUrl = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = "Map data © <a href='//openstreetmap.org'>OpenStreetMap</a> contributors";
    const osm = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 12, attribution: osmAttrib });

    // start the map in South-East England
    mapRef.addLayer(osm);
    rainLayer = new L.LayerGroup().addTo(mapRef);
    floodLayer = new L.LayerGroup().addTo(mapRef);
  },
  methods: {
    pointsUpdate(newData) {
      const tempRainLayer = new L.LayerGroup();
      let tempFloodLayer = new L.LayerGroup();
      if (newData.rainData) {
        newData.rainData.data.map((point) => {
          const pointlocation = [point.lat, point.long];
          addPoint(tempRainLayer, pointlocation, parseFloat(point.value), newData.rainData.options);
          return 0;
        });
      }
      if (newData.levelData) {
        const heatvals = newData.levelData.data.map((point) => {
          const pointlocation = [point.lat, point.long, parseFloat(point.percentage)];
          return pointlocation;
        });
        tempFloodLayer = L.heatLayer(heatvals, { radius: 20, blur: 25 });
      }
      tempRainLayer.addTo(mapRef);
      tempFloodLayer.addTo(mapRef);
      rainLayer.remove();
      floodLayer.remove();
      floodLayer = tempRainLayer;
      rainLayer = tempFloodLayer;
    },
  },
};

</script>

<style scoped>
#mapid {
  height: 80vh;
}

#divider {
  height: 30px;
}

</style>
