<template>
  <div id="mapid"></div>
</template>

<script>

const L = require('leaflet');
require('../../dist/HeatLayer.js');

const _ = require('lodash');

let mapRef = {};
let rainLayer;
let floodLayer;

function mapGraph(data) {
  const zoom = mapRef.getZoom();
  const scale = 10 / zoom;
  const params = _.extend({}, data.options);
  if (data) {
    const features = data.data.map((point) => {
      const locations = [
        [point.lat, point.long],
        [point.lat + (point.value * scale), point.long],
      ];
      return L.polyline(locations, params);
    });
    return L.featureGroup(features);
  }
  return new L.LayerGroup();
}

function heatMap(data) {
  const params = _.extend({}, data.options);
  if (data) {
    const pointlocation = data.data.map(point =>
      ([point.lat, point.long, parseFloat(point.percentage)]));
    return L.heatLayer(pointlocation, params);
  }
  return new L.LayerGroup();
}

module.exports = {
  name: 'MapView',
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
      const tempRainLayer = mapGraph(newData.rainData);
      const tempFloodLayer = heatMap(newData.levelData);
      tempRainLayer.addTo(mapRef);
      tempFloodLayer.addTo(mapRef);
      rainLayer.remove();
      floodLayer.remove();
      floodLayer = tempRainLayer;
      rainLayer = tempFloodLayer;
    },
    clear(dataTypes) {
      if (dataTypes.rainData) {
        rainLayer.remove();
      }
      if (dataTypes.levelData) {
        floodLayer.remove();
      }
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
