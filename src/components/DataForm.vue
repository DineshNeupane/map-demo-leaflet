<template>
    <div class="prompt">
      <div>
        Select a date and data to display
      </div>
      <div>
        <input type="date" v-model="date"></input>
      </div>
      <div class="dataTypes">
          <input type="checkbox" v-model='flooding'>Flooding</input>
          <input type="checkbox" v-model='rainfall'>Rainfall</input>
          <input type="checkbox" v-model='tide'>Tide</input>
      </div>
      <div>
        <div class="notloading load" id="floodload">loading</div>
        <div class="notloading load" id="rainload">loading</div>
        <div class="notloading load" id="tideload">loading</div>
      </div>
      <div>
        <button v-on:click="update()">Submit</button>
      </div>
    </div>
</template>

<script>

export default {
  name: 'form',
  props: ['latest', 'day'],
  data() {
    return {
      date: '2017-07-05',
      flooding: false,
      rainfall: false,
      tide: false,
    };
  },
  computed() {
    return {
      date: this.date,
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
        floodload.classList.toggle('notloading');
      }
      if (toToggle.rainfall) {
        const rainload = document.getElementById('rainload');
        rainload.classList.toggle('notloading');
      }
      if (toToggle.tide) {
        const tideload = document.getElementById('tideload');
        tideload.classList.toggle('notloading');
      }
    },
  },
};

</script>

<style scoped>

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
  margin: 0 auto;
  display: inline-block;
}

.dataType {
  display: inline-block;
  padding: 10px;
}

</style>
