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
let tideLayer;

function mapGraph(data) {
  const zoom = mapRef.getZoom();
  const scale = 10 / zoom;
  const marker = _.extend({ radius: 3 }, data.options.marker);
  const params = _.extend({}, data.options);
  if (data) {
    const locationPoints = data.data.map(point =>
      L.circleMarker([point.lat, point.long], marker));
    const features = data.data.map((point) => {
      const locations = [
        [point.lat, point.long],
        [point.lat + (point.value * scale), point.long],
      ];
      return L.polyline(locations, params);
    });
    return L.featureGroup(features.concat(locationPoints));
  }
  return new L.LayerGroup();
}

function heatMap(data) {
  const params = _.extend({}, data.options);
  if (data) {
    const pointlocation = data.data.map(point =>
      ([point.lat, point.long, parseFloat(point.value)]));
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
    tideLayer = new L.LayerGroup().addTo(mapRef);
  },
  methods: {
    pointsUpdate(newData) {
      const tempRainLayer = mapGraph(newData.rainData);
      const tempFloodLayer = heatMap(newData.levelData);
      const tempTideLayer = mapGraph(newData.tideData);
      tempRainLayer.addTo(mapRef);
      tempFloodLayer.addTo(mapRef);
      tempTideLayer.addTo(mapRef);
      rainLayer.remove();
      floodLayer.remove();
      tideLayer.remove();
      floodLayer = tempRainLayer;
      rainLayer = tempFloodLayer;
      tideLayer = tempTideLayer;
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
