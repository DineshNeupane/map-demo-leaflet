<template>
  <div class="hello">
    <MapView
        :points="points"
    >
    </MapView>
    <h1 v-for:
    <button v-on:click="getRainData">add point</button>
  </div>
</template>

<script>
import _ from 'lodash';
import MapView from './Map';


const stationsCollection = require('../model/stations').stationsCollection;
const readingsCollection = require('../model/stations').readingsCollection;

const points = [];

function getRainData() {
  Promise.all([stationsCollection(), readingsCollection()])
    .then((results) => {
      const stations = results[0];
      const readings = results[1];
      return readings.map((reading) => {
        const station = _.find(stations, o =>
          o.get('stationReference') === reading.get('measure.stationReference'));
        if (station) {
          const obj = {
            reference: station.reference(),
            location: [station.lat(), station.long()],
            scale: reading.get('value'),
          };
          points.push(obj);
          return obj;
        }
        return {};
      });
    });
}

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
    getRainData,
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
