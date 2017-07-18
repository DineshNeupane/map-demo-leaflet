<template>
  <div class="hello" v-on:keyup.space="togglePause">
    <MapView ref="map"></MapView>
    <DataForm
      @input="setData" ref="form"
    ></DataForm>
    <timestamp :date="date" :time="time"></timestamp>
  </div>
</template>

<script>
import MapView from './Map';
import DataForm from './DataForm';
import timestamp from './timestamp';
import DataModel from '../model/dataModel';

const moment = require('moment');

const dataModel = new DataModel();
const rainOptions = { color: 'blue', weight: 1 };
const tideOptions = {
  color: 'red',
  weight: 1,
  marker: { color: 'red', width: 10 },
};

function nearestQuarterHour() {
  const quarters = Math.floor(moment().minute() / 15) * 15;
  return moment().set('minute', quarters).format('HH-mm');
}

export default {
  name: 'hello',
  data() {
    return {
      date: '2017-07-14',
      time: nearestQuarterHour(),
      flooding: true,
      rainfall: true,
      tide: true,
      latest: true,
      day: false,
    };
  },
  components: {
    MapView,
    timestamp,
    DataForm,
  },
  mounted() {
    this.checkdate();
  },
  watch: {
    date() {
      dataModel.getDate(this.date, this.getSelected());
    },
  },
  methods: {
    getSelected() {
      return {
        flooding: this.flooding,
        tide: this.tide,
        rainfall: this.rainfall,
      };
    },
    setData(formData) {
      this.flooding = formData.flooding;
      this.rainfall = formData.rainfall;
      this.tide = formData.tide;
      this.date = formData.date;
      this.latest = false;
      this.day = true;
      console.log(this.rainfall);
      const datePromises = dataModel.getDate(this.date, this.getSelected());
      this.$refs.form.toggleLoad(this.getSelected());
      Object.keys(datePromises).map(key =>
        datePromises[key].promise.then(() => {
          const loadObj = {};
          loadObj[datePromises[key].type] = true;
          console.log(loadObj);
          this.$refs.form.toggleLoad(loadObj);
          this.play();
          return null;
        }),
      );
    },
    play() {
      if (!this.intervalId) {
        this.intervalId = window.setInterval(() => {
          this.date = moment(this.date, 'YYYY-MM-DD').format('YYYY-MM-DD');
          this.time = moment(this.time, 'HH-mm')
            .add(15, 'minutes').format('HH-mm');
          this.checkdate(this.date, this.time);
        }, 50);
      }
    },
    pause() {
      this.intervalId = window.clearInterval(this.intervalId);
    },
    checkdate() {
      let valuePromises;
      if (this.latest) {
        valuePromises = dataModel.getLatest(this.getSelected());
      } else if (this.day) {
        valuePromises =
          dataModel.getAPIPoint(this.date, this.time, this.getSelected());
      }
      return valuePromises.then((values) => {
        const data = {
          rainData: { data: values.rainPoints, options: rainOptions },
          levelData: { data: values.levelPoints, options: {} },
          tideData: { data: values.tidePoints, options: tideOptions },
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
