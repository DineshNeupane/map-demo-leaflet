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
import MapView from './Map';

const moment = require('moment');


const getPoints = require('../model/stations').getPoints;


let points = [];

getPoints(moment().format('YYYY-MM-DD')).then((newPoints) => {
  points = newPoints;
});

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
    checkdate: function checkdate() {
      this.$refs.map.pointsClear();
      getPoints(this.date).then((newpoints) => {
        points = newpoints;
        this.$refs.map.pointsUpdate(newpoints);
        return newpoints;
      });
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
