<template>
  <div>
    <div class="bg">{{datestring}}</div>
  </div>
</template>

<script>
  const moment = require('moment');

  module.exports = {
    name: 'timestamp',
    computed: {
      datestring() {
        return moment(`${this.date} ${this.time}`, 'YYYY-MM-DD HH-mm')
          .format('MMMM Do YYYY, HH:mm');
      },
    },
    props: ['date', 'time'],
  };
</script>

<style scoped>
.bg {
  height: 8vh;
  width: 100%;
  background-color: #333333;
  font-size: 6vh;
  color: #00AA01;
  overflow: hidden;
}
</style>
