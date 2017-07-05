<template>
  <div class="hello" v-on:keyup.space="togglePause">
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
    <input type="checkbox" v-model="tide">Tide Data</input>
    </div>
  </div>
</template>

<script>
import MapView from './Map';
import timestamp from './timestamp';
import { getPoints, getLevels, getTide } from '../services/pointdb';

const moment = require('moment');
const Promise = require('bluebird');

const points = [];

export default {
  name: 'hello',
  data() {
    return {
      date: '2017-05-17',
      time: '00:00:00',
      flooding: true,
      rainfall: true,
      tide: true,
      playing: true,
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
      this.update(this.date, this.time);
    },
    time: function time() {
      this.update(this.date, this.time);
    },
    flooding: function flooding() {
      this.update(this.date, this.time);
    },
    rainfall: function rainfall() {
      this.update(this.date, this.time);
    },
  },
  methods: {
    togglePause: function togglePause() {
      if (!this.intervalId) {
        this.play();
      } else {
        this.pause();
      }
    },
    update: function update(date, time) {
      if (!this.lock) {
        this.lock = true;
        this.checkdate(date, time)
          .then(() => {
            this.lock = false;
          })
          .catch((error) => {
            // Rejection, db connection failed
            console.log(error);
          });
      }
    },
    play: function play() {
      if (!this.intervalId) {
        this.intervalId = window.setInterval(() => {
          if (!this.lock) {
            this.lock = true;
            const temp = moment(`${this.date} ${this.time}`, 'YYYY-MM-DD HH:mm').add(15, 'minutes');
            this.date = moment(temp, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
            this.time = moment(temp, 'YYYY-MM-DD HH:mm').format('HH:mm');
            this.lock = false;
          }
        }, 30);
      }
    },
    pause: function pause() {
      this.intervalId = window.clearInterval(this.intervalId);
    },
    checkdate: function checkdate() {
      let floodingPromise;
      let rainPromise;
      let tidePromise;
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
      if (this.tide) {
        tidePromise = getTide(this.date, this.time);
      } else {
        tidePromise = Promise.resolve([]);
      }
      return Promise.join(rainPromise, floodingPromise, tidePromise,
        (rainPoints, levelPoints, tidePoints) => {
          const data = {
            rainData: { data: rainPoints, options: { custScale: 0.5, weight: 1 } },
            levelData: { data: levelPoints, options: {} },
            tideData: { data: tidePoints, options: { color: 'red', weight: 2, marker: { color: 'red', width: 10 } } },
          };
          this.$refs.map.pointsUpdate(data);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
