<template>
  <div class="hello">
    <MapView
        :points="points"
    >
    </MapView>
    <h1 v-for:
    <button v-on:click="addPoint">add point</button>
  </div>
</template>

<script>
import MapView from './Map';


const stationsCollection = require('../model/stations').stationsCollection;
const readingsCollection = require('../model/stations').readingsCollection;

const points = [];

Promise.all([stationsCollection(), readingsCollection()])
  .then((results) => {
    const stations = results[0];
    const readings = results[1];
    return readings.map((reading) => {
      for (let i = 0; i < stations.length; i += 1) {
        const station = stations[i];
        if (reading.get('measure.stationReference') ===
                 station.get('stationReference')) {
          return { station, reading };
        }
      }
      return {};
    });
  })
  .then((stationItems) => {
    stationItems.map((item) => {
      const obj = {
        reference: item.station.reference(),
        location: [item.station.lat(), item.station.long()],
        scale: item.reading.get('value'),
      };
      points.push(obj);
      return obj;
    });
  });

export default {
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      points,
    };
  },
  components: {
    MapView,
  },
  methods: {
    addPoint: function addPoint() {
      for (let i = 0; i < 10; i += 1) {
        points.push({
          location: [51.0 + Math.random(), -2.5 + Math.random()],
          scale: Math.random() * 0.5,
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
