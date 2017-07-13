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
import
  { rainReadings, tideReadings, riverReadings }
    from '../services/tide-api';
import { measureLocations, readingArrayToDataPoints } from '../model/stations';

const moment = require('moment');
const Promise = require('bluebird');

const points = [];


export default {
  name: 'hello',
  data() {
    return {
      date: '2017-03-04',
      time: '00:00:00',
      current: false,
      flooding: false,
      rainfall: true,
      tide: false,
      latest: true,
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
    date() {
      this.update(this.date, this.time);
    },
    time() {
      this.update(this.date, this.time);
    },
    flooding() {
      this.update(this.date, this.time);
    },
    rainfall() {
      this.update(this.date, this.time);
    },
  },
  methods: {
    togglePause() {
      if (!this.intervalId) {
        this.play();
      } else {
        this.pause();
      }
    },
    update(date, time) {
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
    play() {
      if (!this.intervalId) {
        this.intervalId = window.setInterval(() => {
          if (!this.lock) {
            this.lock = true;
            const temp = moment(`${this.date} ${this.time}`, 'YYYY-MM-DD HH:mm')
              .add(15, 'minutes');
            this.date = moment(temp, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
            this.time = moment(temp, 'YYYY-MM-DD HH:mm').format('HH:mm');
            this.lock = false;
          }
        }, 40);
      }
    },
    pause() {
      this.intervalId = window.clearInterval(this.intervalId);
    },
    getLatest() {
      return measureLocations()
        .then((locations) => {
          let floodingPromise = Promise.resolve([]);
          let rainPromise = Promise.resolve([]);
          let tidePromise = Promise.resolve([]);
          if (this.rainfall) {
            rainPromise = rainReadings()
              .then(rain => readingArrayToDataPoints(locations, rain));
          }
          if (this.flooding) {
            floodingPromise = riverReadings()
              .then(levels => readingArrayToDataPoints(locations, levels));
          }
          if (this.tide) {
            tidePromise = tideReadings()
              .then(tides => readingArrayToDataPoints(locations, tides));
          }
          return Promise.join(floodingPromise, rainPromise, tidePromise,
            (levelPoints, rainPoints, tidePoints) =>
              ({ levelPoints, rainPoints, tidePoints }));
        });
    },
    getDate() {
      let floodingPromise = Promise.resolve([]);
      let rainPromise = Promise.resolve([]);
      let tidePromise = Promise.resolve([]);
      if (this.flooding) {
        floodingPromise = getLevels(this.date, this.time);
      }
      if (this.rainfall) {
        rainPromise = getPoints(this.date, this.time);
      }
      if (this.tide) {
        tidePromise = getTide(this.date, this.time);
      }
      return Promise.join(floodingPromise,
        rainPromise,
        tidePromise,
        (levelPoints, rainPoints, tidePoints) =>
          ({ levelPoints, rainPoints, tidePoints }));
    },
    checkdate() {
      let valuePromises;
      if (this.latest) {
        valuePromises = this.getLatest();
      } else {
        valuePromises = this.getDate();
      }
      return valuePromises.then((values) => {
        const data = {
          rainData: {
            data: values.rainPoints,
            options: { color: 'blue', weight: 1 },
          },
          levelData: { data: values.levelPoints, options: {} },
          tideData: {
            data: values.tidePoints,
            options: {
              color: 'red',
              weight: 1,
              marker: { color: 'red', width: 10 } },
          },
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
