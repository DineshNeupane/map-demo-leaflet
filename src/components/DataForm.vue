<template>
    <div class="prompt">
      <div>
        Select a date and data to display
      </div>
      <div class="dateBox">
        <!--potentially use vue date here -->
        <input type="date" v-model="date" v-bind:min="min" v-bind:max="max">
        </input>
      </div>
      <div class="dataTypes">
          <div>
            <input class="checkbox" type="checkbox" v-model='tide'></input>
            Tide
            <span class="notloading load" id="tideload">
              Loading {{tideProgress}}
            </span>
          </div>
          <div>
            <input class="checkbox" type="checkbox" v-model='rainfall'></input>
            Rainfall
            <span class="notloading load" id="rainload">
              Loading {{rainProgress}}
            </span>
          </div>
          <div>
            <input class="checkbox" type="checkbox" v-model='flooding'></input>
            <span>Flooding </span>
            <span class="notloading load" id="floodload">
              Loading {{floodProgress}}
            </span>
          </div>
      </div>
      <div>
        <button v-on:click="update()">Submit</button>
      </div>
    </div>
</template>

<script>
const moment = require('moment');

export default {
  name: 'form',
  props: ['latest', 'day'],
  data() {
    return {
      date: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      flooding: false,
      rainfall: false,
      tide: false,
      floodProgress: '',
      rainProgress: '',
      tideProgress: '',
      min: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      max: moment().format('YYYY-MM-DD'),
    };
  },
  computed() {
    return {
      flooding: this.flooding,
      rainfall: this.rainfall,
      tide: this.tide,
    };
  },
  methods: {
    update() {
      this.$emit('input', {
        flooding: this.flooding,
        rainfall: this.rainfall,
        tide: this.tide,
        date: this.date,
      });
    },
    toggleLoad(toToggle) {
      if (toToggle.flooding) {
        const floodload = document.getElementById('floodload');
        if (toToggle.flooding === 'fail') {
          this.floodProgress = 'Failed';
        } else {
          floodload.classList.toggle('notloading');
          this.floodProgress = '';
        }
      }
      if (toToggle.rainfall) {
        const rainload = document.getElementById('rainload');
        if (toToggle.rainfall === 'fail') {
          this.rainProgress = 'Failed';
        } else {
          rainload.classList.toggle('notloading');
          this.rainProgress = '';
        }
      }
      if (toToggle.tide) {
        const tideload = document.getElementById('tideload');
        if (toToggle.tide === 'fail') {
          this.rainProgress = 'Failed';
        } else {
          tideload.classList.toggle('notloading');
          this.tideProgress = '';
        }
      }
    },
    loadingPercent(percentObj) {
      if (percentObj.flooding) {
        this.floodProgress = `${Math.floor(percentObj.flooding * 100)}%`;
      }
      if (percentObj.rainfall) {
        this.rainProgress = `${Math.floor(percentObj.rainfall * 100)}%`;
      }
      if (percentObj.tide) {
        this.tideProgress = `${Math.floor(percentObj.tide * 100)}%`;
      }
    },
  },
};

</script>

<style scoped>

.dateBox {
  margin: 10px 0;
}

.notloading {
  visibility: hidden;
}

.prompt {
  position: absolute;
  top: 70%;
  right: 5%;
  padding: 5px;
  z-index: 1001;
  background: white;
}

.load {
  display: inline-block;
  float: right;
}

.dataType {
  display: inline-block;
  padding: 10px;
}

.dataTypes {
  text-align: left;
}

.dataTypes div {
  padding: 0 15px;
}

</style>
