<template>
  <div class="hello">
    <MapView
        :points="points"
       ref="map"
    >
    </MapView>
    <timestamp :date="date" :time="time">HELLO</timestamp>
    <div id=controlBox>
      <div class=control v-on:click="play">PLAY</div>
      <div class=control v-on:click="pause">PAUSE</div>
    <input type="date" v-model="date"></input>
    <input type="time" v-model="time" step="900"></input>
    <input type="checkbox" v-model="flooding">Flooding Data</input>
    <input type="checkbox" v-model="rainfall">Rainfall Data</input>
    </div>
  </div>
</template>

<script>
import MapView from './Map';
import timestamp from './timestamp';
import { getPoints, getLevels } from '../services/pointdb';
// import { stationReadings } from '../services/gauge-api';

const moment = require('moment');
const Promise = require('bluebird');

const points = [];

export default {
  name: 'hello',
  data() {
    return {
      date: '2017-05-17 14:00:00',
      time: '00:00:00',
      flooding: true,
      rainfall: true,
      points,
    };
  },
  components: {
    MapView,
    timestamp,
  },
  mounted() {
    this.play();
  },
  watch: {
    date: function date() {
      this.checkdate(this.date, this.time);
    },
    time: function time() {
      this.checkdate(this.date, this.time);
    },
  },
  methods: {
    play: function play() {
      this.intervalId = window.setInterval(() => {
        const temp = moment(`${this.date} ${this.time}`, 'YYYY-MM-DD HH:mm').add(15, 'minutes');
        this.date = moment(temp, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
        this.time = moment(temp, 'YYYY-MM-DD HH:mm').format('HH:mm');
      }, 500);
    },
    pause: function pause() {
      window.clearInterval(this.intervalId);
    },
    checkdate: function checkdate() {
      let floodingPromise;
      let rainPromise;
      if (this.flooding) {
        floodingPromise = getLevels(this.date, this.time);
      } else {
        floodingPromise = Promise.resolve([]);
      }
      if (this.rainfall) {
        rainPromise = getPoints(this.date, this.time);
      } else {
        rainPromise = Promise.resolve([]);
      }
      Promise.join(rainPromise, floodingPromise,
        (rainPoints, levelPoints) => {
          console.log(levelPoints);
          const data = {
            rainData: { data: rainPoints, options: { custScale: 0.5, weight: 2 } },
            levelData: { data: levelPoints, options: { custScale: 0.5, weight: 1, color: 'red' } },
          };
          this.$refs.map.pointsUpdate(data);
        });
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

.control {
  display: inline-block;
  height: 20px;
  font-size: 2em;
  color: green;
  margin: 0 10px;
}

#controlBox {
  background-color: #333333;
  color: green;
}
</style>
