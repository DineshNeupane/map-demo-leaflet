<template>
  <div class="hello" v-on:keyup.space="togglePause">
    <MapView
        :points="points"
       ref="map"
    >
    </MapView>
    <timestamp :date="date" :time="time">HELLO</timestamp>
    <div class=controlBox>
      Date
      <input type="date" v-model="date"></input>
    </div>
    <div class=controlBox>
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
import { measureLocations } from '../model/stations';
import PointStore from '../model/pointStore';

const moment = require('moment');
const Promise = require('bluebird');

const points = [];
const rainStore = measureLocations()
  .then(locations =>
    new PointStore(90000, rainReadings, locations));
const tideStore = measureLocations()
  .then(locations =>
    new PointStore(30000, tideReadings, locations));
const levelStore = measureLocations()
  .then(locations =>
    new PointStore(250000, riverReadings, locations));

export default {
  name: 'hello',
  data() {
    return {
      date: '2017-07-14',
      time: '00-00',
      current: false,
      flooding: false,
      rainfall: false,
      tide: false,
      latest: false,
      day: true,
      db: false,
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
    this.checkdate();
  },
  watch: {
    date() {
      if (this.flooding && this.day) {
        levelStore.then(store => store.getDay(this.date));
      }
      if (this.rainfall && this.day) {
        rainStore.then(store => store.getDay(this.date));
      }
      if (this.tide && this.day) {
        tideStore.then(store => store.getDay(this.date));
      }
      this.update(this.date, this.time);
    },
    time() {
      this.update(this.date, this.time);
    },
    flooding() {
      if (this.flooding && this.day) {
        levelStore.then(store => store.getDay(this.date));
      }
      this.update(this.date, this.time);
    },
    rainfall() {
      if (this.rainfall && this.day) {
        rainStore.then(store => store.getDay(this.date));
      }
      this.update(this.date, this.time);
    },
    tide() {
      if (this.tide && this.day) {
        tideStore.then(store => store.getDay(this.date));
      }
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
          this.date = moment(this.date, 'YYYY-MM-DD').format('YYYY-MM-DD');
          this.time = moment(this.time, 'HH-mm')
            .add(15, 'minutes').format('HH-mm');
        }, 30);
      }
    },
    pause() {
      this.intervalId = window.clearInterval(this.intervalId);
    },
    getLatest() {
      let floodingPromise = Promise.resolve([]);
      let rainPromise = Promise.resolve([]);
      let tidePromise = Promise.resolve([]);
      if (this.rainfall) {
        rainPromise = rainStore.then(store => store.getLatest());
      }
      if (this.flooding) {
        floodingPromise = levelStore.then(store => store.getLatest());
      }
      if (this.tide) {
        tidePromise = tideStore.then(store => store.getLatest());
      }
      return Promise.join(floodingPromise, rainPromise, tidePromise,
        (levelPoints, rainPoints, tidePoints) =>
          ({ levelPoints, rainPoints, tidePoints }));
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
    newGetDate() {
      const rainPromise = rainStore.then(rain =>
        rain.getPoint(`${this.date} ${this.time}`));
      const levelPromise = levelStore.then(levels =>
        levels.getPoint(`${this.date} ${this.time}`));
      const tidePromise = tideStore.then(tides =>
        tides.getPoint(`${this.date} ${this.time}`));
      return Promise.join(rainPromise, levelPromise, tidePromise,
        (rainPoints, levelPoints, tidePoints) => ({
          rainPoints, levelPoints, tidePoints }));
    },
    checkdate() {
      let valuePromises;
      if (this.latest) {
        valuePromises = this.getLatest();
      } else if (this.day) {
        valuePromises = this.newGetDate();
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

.controlBox {
  background-color: #333333;
  color: green;
}

</style>
