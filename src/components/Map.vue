<template>
  <div id="mapid"></div>
</template>

<script>

const L = require('leaflet');
const vueSlider = require('./VueSlider');
const _ = require('lodash');

let mapRef = {};
let rainLayer;
let floodLayer;

function addPoint(layer, location, height, options) {
  const params = _.extend({ weight: 4 }, options);
  if (height > 0) {
    const startPoint = location;
    const endPoint = [location[0] + (height * params.custScale), location[1]];
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
    mapRef = L.map('mapid').setView(new L.LatLng(51, -2), 8);

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
      let tempLayer = new L.LayerGroup();
      if (newData.rainData) {
        newData.rainData.data.map((point) => {
          const pointlocation = [point.lat, point.long];
          addPoint(tempLayer, pointlocation, parseFloat(point.value), newData.rainData.options);
          return 0;
        });
      }
      tempLayer.addTo(mapRef);
      rainLayer.remove();
      rainLayer = tempLayer;
      tempLayer = new L.LayerGroup();
      if (newData.levelData) {
        newData.levelData.data.map((point) => {
          const pointlocation = [point.lat, point.long];
          addPoint(tempLayer, pointlocation,
            parseFloat(point.percentage), newData.levelData.options);
          return 0;
        });
      }
      tempLayer.addTo(mapRef);
      floodLayer.remove();
      floodLayer = tempLayer;
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
