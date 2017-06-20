<template>
  <div class="hello">
    <MapView
        :points="points"
       ref="map"
    >
    </MapView>
    <input type="date" v-model="date" min="2017-06-14" max="2017-06-20">
    <button v-on:click="checkdate">get points</button>
    <button v-on:click="pointsClear">clear points</button>
  </div>
</template>

<script>
import _ from 'lodash';
import MapView from './Map';

const moment = require('moment');


const stationsCollection = require('../model/stations').stationsCollection;
const readingsCollection = require('../model/stations').readingsCollection;

let points = [];

function getRainData(date) {
  return Promise.all([stationsCollection(), readingsCollection(date)])
    .then((results) => {
      console.log(results);
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
getRainData(moment().format('YYYY-MM-DD'));

export default {
  name: 'hello',
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      msg: 'Welcome to Your Vue.js App',
      points,
    };
  },
  components: {
    MapView,
  },
  methods: {
    getRainData,
    checkdate: function checkdate() {
      this.$refs.map.pointsClear();
      getRainData(this.date).then(this.$refs.map.pointsUpdate);
    },
    pointsClear: function pointsClear() {
      points = [];
      this.$refs.map.pointsClear();
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
